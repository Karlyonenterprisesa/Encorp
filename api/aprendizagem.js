/* /api/aprendizagem — progresso, conteúdo protegido e testes com correcção no servidor.
   Todas as rotas exigem sessão válida. Os dados dos cursos (respostas certas incluídas) vivem em api/_dados/cursos.json,
   gerado no build e NUNCA servido como ficheiro estático (ver vercel.json).
   GET  ?curso=slug                 → estado de cada aula (sem conteúdo)
   GET  ?curso=slug&aula=N          → conteúdo da aula N, só se estiver desbloqueada
   POST {acao:'slide',curso,aula,i}            → regista o slide i como visto (ritmo mínimo imposto aqui)
   POST {acao:'video',curso,aula,evento}       → 'inicio' | 'fim'
   POST {acao:'concluir',curso,aula}           → aulas sem teste: só se slides/vídeo estiverem cumpridos
   POST {acao:'teste-iniciar',curso,aula}      → devolve as 10 perguntas, sem respostas certas, com ordem baralhada
   POST {acao:'teste-submeter',curso,aula,tid,respostas[10]} → corrige no servidor */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const kv = require('./_lib/kv');
const S = require('./_lib/seguranca');

/* Tempo mínimo por slide: calculado no build a partir do nº de palavras (ou fixado no CMS, campo «tempo»). Mínimo absoluto: 3 s.
   ENCORP_MIN_SLIDE_MS (só para testes automáticos) impõe o mesmo valor a todos os slides. */
