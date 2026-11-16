/* ENCORP — convite "Instalar app" intermitente (id="ec-instalar").
   Aparece 4 s depois de a página (e os cartões) terminarem de abrir, fica 12 s visível e desaparece;
   volta a cada 5 minutos enquanto a pessoa estiver no site. Nunca aparece com a app já instalada. */
(function () {
  if (window.__ecBotaoInstalar) return;
  window.__ecBotaoInstalar = true;
  var instalada = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
  if (instalada) return;
  var ESPERA = 4000, VISIVEL = 12000, INTERVALO = 300000;
  var evento = window.__ecEventoInstalar || null, btn = null, caixa = null, parado = false, tFim = null;

  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); evento = e; window.__ecEventoInstalar = e; });
  window.addEventListener('appinstalled', function () { parado = true; evento = null; esconder(); });

  function css() {
    if (document.getElementById('ec-inst-css')) return;
    var s = document.createElement('style'); s.id = 'ec-inst-css';
    s.textContent =
      '#ec-instalar{position:fixed;left:calc(14px + env(safe-area-inset-left,0px));bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:89;display:inline-flex;align-items:center;gap:8px;min-height:48px;padding:0 18px 0 14px;border:0;border-radius:99px;background:#0b1a33;color:#fff;font:700 14px/1 Outfit,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;box-shadow:0 4px 14px rgba(0,0,0,.32);cursor:pointer;-webkit-tap-highlight-color:transparent;opacity:0;transform:translateY(12px);transition:opacity .35s,transform .35s}' +
      '#ec-instalar.ec-on{opacity:1;transform:none}' +
      '#ec-instalar svg{width:22px;height:22px;flex:none}' +
      '#ec-instalar:hover,#ec-instalar:focus-visible{background:#0148E0}' +
      '#ec-inst-cx{position:fixed;inset:0;z-index:2147483000;background:rgba(11,26,51,.6);display:flex;align-items:center;justify-content:center;padding:16px}' +
      '#ec-inst-cx .ec-inst-c{background:#fff;color:#0f2547;max-width:420px;width:100%;border-radius:16px;padding:20px 20px 16px;border-bottom:4px solid #e8a317;font:15px/1.5 Outfit,system-ui,-apple-system,Segoe UI,Roboto,sans-serif}' +
      '#ec-inst-cx h2{margin:0 0 8px;font-size:17px;color:#0b1a33}#ec-inst-cx ol{margin:8px 0 14px;padding-left:20px}#ec-inst-cx li{margin:4px 0}' +
      '#ec-inst-cx button{min-height:44px;padding:0 18px;border:0;border-radius:10px;background:#0b1a33;color:#fff;font:700 14px/1 inherit;cursor:pointer}';
    document.head.appendChild(s);
  }

  function instrucoes() {
    var ios = /iphone|ipad|ipod/i.test(navigator.userAgent || '');
    var passos = ios
      ? ['Toque no botão <b>Partilhar</b> (quadrado com seta) do Safari.', 'Escolha <b>Adicionar ao ecrã principal</b>.', 'Toque em <b>Adicionar</b>.']
      : ['Abra o menu do navegador (<b>⋮</b>, no canto superior).', 'Toque em <b>Instalar aplicação</b> ou <b>Adicionar ao ecrã principal</b>.', 'Confirme em <b>Instalar</b>.'];
    caixa = document.createElement('div'); caixa.id = 'ec-inst-cx';
    caixa.setAttribute('role', 'dialog'); caixa.setAttribute('aria-modal', 'true');
    caixa.innerHTML = '<div class="ec-inst-c"><h2>Instalar o ENCORP</h2><p style="margin:0">Use o ENCORP como aplicação no seu telemóvel:</p><ol><li>' + passos.join('</li><li>') + '</li></ol><button type="button">Fechar</button></div>';
    caixa.addEventListener('click', function (e) { if (e.target === caixa || e.target.tagName === 'BUTTON') { if (caixa.parentNode) caixa.parentNode.removeChild(caixa); caixa = null; } });
    document.body.appendChild(caixa);
  }

  function clicar() {
    if (evento) {
      var e = evento; evento = null; window.__ecEventoInstalar = null;
      try { e.prompt(); if (e.userChoice) e.userChoice.then(function (r) { if (r && r.outcome === 'accepted') { parado = true; esconder(); } }); } catch (x) { instrucoes(); }
    } else instrucoes();
  }

  function acima() {
    var nav = document.querySelector('.bottom-nav');
    if (!btn) return;
    btn.style.bottom = nav ? 'calc(' + Math.round((nav.getBoundingClientRect().height || 64) + 14) + 'px + env(safe-area-inset-bottom,0px))' : '';
  }

  function mostrar() {
    if (parado || document.hidden || caixa || btn) return false;
    css();
    btn = document.createElement('button'); btn.id = 'ec-instalar'; btn.type = 'button';
    btn.setAttribute('aria-label', 'Instalar a aplicação ENCORP');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12"/><path d="m7 11 5 5 5-5"/><path d="M5 20h14"/></svg><span>Instalar app</span>';
    btn.addEventListener('click', clicar);
    document.body.appendChild(btn); acima();
    requestAnimationFrame(function () { requestAnimationFrame(function () { if (btn) btn.classList.add('ec-on'); }); });
    clearTimeout(tFim); tFim = setTimeout(esconder, VISIVEL);
    return true;
  }

  function esconder() {
    clearTimeout(tFim);
    if (!btn) return;
    var b = btn; btn = null; b.classList.remove('ec-on');
    setTimeout(function () { if (b.parentNode) b.parentNode.removeChild(b); }, 450);
  }

  function agendar(ms) {
    setTimeout(function () {
      if (parado) return;
      if (!mostrar()) {   /* separador em segundo plano ou janela aberta: tenta quando voltar */
        var f = function () { if (!document.hidden) { document.removeEventListener('visibilitychange', f); agendar(1500); } };
        if (document.hidden) document.addEventListener('visibilitychange', f); else agendar(5000);
        return;
      }
      agendar(INTERVALO + VISIVEL);   /* a próxima vez: 5 minutos depois de este desaparecer */
    }, ms);
  }

  function ini() { agendar(ESPERA); }
  if (document.readyState === 'complete') ini(); else window.addEventListener('load', ini);
})();
