/* ENCORP — cartão «Sobre o sistema»: aparece 20 s depois do cartão do fundador (uma vez por sessão).
   Se o cartão do fundador, o aviso de cookies ou o convite de instalação ainda estiverem visíveis, espera e tenta de novo. */
(function () {
  var el = document.getElementById('aboutSplash');
  if (!el) return;
  var KEY = 'ec_about_splash_seen', DELAY = 20300, RETRY = 3000;
  function seen() { try { return sessionStorage.getItem(KEY) === '1'; } catch (e) { return false; } }
  function mark() { try { sessionStorage.setItem(KEY, '1'); } catch (e) {} }
  function busy() {
    var f = document.getElementById('founderSplash');
    return (f && f.classList.contains('open')) || document.getElementById('ec-ck') || document.querySelector('#ecInstall.on') || document.querySelector('.drawer-overlay.open');
  }
  function open() { el.classList.add('open'); mark(); }
  window.closeAboutSplash = function () { el.classList.remove('open'); };
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') window.closeAboutSplash(); });
  function tryOpen() { if (seen()) return; if (busy()) { setTimeout(tryOpen, RETRY); return; } open(); }
  setTimeout(tryOpen, DELAY);
})();