const MIN_FIXO = process.env.ENCORP_MIN_SLIDE_MS ? Number(process.env.ENCORP_MIN_SLIDE_MS) : null;
const minSlideMs = (a, k) => (MIN_FIXO != null ? MIN_FIXO : Math.max(3000, (Number(((a.slides || [])[k] || {}).min) || 10) * 1000));
const FRACAO_VIDEO = 0.9;   // % do vídeo que tem de ser realmente visto (tempo de reprodução)
let CURSOS = null;
const cursos = () => {
  if (CURSOS) return CURSOS;
  try { CURSOS = JSON.parse(fs.readFileSync(path.join(__dirname, '_dados', 'cursos.json'), 'utf8')); } catch (e) { CURSOS = {}; }
  return CURSOS;
};
const embaralhar = (n) => { const a = [...Array(n).keys()]; for (let i = n - 1; i > 0; i--) { const j = crypto.randomInt(0, i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };

const chaveProg = (uid, curso) => `prog:${uid}:${curso}`;
async function lerProg(uid, curso) { const r = await kv.get(chaveProg(uid, curso)); return r ? JSON.parse(r) : { aulas: {} }; }
const gravarProg = (uid, curso, p) => kv.set(chaveProg(uid, curso), JSON.stringify(p));
const pa = (p, i) => (p.aulas[i] ||= { vistos: 0, slideTs: 0, videoInicio: 0, videoFim: 0, videoSeg: 0, videoUlt: 0, videoDur: 0, tentativas: 0, ultima: 0, melhor: 0, aprovado: false, concluida: 0 });

const temVideo = (a) => !!(a.video && (a.video.youtube || a.video.ficheiro));
const videoObrig = (a) => temVideo(a) && a.video.obrigatorio !== false;   // com vídeo, é obrigatório (salvo se desligado no CMS)
const videoNecessarioSeg = (a, x) => { const m = Number(a.video && a.video.minutos) || 0; const d = m > 0 ? m * 60 : (Number(x.videoDur) || 0); return d > 0 ? Math.ceil(d * FRACAO_VIDEO) : 0; };
function requisitos(a, x) {
  const falta = [];
  const n = (a.slides || []).length;
  if (n && !(x.vistos >= n && Date.now() - x.slideTs >= minSlideMs(a, n - 1))) falta.push('slides');
  if (videoObrig(a) && !x.videoFim) falta.push('video');
  return falta;
}
function desbloqueada(c, p, i) { return c.sequencial === false || i === 0 || !!(p.aulas[i - 1] && p.aulas[i - 1].concluida); }
const maxTent = (c, a) => (a.teste && Number.isInteger(a.teste.tentativas) ? a.teste.tentativas : c.tentativas);
const notaMin = (c, a) => (a.teste && a.teste.notaMinima) || c.notaMinima;

function estadoAula(c, p, a, i) {
  const x = p.aulas[i] || {};
  return {
    titulo: a.titulo, resumo: a.resumo || '', duracao: a.duracao || '',
    estado: x.concluida ? 'concluida' : (desbloqueada(c, p, i) ? 'disponivel' : 'bloqueada'),
    temPptx: !!a.pptx, nSlides: (a.slides || []).length, slidesVistos: Math.min(x.vistos || 0, (a.slides || []).length),
    temVideo: temVideo(a), videoObrigatorio: videoObrig(a), videoVisto: !!x.videoFim,
    temTeste: !!a.teste, tentativas: x.tentativas || 0, melhor: x.melhor || 0, aprovado: !!x.aprovado,
  };
}
const resumoCurso = (c, p) => ({ titulo: c.titulo, notaMinima: c.notaMinima, tentativas: c.tentativas, sequencial: c.sequencial !== false, aulas: c.aulas.map((a, i) => estadoAula(c, p, a, i)), concluido: c.aulas.length > 0 && c.aulas.every((_, i) => p.aulas[i] && p.aulas[i].concluida) });

module.exports = async (req, res) => {
  try {
    if (!S.pronto()) return S.enviar(res, 503, { erro: 'As contas de estudante ainda não estão configuradas neste site.', configurado: false });
    const sessao = await S.lerSessao(req);
    if (!sessao) return S.enviar(res, 401, { erro: 'Inicie sessão para continuar.', semSessao: true });
    const uid = sessao.uid;
    const q = new URL(req.url, 'http://x').searchParams;

    if (req.method === 'GET') {
      const slug = String(q.get('curso') || '');
      const c = /^[a-z0-9-]{1,120}$/.test(slug) ? cursos()[slug] : null;
      if (!c) return S.enviar(res, 404, { erro: 'Curso não encontrado.' });
      const p = await lerProg(uid, slug);
      if (!q.has('aula')) return S.enviar(res, 200, resumoCurso(c, p));
      const i = Number(q.get('aula'));
      if (!Number.isInteger(i) || i < 0 || i >= c.aulas.length) return S.enviar(res, 404, { erro: 'Aula não encontrada.' });
      if (!desbloqueada(c, p, i)) return S.enviar(res, 403, { erro: 'Conclua e aprove a aula anterior para abrir esta.', bloqueada: true });
      const a = c.aulas[i];
      if (q.get('pptx') === '1') {   // PowerPoint da aula: só para quem tem a aula desbloqueada
        const f = path.join(__dirname, '_dados', 'slides', slug, `aula-${i + 1}.pptx`);
        if (!a.pptx || !fs.existsSync(f)) return S.enviar(res, 404, { erro: 'Esta aula não tem PowerPoint.' });
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
        res.setHeader('Content-Disposition', `attachment; filename="${slug}-aula-${i + 1}.pptx"`);
        res.setHeader('Cache-Control', 'private, no-store');
        return res.end(fs.readFileSync(f));
      }
      return S.enviar(res, 200, {
        ...estadoAula(c, p, a, i), html: a.html || '', slides: (a.slides || []).map((s) => ({ titulo: s.titulo || '', html: s.html || '', imagem: s.imagem || '', tipo: s.tipo || 'conteudo' })),
        video: temVideo(a) ? (() => { const x = p.aulas[i] || {}; return { youtube: a.video.youtube || '', ficheiro: a.video.ficheiro || '', necessarioSeg: videoNecessarioSeg(a, x), vistoSeg: Math.round(x.videoSeg || 0) }; })() : null,
        teste: a.teste ? { total: a.teste.perguntas.length, notaMinima: notaMin(c, a), tentativasMax: maxTent(c, a) } : null,
      });
    }

    if (req.method !== 'POST') return S.enviar(res, 405, { erro: 'Método não permitido.' }, { Allow: 'GET, POST' });
    if (!S.pedidoSeguro(req)) return S.enviar(res, 400, { erro: 'Pedido inválido.' });
    let b; try { b = await S.lerCorpo(req); } catch (e) { return S.enviar(res, 400, { erro: 'Pedido inválido.' }); }
    const slug = String(b.curso || ''), i = Number(b.aula);
    const c = /^[a-z0-9-]{1,120}$/.test(slug) ? cursos()[slug] : null;
    if (!c || !Number.isInteger(i) || i < 0 || i >= c.aulas.length) return S.enviar(res, 404, { erro: 'Aula não encontrada.' });
    const a = c.aulas[i], p = await lerProg(uid, slug);
    if (!desbloqueada(c, p, i)) return S.enviar(res, 403, { erro: 'Aula bloqueada.', bloqueada: true });
    const x = pa(p, i), agora = Date.now();

    if (b.acao === 'slide') {
      const n = (a.slides || []).length, k = Number(b.i);
      if (!Number.isInteger(k) || k < 0 || k >= n) return S.enviar(res, 400, { erro: 'Slide inválido.' });
      if (k > x.vistos) return S.enviar(res, 409, { erro: 'Veja os slides pela ordem.', proximo: x.vistos });
      if (k === x.vistos) {
        if (x.vistos > 0 && agora - x.slideTs < minSlideMs(a, k - 1)) return S.enviar(res, 429, { erro: 'Leia o slide antes de avançar.', esperaMs: minSlideMs(a, k - 1) - (agora - x.slideTs) });
        x.vistos = k + 1; x.slideTs = agora; await gravarProg(uid, slug, p);
      }
      /* tempo que ainda falta no slide mais recente (continua certo depois de recarregar a página); slides já passados: 0 */
      const restanteMs = k === x.vistos - 1 ? Math.max(0, minSlideMs(a, k) - (agora - x.slideTs)) : 0;
      return S.enviar(res, 200, { vistos: x.vistos, total: n, restanteMs });
    }

    if (b.acao === 'video') {
      if (!temVideo(a)) return S.enviar(res, 200, { ok: true, semVideo: true });
      if (requisitos(a, x).includes('slides')) return S.enviar(res, 403, { erro: 'Veja primeiro todos os slides.', faltam: ['slides'] });   // o vídeo-resumo vem depois dos slides
      const resp = () => ({ ok: true, vistoSeg: Math.round(x.videoSeg || 0), necessarioSeg: videoNecessarioSeg(a, x), completo: !!x.videoFim });
      if (b.evento === 'inicio') { if (!x.videoInicio) x.videoInicio = agora; x.videoUlt = agora; await gravarProg(uid, slug, p); return S.enviar(res, 200, resp()); }
      if (b.evento === 'batida') {          // o leitor diz quantos segundos reproduziu desde a última batida; o servidor nunca credita mais do que o tempo real decorrido
        if (!x.videoInicio) return S.enviar(res, 409, { erro: 'Inicie o vídeo primeiro.' });
        const dt = x.videoUlt ? (agora - x.videoUlt) / 1000 : 0, rel = Math.max(0, Math.min(Number(b.seg) || 0, dt + 2, 30));
        x.videoSeg = (x.videoSeg || 0) + rel; x.videoUlt = agora;
        const dur = Number(b.dur); if (!x.videoDur && Number.isFinite(dur) && dur >= 5 && dur <= 14400) x.videoDur = Math.round(dur);
        const nec = videoNecessarioSeg(a, x); if (nec > 0 && x.videoSeg >= nec && !x.videoFim) x.videoFim = agora;
        await gravarProg(uid, slug, p); return S.enviar(res, 200, resp());
      }
      if (b.evento === 'fim') {
        if (!x.videoInicio) return S.enviar(res, 409, { erro: 'Inicie o vídeo primeiro.' });
        const nec = videoNecessarioSeg(a, x);
        if (nec > 0 ? x.videoSeg < nec : agora - x.videoInicio < 20000) return S.enviar(res, 429, { erro: 'Veja o vídeo até ao fim.', faltaSeg: Math.max(0, Math.ceil(nec - (x.videoSeg || 0))) });
        if (!x.videoFim) { x.videoFim = agora; await gravarProg(uid, slug, p); }
        return S.enviar(res, 200, resp());
      }
      return S.enviar(res, 400, { erro: 'Evento inválido.' });
    }

    if (b.acao === 'concluir') {
      if (a.teste) return S.enviar(res, 400, { erro: 'Esta aula conclui-se aprovando o teste.' });
      const falta = requisitos(a, x);
      if (falta.length) return S.enviar(res, 403, { erro: 'Ainda faltam requisitos da aula.', faltam: falta });
      if (!x.concluida) { x.concluida = agora; await gravarProg(uid, slug, p); }
      return S.enviar(res, 200, resumoCurso(c, p));
    }

    if (b.acao === 'teste-iniciar') {
      if (!a.teste) return S.enviar(res, 404, { erro: 'Esta aula não tem teste.' });
      if (a.teste.perguntas.length !== 10) return S.enviar(res, 409, { erro: 'Teste indisponível: tem de ter exactamente 10 perguntas.' });
      if (x.aprovado) return S.enviar(res, 409, { erro: 'Já aprovou este teste.' });
      const falta = requisitos(a, x);
      if (falta.length) return S.enviar(res, 403, { erro: falta.includes('video') ? 'Veja os slides e o vídeo-resumo antes do teste.' : 'Veja todos os slides antes do teste.', faltam: falta });
      const max = maxTent(c, a), espera = (c.esperaMinutos ?? 30) * 60000;
      if (max > 0 && x.tentativas >= max) {
        const livreEm = x.ultima + espera;
        if (agora < livreEm) return S.enviar(res, 403, { erro: 'Esgotou as tentativas. Reveja a matéria e tente de novo mais tarde.', esgotado: true, esperaMs: livreEm - agora });
        x.tentativas = 0; await gravarProg(uid, slug, p);
      }
      const ordem = embaralhar(10), opc = ordem.map((qi) => embaralhar(a.teste.perguntas[qi].opcoes.length));
      const tid = crypto.randomBytes(16).toString('hex');
      await kv.set('tent:' + tid, JSON.stringify({ uid, slug, i, ordem, opc, t0: agora }), { ex: 7200 });
      return S.enviar(res, 200, {
        tid, notaMinima: notaMin(c, a), tentativasRestantes: max > 0 ? max - x.tentativas : null,
        perguntas: ordem.map((qi, k) => ({ pergunta: a.teste.perguntas[qi].pergunta, opcoes: opc[k].map((oi) => a.teste.perguntas[qi].opcoes[oi]) })),
      });
    }

    if (b.acao === 'teste-submeter') {
      if (!a.teste) return S.enviar(res, 404, { erro: 'Esta aula não tem teste.' });
      const tid = String(b.tid || '');
      if (!/^[a-f0-9]{32}$/.test(tid)) return S.enviar(res, 400, { erro: 'Tentativa inválida.' });
      const raw = await kv.get('tent:' + tid), t = raw ? JSON.parse(raw) : null;
      if (!t || t.uid !== uid || t.slug !== slug || t.i !== i) return S.enviar(res, 400, { erro: 'Tentativa inválida ou expirada. Comece o teste de novo.' });
      await kv.del('tent:' + tid);                                         // uma tentativa só pode ser submetida uma vez
      if (!Array.isArray(b.respostas) || b.respostas.length !== 10) return S.enviar(res, 400, { erro: 'Responda às 10 perguntas.' });
      let certas = 0; const certasPorPergunta = [];
      t.ordem.forEach((qi, k) => {
        const q = a.teste.perguntas[qi], r = b.respostas[k];
        const escolhida = Number.isInteger(r) && r >= 0 && r < t.opc[k].length ? t.opc[k][r] : -1;   // índice original da opção
        const certa = escolhida === q.correta - 1;
        if (certa) certas++;
        certasPorPergunta.push(certa);
      });
      const pct = Math.round((certas / 10) * 100), min = notaMin(c, a), aprovado = pct >= min;
      x.tentativas += 1; x.ultima = agora; x.melhor = Math.max(x.melhor, pct);
      if (aprovado) { x.aprovado = true; x.concluida = x.concluida || agora; }
      await gravarProg(uid, slug, p);
      const max = maxTent(c, a);
      const out = { pontuacao: certas, total: 10, percentagem: pct, notaMinima: min, aprovado, marcas: certasPorPergunta, tentativasRestantes: max > 0 ? Math.max(0, max - x.tentativas) : null };   // reprovado: só a nota, sem dizer que perguntas falhou (evita deduzir respostas por tentativas sucessivas)
      if (aprovado) out.correcao = t.ordem.map((qi, k) => { const q = a.teste.perguntas[qi]; return { certa: certasPorPergunta[k], correta: q.opcoes[q.correta - 1], explicacao: q.explicacao || '' }; });   // correcção e soluções só depois de aprovar
      out.curso = resumoCurso(c, p);
      return S.enviar(res, 200, out);
    }
    return S.enviar(res, 400, { erro: 'Acção desconhecida.' });
  } catch (e) {
    console.error('aprendizagem:', e && e.message);
    return S.enviar(res, 500, { erro: 'Erro interno. Tente novamente.' });
  }
};
