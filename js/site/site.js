/*EC:CFG*/window.EC_CFG={"adsenseClient":"ca-pub-5846610296337932","gaId":""};/*/EC:CFG*/
/* Enfermeiro Corporativo — consentimento de cookies (Google Consent Mode v2) + partilha. Sem dependências. */
(function () {
  var KEY = 'ec_consent';
  function gt() { window.dataLayer = window.dataLayer || []; window.dataLayer.push(arguments); }
  gt('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied' });
  var C = window.EC_CFG || {};
  function lib(src) { if (document.querySelector('script[src="' + src + '"]')) return; var e = document.createElement('script'); e.async = true; e.src = src; if (src.indexOf('googlesyndication') > -1) e.crossOrigin = 'anonymous'; document.head.appendChild(e); }
  function load(v) {
    if (v !== 'all') return;
    if (/^ca-pub-\d+$/.test(C.adsenseClient || '')) lib('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + C.adsenseClient);
    if (/^G-[A-Z0-9]+$/.test(C.gaId || '')) { lib('https://www.googletagmanager.com/gtag/js?id=' + C.gaId); if (!window.__ecGa) { window.__ecGa = 1; gt('js', new Date()); gt('config', C.gaId, { anonymize_ip: true }); } }
  }
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function apply(v) {
    var s = v === 'all' ? 'granted' : 'denied';
    gt('consent', 'update', { ad_storage: s, ad_user_data: s, ad_personalization: s, analytics_storage: s });
    load(v);
  }

  var css = '#ec-ck{position:fixed;left:10px;right:10px;bottom:10px;z-index:2147483000;max-width:560px;margin:0 auto;background:#fff;color:#0f2547;border:1px solid #ffd9a8;border-top:4px solid #e8a317;border-radius:14px;padding:14px 16px;box-shadow:none;font:13.5px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}' +
    '#ec-ck b{color:#0b1a33;font-size:14.5px}#ec-ck p{margin:6px 0 10px}#ec-ck a{color:#c76a00}' +
    '#ec-ck .r{display:flex;gap:8px;flex-wrap:wrap}#ec-ck button{flex:1 1 140px;border:0;border-radius:10px;padding:10px 12px;font:700 13.5px system-ui,sans-serif;cursor:pointer}' +
    '#ec-ck .y{background:#c76a00;color:#fff}#ec-ck .n{background:#eef3fb;color:#0b1a33;border:1px solid #ffd9a8}' +
    '.ec-share{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0}.ec-share a,.ec-share button{display:inline-flex;align-items:center;gap:6px;padding:9px 13px;border-radius:99px;border:1px solid #ffe6c6;background:#fff;color:#0b1a33;font:700 13px system-ui,sans-serif;text-decoration:none;cursor:pointer}' +
    '.ec-share .wa{background:#25D366;color:#fff;border-color:#25D366}.ec-share .fb{background:#1877F2;color:#fff;border-color:#1877F2}.ec-share .tg{background:#229ED9;color:#fff;border-color:#229ED9}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function close() { var b = document.getElementById('ec-ck'); if (b) b.remove(); }
  function choose(v) { set(v); apply(v); close(); }
  function show() {
    if (document.getElementById('ec-ck')) return;
    var d = document.createElement('div'); d.id = 'ec-ck'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-label', 'Cookies');
    d.innerHTML = '<b>Cookies e privacidade</b><p>Usamos cookies para medir a utilização do site e mostrar anúncios (Google Analytics e Google AdSense). Pode aceitar tudo ou ficar só com o essencial. Veja a <a href="/privacidade.html">Política de Privacidade</a>.</p>' +
      '<div class="r"><button class="n" type="button" id="ec-no">Só essenciais</button><button class="y" type="button" id="ec-yes">Aceitar tudo</button></div>';
    document.body.appendChild(d);
    document.getElementById('ec-yes').onclick = function () { choose('all'); };
    document.getElementById('ec-no').onclick = function () { choose('essential'); };
  }
  window.ecCookies = function () { var b = document.getElementById('ec-ck'); if (b) b.remove(); show(); };

  function init() {
    var v = get();
    if (v) apply(v); else show();
    document.addEventListener('click', function (e) {
      var t = e.target.closest && e.target.closest('[data-share],[data-copy],[data-cookies]');
      if (!t) return;
      var url = t.getAttribute('data-url') || location.href, title = t.getAttribute('data-title') || document.title;
      if (t.hasAttribute('data-cookies')) { e.preventDefault(); window.ecCookies(); }
      else if (t.hasAttribute('data-share')) {
        if (navigator.share) { e.preventDefault(); navigator.share({ title: title, url: url }).catch(function () {}); }
      } else if (t.hasAttribute('data-copy')) {
        e.preventDefault();
        var done = function () { var o = t.textContent; t.textContent = 'Link copiado ✓'; setTimeout(function () { t.textContent = o; }, 1800); };
        if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, done); else { prompt('Copie o link:', url); }
      }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

/* Convite de instalação (PWA): carregado em todas as páginas, uma só vez. */
(function () {
  if (window.__ecInstallInit || document.querySelector('script[src*="convite-instalacao"]')) return;
  var s = document.createElement('script'); s.src = '/js/pwa/convite-instalacao.js'; s.defer = true; document.head.appendChild(s);
})();
