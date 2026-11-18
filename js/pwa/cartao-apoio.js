/* ENCORP — cartão «Apoiar o projeto» intermitente (id="ec-apoio").
   Aparece de 5 em 5 minutos enquanto a pessoa estiver no site, fica 7 segundos e desaparece.
   O 1.º aparece aos 2 min 30 s, para não coincidir com o convite de instalação (que usa os 5 min certos).
   Não aparece em /apoiar, /admin, /conta, com o separador em segundo plano, nem se o convite de instalação estiver aberto.
   Se a pessoa tocar em «Apoiar», deixa de aparecer durante 7 dias. */
(function () {
  if (window.__ecCartaoApoio) return;
  window.__ecCartaoApoio = true;
  var p = location.pathname;
  if (/^\/(apoiar|admin|conta|offline)/.test(p)) return;
  var T = window.__ecApoioTempos || {}, PRIMEIRO = T.primeiro || 150000, INTERVALO = T.intervalo || 300000, VISIVEL = T.visivel || 7000, CHAVE = 'ec:apoio:clicou', cx = null, tFim = null, tOcultar = null;
  function lerClique() { try { return +localStorage.getItem(CHAVE) || 0; } catch (e) { return 0; } }
  function gravarClique() { try { localStorage.setItem(CHAVE, String(Date.now())); } catch (e) { /* ignorar */ } }
  if (Date.now() - lerClique() < 7 * 864e5) return;

  function css() {
    if (document.getElementById('ec-apoio-css')) return;
    var s = document.createElement('style'); s.id = 'ec-apoio-css';
    s.textContent =
      '#ec-apoio{position:fixed;right:calc(14px + env(safe-area-inset-right,0px));bottom:calc(96px + env(safe-area-inset-bottom,0px));z-index:88;width:min(300px,calc(100vw - 28px));box-sizing:border-box;overflow:hidden;background:#fff;color:#0f2547;border:1px solid #dfe6f0;border-left:5px solid #f28c1c;border-radius:14px;box-shadow:0 8px 26px rgba(11,26,51,.28);font:15px/1.4 Outfit,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;opacity:0;transform:translateY(14px);transition:opacity .35s,transform .35s}' +
      '#ec-apoio.ec-on{opacity:1;transform:none}' +
      '#ec-apoio .ec-ap-c{display:flex;gap:12px;align-items:center;padding:12px 38px 14px 12px}' +
      '#ec-apoio .ec-ap-i{flex:none;width:38px;height:38px;border-radius:50%;background:#fff3e0;color:#f28c1c;display:flex;align-items:center;justify-content:center}' +
      '#ec-apoio .ec-ap-i svg{width:21px;height:21px;fill:currentColor}' +
      '#ec-apoio b{display:block;font-size:14px;color:#0b1a33;margin-bottom:2px}' +
      '#ec-apoio span{display:block;font-size:13px;color:#5b6b85}' +
      '#ec-apoio a.ec-ap-b{display:inline-block;margin-top:8px;padding:8px 16px;border-radius:99px;background:#0b1a33;color:#fff;font-weight:700;font-size:13px;text-decoration:none}' +
      '#ec-apoio a.ec-ap-b:hover,#ec-apoio a.ec-ap-b:focus-visible{background:#0148E0}' +
      '#ec-apoio button.ec-ap-x{position:absolute;top:4px;right:4px;width:30px;height:30px;border:0;border-radius:50%;background:transparent;color:#5b6b85;font-size:16px;line-height:1;cursor:pointer}' +
      '#ec-apoio button.ec-ap-x:hover,#ec-apoio button.ec-ap-x:focus-visible{background:#eef3fb;color:#0b1a33}' +
      '#ec-apoio .ec-ap-t{position:absolute;left:0;bottom:0;height:3px;width:100%;background:#f28c1c;transform-origin:left;animation:ecapt linear forwards}' +
      '@keyframes ecapt{from{transform:scaleX(1)}to{transform:scaleX(0)}}' +
      '@media(prefers-reduced-motion:reduce){#ec-apoio{transition:none;transform:none}#ec-apoio .ec-ap-t{animation:none;display:none}}';
    document.head.appendChild(s);
  }
  function ocupado() {   /* convite de instalação visível ou aberto */
    var i = document.getElementById('ec-instalar'), m = document.getElementById('ec-inst-cx');
    return !!m || !!(i && i.classList.contains('ec-on'));
  }
  function esconder() {
    clearTimeout(tOcultar); if (!cx) return;
    var c = cx; cx = null; c.classList.remove('ec-on'); setTimeout(function () { if (c.parentNode) c.parentNode.removeChild(c); }, 400);
  }
  function agendarOcultar(ms) { clearTimeout(tOcultar); tOcultar = setTimeout(esconder, ms); }
  function mostrar() {
    if (cx) return;
    css();
    cx = document.createElement('aside'); cx.id = 'ec-apoio'; cx.setAttribute('role', 'region'); cx.setAttribute('aria-label', 'Apoiar o ENCORP');
    cx.innerHTML = '<div class="ec-ap-c"><div class="ec-ap-i" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 2.6 5 6 5c2 0 3.4 1.1 4 2.2h.01C10.6 6.1 12 5 14 5c3.4 0 5.1 3.4 3.6 6.8C19.5 16.4 12 21 12 21z" transform="translate(1.9 0)"/></svg></div><div><b>Gostou do ENCORP?</b><span>É gratuito. Ajude a manter e a melhorar.</span><a class="ec-ap-b" href="/apoiar.html">Apoiar</a></div></div><button type="button" class="ec-ap-x" aria-label="Fechar">✕</button><div class="ec-ap-t" style="animation-duration:' + VISIVEL + 'ms"></div>';
    document.body.appendChild(cx);
    cx.querySelector('.ec-ap-x').addEventListener('click', esconder);
    cx.querySelector('.ec-ap-b').addEventListener('click', gravarClique);
    cx.addEventListener('mouseenter', function () { clearTimeout(tOcultar); var t = cx && cx.querySelector('.ec-ap-t'); if (t) t.style.animationPlayState = 'paused'; });
    cx.addEventListener('mouseleave', function () { var t = cx && cx.querySelector('.ec-ap-t'); if (t) t.style.display = 'none'; agendarOcultar(2000); });
    cx.addEventListener('focusin', function () { clearTimeout(tOcultar); });
    cx.addEventListener('focusout', function () { agendarOcultar(2000); });
    void cx.offsetWidth; cx.classList.add('ec-on'); agendarOcultar(VISIVEL);
  }
  function tentar() {   /* só mostra com o separador visível e sem o convite de instalação; senão tenta já a seguir */
    if (document.hidden || ocupado()) { tFim = setTimeout(tentar, 6000); return; }
    mostrar(); tFim = setTimeout(tentar, INTERVALO);
  }
  tFim = setTimeout(tentar, PRIMEIRO);
})();
