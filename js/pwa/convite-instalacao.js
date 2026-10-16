/* Enfermeiro Corporativo — convite flutuante de instalação (PWA).
   Regras:
   - aparece durante 15 s e volta a aparecer de 5 em 5 minutos (início a início);
   - não aparece se a app já estiver instalada/aberta como app, ou se o utilizador dispensou o convite;
   - Chrome/Edge/Android: usa o evento «beforeinstallprompt» (o navegador decide se a app é instalável);
   - iOS: não existe esse evento, por isso mostra as instruções «Partilhar → Adicionar ao ecrã principal»;
   - navegadores sem instalação (ex.: Firefox no computador): não mostra nada;
   - o momento da próxima aparição é guardado, para não repetir o convite a cada página que se abre. */
(function () {
  'use strict';
  if (window.__ecInstallInit) return;
  window.__ecInstallInit = true;

  var W = window, D = document;
  var K = { dismissed: 'ec_install_dismissed', installed: 'ec_install_installed', next: 'ec_install_next' };
  var CFG = { showMs: 15000, everyMs: 5 * 60 * 1000, firstDelayMs: 4000, helpMs: 15000 };
  if (W.EC_INSTALL_CFG) for (var k in W.EC_INSTALL_CFG) CFG[k] = W.EC_INSTALL_CFG[k];

  var deferred = null, el = null, hideT = null, nextT = null, started = false;

  function get(key) { try { return W.localStorage.getItem(key); } catch (e) { return null; } }
  function set(key, v) { try { W.localStorage.setItem(key, v); } catch (e) { /* modo privado */ } }

  var ua = W.navigator.userAgent || '';
  var isIOS = /iphone|ipad|ipod/i.test(ua) || (/Macintosh/.test(ua) && W.navigator.maxTouchPoints > 1);
  function isStandalone() {
    var mm = W.matchMedia;
    return (mm && (mm('(display-mode: standalone)').matches || mm('(display-mode: fullscreen)').matches || mm('(display-mode: minimal-ui)').matches)) || W.navigator.standalone === true;
  }
  function externalUrl() { return String(W.EC_APP_URL || '').trim(); }
  function finished() { return !!(get(K.installed) || get(K.dismissed) || isStandalone()); }
  function eligible() { return !finished() && !!(deferred || isIOS || externalUrl()); }

  /* ---------- aspecto ---------- */
  var css = '#ecInstall{position:fixed;left:12px;right:12px;bottom:calc(var(--ec-install-bottom,16px) + env(safe-area-inset-bottom,0px));z-index:140;max-width:420px;margin:0 auto;' +
    'background:#fff;color:#0b1a33;border:1px solid #dfe6f0;border-left:4px solid #e8a317;border-radius:16px;box-shadow:0 10px 30px rgba(11,26,51,.28);padding:12px 12px 14px;font:14px/1.35 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;' +
    'transform:translateY(24px);opacity:0;transition:transform .25s ease,opacity .25s ease;overflow:hidden}' +
    '#ecInstall.on{transform:none;opacity:1}' +
    '#ecInstall .r{display:flex;align-items:center;gap:10px}' +
    '#ecInstall img{width:44px;height:44px;border-radius:12px;flex:none;background:#fff}' +
    '#ecInstall .t{flex:1;min-width:0}#ecInstall b{display:block;font-size:14.5px}#ecInstall span.s{display:block;font-size:12.5px;color:#5b6b85;margin-top:1px}' +
    '#ecInstall button{font:inherit;cursor:pointer;border:0;border-radius:10px}' +
    '#ecInstall .go{background:#f28c1c;color:#fff;font-weight:700;padding:9px 14px;white-space:nowrap}' +
    '#ecInstall .x{background:transparent;color:#5b6b85;font-size:20px;line-height:1;padding:6px 8px;align-self:flex-start}' +
    '#ecInstall .help{margin:10px 0 0;padding:9px 10px;background:#e7ecf4;border-radius:10px;font-size:13px}' +
    '#ecInstall .bar{position:absolute;left:0;bottom:0;height:3px;width:100%;background:#e8a317;transform-origin:left;transform:scaleX(1)}' +
    '#ecInstall.on .bar{animation:ecInstBar linear forwards}' +
    '@keyframes ecInstBar{to{transform:scaleX(0)}}' +
    '@media (prefers-reduced-motion:reduce){#ecInstall{transition:none}#ecInstall.on .bar{animation:none;display:none}}' +
    '@media print{#ecInstall{display:none}}';

  function build() {
    if (!D.getElementById('ecInstallCss')) {
      var st = D.createElement('style'); st.id = 'ecInstallCss'; st.textContent = css; D.head.appendChild(st);
    }
    var hasNav = !!D.getElementById('bottomNav');
    D.documentElement.style.setProperty('--ec-install-bottom', hasNav ? '88px' : '16px');
    var d = D.createElement('div');
    d.id = 'ecInstall'; d.setAttribute('role', 'region'); d.setAttribute('aria-label', 'Instalar a aplicação');
    var sub = isIOS && !deferred ? 'Adicione ao ecrã principal e use como app.' : 'Abre mais depressa e funciona sem ligação.';
    d.innerHTML = '<div class="r"><img src="/android-chrome-192x192.png" alt="" width="44" height="44">' +
      '<div class="t"><b>Instalar Enfermeiro Corporativo</b><span class="s">' + sub + '</span></div>' +
      '<button type="button" class="go" data-a="go">' + (isIOS && !deferred ? 'Como instalar' : 'Instalar') + '</button>' +
      '<button type="button" class="x" data-a="x" aria-label="Dispensar convite">×</button></div>' +
      '<div class="bar" style="animation-duration:' + CFG.showMs + 'ms"></div>';
    d.addEventListener('click', function (ev) {
      var b = ev.target.closest('button[data-a]'); if (!b) return;
      if (b.dataset.a === 'x') hide(true); else install();
    });
    return d;
  }

  /* ---------- mostrar / esconder ---------- */
  function show() {
    if (el || !eligible()) return;
    el = build(); D.body.appendChild(el);
    void el.offsetWidth; el.classList.add('on');
    clearTimeout(hideT); hideT = setTimeout(function () { hide(false); }, CFG.showMs);
    set(K.next, String(Date.now() + CFG.everyMs));
    schedule(CFG.everyMs);
  }
  function hide(dismiss) {
    clearTimeout(hideT);
    if (dismiss) { set(K.dismissed, '1'); clearTimeout(nextT); }
    if (!el) return;
    var e = el; el = null; e.classList.remove('on');
    setTimeout(function () { if (e.parentNode) e.parentNode.removeChild(e); }, 300);
  }
  function blocked() {
    var sp = D.getElementById('founderSplash');                    // não competir com o cartão de boas-vindas
    return D.hidden || (sp && sp.classList.contains('open')) || !!D.getElementById('ec-ck');   // nem sobre o aviso de cookies
  }
  function tryShow() {
    if (!eligible()) return;
    if (blocked()) { nextT = setTimeout(tryShow, 2000); return; }
    show();
  }
  function schedule(ms) { clearTimeout(nextT); nextT = setTimeout(tryShow, Math.max(0, ms)); }
  function firstSchedule() {
    if (started) return; started = true;
    var due = Number(get(K.next)) || 0, now = Date.now();
    schedule(due > now ? due - now : CFG.firstDelayMs);
  }

  /* ---------- instalar ---------- */
  function install() {
    if (deferred) {
      var d = deferred; deferred = null; hide(false);
      try {
        d.prompt();
        d.userChoice.then(function (c) { set(c && c.outcome === 'accepted' ? K.installed : K.dismissed, '1'); }).catch(function () {});
      } catch (e) { /* o navegador recusou o prompt: tenta na próxima vez */ }
    } else if (isIOS) {
      var box = el && el.querySelector('.help');
      if (!box && el) {
        box = D.createElement('div'); box.className = 'help';
        box.innerHTML = '1. Toque em <b>Partilhar</b> (□↑) na barra do navegador.<br>2. Escolha <b>Adicionar ao ecrã principal</b>.<br>3. Toque em <b>Adicionar</b>.';
        el.appendChild(box);
        clearTimeout(hideT); hideT = setTimeout(function () { hide(false); }, CFG.helpMs);
        var bar = el.querySelector('.bar'); if (bar) bar.style.display = 'none';
      }
    } else if (externalUrl()) {
      hide(false); W.open(externalUrl(), '_blank', 'noopener');
    }
  }

  /* ---------- eventos do navegador ---------- */
  W.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault(); deferred = e;
    if (!finished()) firstSchedule();
  });
  W.addEventListener('appinstalled', function () {
    set(K.installed, '1'); deferred = null; clearTimeout(nextT); hide(false);
  });
  D.addEventListener('visibilitychange', function () {
    if (!D.hidden && started && !el && eligible() && !nextT) schedule(1000);
  });
  try {                                                             // Chrome Android: detecta a app já instalada
    if (W.navigator.getInstalledRelatedApps) W.navigator.getInstalledRelatedApps().then(function (l) {
      if (l && l.length) { set(K.installed, '1'); clearTimeout(nextT); hide(false); }
    }).catch(function () {});
  } catch (e) { /* sem suporte */ }

  if (!finished() && (isIOS || externalUrl())) firstSchedule();

  W.ECInstall = { show: show, hide: hide, state: function () { return { eligible: eligible(), visible: !!el, hasPrompt: !!deferred }; }, reset: function () { try { W.localStorage.removeItem(K.dismissed); W.localStorage.removeItem(K.installed); W.localStorage.removeItem(K.next); } catch (e) {} } };
})();
