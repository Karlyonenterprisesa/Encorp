/* Perguntas de estudo (5 por caso) no acordeão "Casos Clínicos" */
(function(){
  function render(box){
    if(box.dataset.ok||typeof CASOS_ESTUDO==='undefined')return;
    var c=CASOS_ESTUDO.filter(function(x){return x.id===box.dataset.caso})[0]; if(!c)return;
    box.dataset.ok='1';var feitas=0,certas=0,tot=c.perguntas.length;
    var h='<b style="display:block;color:var(--azul-escuro);font-size:13px;margin:14px 0 6px;">Questões de estudo ('+tot+')</b>';
    c.perguntas.forEach(function(q,i){
      h+='<div class="cq" data-c="'+q.correta+'" style="margin:0 0 12px;"><div style="font-size:13px;font-weight:700;margin-bottom:6px;">'+(i+1)+'. '+q.q+'</div>';
      q.opts.forEach(function(o,k){h+='<button type="button" class="cq-o" data-k="'+k+'" style="display:block;width:100%;text-align:left;margin:0 0 5px;padding:9px 10px;border:1px solid #d5dbe6;border-radius:8px;background:#fff;font-size:12.5px;cursor:pointer;">'+String.fromCharCode(65+k)+') '+o+'</button>'});
      h+='</div>';
    });
    h+='<div class="cq-r" style="font-size:13px;font-weight:700;color:var(--azul-escuro);"></div>';
    box.innerHTML=h;
    box.addEventListener('click',function(e){
      var b=e.target.closest('.cq-o'); if(!b)return; var q=b.closest('.cq'); if(q.dataset.done)return; q.dataset.done='1';
      var ok=+b.dataset.k===+q.dataset.c; feitas++; if(ok)certas++;
      q.querySelectorAll('.cq-o').forEach(function(x){x.disabled=true;if(+x.dataset.k===+q.dataset.c){x.style.background='#dff3e4';x.style.borderColor='#2e9d57'}});
      if(!ok){b.style.background='#fbe1e1';b.style.borderColor='#d64545'}
      if(feitas===tot)box.querySelector('.cq-r').textContent='Resultado: '+certas+' de '+tot+' correctas.';
    });
  }
  function hidratar(){document.querySelectorAll('.caso-quiz[data-caso]').forEach(render)}
  hidratar();document.addEventListener('click',function(){setTimeout(hidratar,0)});
})();
