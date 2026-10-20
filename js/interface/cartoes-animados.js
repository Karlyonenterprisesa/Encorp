/* Cards de ferramentas da página inicial: entram em cascata ao aparecer no ecrã */
(function(){
  var lista=document.querySelector('.home-tools'); if(!lista||!('IntersectionObserver' in window)) return;
  if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var cards=[].slice.call(lista.querySelectorAll('.home-card'));
  cards.forEach(function(c,i){c.classList.add('ht-rv');c.style.setProperty('--ht-d',(i%2)*90+Math.floor(i/2)*60+'ms')});
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('ht-in');io.unobserve(e.target)}})},{threshold:.15});
  cards.forEach(function(c){io.observe(c)});
})();
