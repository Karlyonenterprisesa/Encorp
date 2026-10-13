(function(){var q=document.getElementById('q'),r=document.getElementById('r'),n=document.getElementById('n'),D=null,t0=0;
var norm=function(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')};
var esc=function(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
function run(){var v=norm(q.value).trim();try{history.replaceState(null,'',v?'?q='+encodeURIComponent(q.value.trim()):location.pathname)}catch(e){}
if(!D)return;if(v.length<2){r.innerHTML='';n.textContent=v?'Escreva pelo menos 2 letras.':'';return}
var w=v.split(/\s+/),out=[];
D.forEach(function(e){var sc=0,ok=true;w.forEach(function(x){var i=e._t.indexOf(x);if(i===0)sc+=8;else if(i>0)sc+=(e._t.charAt(i-1)===' '?6:3);else if(e._s.indexOf(x)>=0)sc+=2;else if(e._d.indexOf(x)>=0)sc+=1;else ok=false});if(ok)out.push([sc,e])});
out.sort(function(a,b){return b[0]-a[0]||a[1].t.localeCompare(b[1].t,'pt')});
n.textContent=out.length?out.length+(out.length===1?' resultado':' resultados')+(out.length>60?' (a mostrar 60)':''):'Sem resultados. Tente outra palavra.';
r.innerHTML=out.slice(0,60).map(function(o){var e=o[1];return '<a class="card" href="'+esc(e.u)+'"><b>'+esc(e.t)+'</b>'+(e.d?'<span>'+esc(e.d)+'</span><br>':'')+(e.s?'<span>'+esc(e.s)+'</span>':'')+'</a>'}).join('')}
q.addEventListener('input',function(){clearTimeout(t0);t0=setTimeout(run,120)});
var p=new URLSearchParams(location.search).get('q');if(p)q.value=p;
fetch('/search-index.json',{cache:'no-cache'}).then(function(x){return x.json()}).then(function(j){D=j.map(function(e){e._t=norm(e.t);e._d=norm(e.d);e._s=norm(e.s);return e});run()}).catch(function(){n.textContent='Não foi possível carregar a pesquisa. Verifique a ligação à internet.'});
})();
