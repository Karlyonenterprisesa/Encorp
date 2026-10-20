/* ENCORP — botão flutuante "Instalar app" (id="ec-instalar").
   Aparece sempre que a app ainda não está instalada: com o pedido nativo quando o navegador o permite
   e, quando não permite (iPhone/Safari, ou o navegador ainda não ofereceu), com instruções passo a passo. */
(function () {
  if (window.__ecBotaoInstalar) return;
  window.__ecBotaoInstalar = true;
  var instalada = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
  if (instalada) return;

  var evento = window.__ecEventoInstalar || null;
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); evento = e; window.__ecEventoInstalar = e; });
  window.addEventListener('appinstalled', function () { evento = null; remover(); });

  var btn, caixa;
  function remover() { if (btn && btn.parentNode) btn.parentNode.removeChild(btn); if (caixa && caixa.parentNode) caixa.parentNode.removeChild(caixa); }

  function css() {
    var s = document.createElement('style');
    s.textContent =
      '#ec-instalar{position:fixed;left:calc(14px + env(safe-area-inset-left,0px));bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:89;display:inline-flex;align-items:center;gap:8px;min-height:48px;padding:0 18px 0 14px;border:0;border-radius:99px;background:#0b1a33;color:#fff;font:700 14px/1 Outfit,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;box-shadow:0 4px 14px rgba(0,0,0,.32);cursor:pointer;-webkit-tap-highlight-color:transparent;transition:opacity .2s ease,visibility .2s ease}' +
      '#ec-instalar svg{width:22px;height:22px;flex:none}' +
      '#ec-instalar:hover,#ec-instalar:focus-visible{background:#0148E0}' +
      '#ec-instalar.ec-esc{opacity:0;visibility:hidden;pointer-events:none}' +
      '#ec-inst-cx{position:fixed;inset:0;z-index:2147483000;background:rgba(11,26,51,.6);display:flex;align-items:center;justify-content:center;padding:16px}' +
      '#ec-inst-cx .ec-inst-c{background:#fff;color:#0f2547;max-width:420px;width:100%;border-radius:16px;padding:20px 20px 16px;border-bottom:4px solid #e8a317;font:15px/1.5 Outfit,system-ui,-apple-system,Segoe UI,Roboto,sans-serif}' +
      '#ec-inst-cx h2{margin:0 0 8px;font-size:17px;color:#0b1a33}' +
      '#ec-inst-cx ol{margin:8px 0 14px;padding-left:20px}' +
      '#ec-inst-cx li{margin:4px 0}' +
      '#ec-inst-cx button{min-height:44px;padding:0 18px;border:0;border-radius:10px;background:#0b1a33;color:#fff;font:700 14px/1 inherit;cursor:pointer}' +
      '@media(max-width:360px){#ec-instalar{font-size:13px;padding:0 14px 0 12px}}';
    document.head.appendChild(s);
  }

  function instrucoes() {
    var ua = navigator.userAgent || '', ios = /iphone|ipad|ipod/i.test(ua);
    var passos = ios
      ? ['Toque no botão <b>Partilhar</b> (quadrado com seta) do Safari.', 'Escolha <b>Adicionar ao ecrã principal</b>.', 'Toque em <b>Adicionar</b>.']
      : ['Abra o menu do navegador (<b>⋮</b>, no canto superior).', 'Toque em <b>Instalar aplicação</b> ou <b>Adicionar ao ecrã principal</b>.', 'Confirme em <b>Instalar</b>.'];
    caixa = document.createElement('div');
    caixa.id = 'ec-inst-cx';
    caixa.setAttribute('role', 'dialog');
    caixa.setAttribute('aria-modal', 'true');
    caixa.innerHTML = '<div class="ec-inst-c"><h2>Instalar o ENCORP</h2><p style="margin:0">Use o ENCORP como aplicação, mesmo com ligação fraca:</p><ol><li>' + passos.join('</li><li>') + '</li></ol><button type="button">Fechar</button></div>';
    caixa.addEventListener('click', function (e) { if (e.target === caixa || e.target.tagName === 'BUTTON') { caixa.parentNode && caixa.parentNode.removeChild(caixa); } });
    document.body.appendChild(caixa);
  }

  function clicar() {
    if (evento) {
      var e = evento; evento = null; window.__ecEventoInstalar = null;
      try { e.prompt(); if (e.userChoice) e.userChoice.then(function (r) { if (r && r.outcome === 'accepted') remover(); }); } catch (x) { instrucoes(); }
    } else instrucoes();
  }

  function acima() {
    var nav = document.querySelector('.bottom-nav');
    if (!btn) return;
    if (!nav) { btn.style.bottom = ''; return; }
    var h = nav.getBoundingClientRect().height || 64;
    btn.style.bottom = 'calc(' + Math.round(h + 14) + 'px + env(safe-area-inset-bottom,0px))';
  }

  function criar() {
    if (document.getElementById('ec-instalar')) return;
    css();
    btn = document.createElement('button');
    btn.id = 'ec-instalar';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Instalar a aplicação ENCORP');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12"/><path d="m7 11 5 5 5-5"/><path d="M5 20h14"/></svg><span>Instalar app</span>';
    btn.addEventListener('click', clicar);
    document.body.appendChild(btn);
    acima();
    window.addEventListener('resize', acima);
    window.addEventListener('orientationchange', acima);
    window.addEventListener('load', acima);
    /* no telemóvel esconde-se só enquanto as ligações do rodapé estão visíveis, para nunca tapar texto */
    if ('IntersectionObserver' in window) {
      var mq = window.matchMedia('(max-width:899px)'), vis = new Set();
      var upd = function () { btn.classList.toggle('ec-esc', mq.matches && vis.size > 0); };
      var io = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) vis.add(x.target); else vis.delete(x.target); }); upd(); });
      document.querySelectorAll('.sbb-cols, .sbb-footer-note, .sbb-ft-note').forEach(function (t) { io.observe(t); });
      if (mq.addEventListener) mq.addEventListener('change', upd);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', criar); else criar();
})();
