(function(){var D=JSON.parse(document.getElementById('qd').textContent),root=document.getElementById('quiz'),pass=D.aprovacao||50,L='ABCDEF';
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function render(){var h='';D.perguntas.forEach(function(q,i){h+='<fieldset class="q"><legend><span class="qn">'+(i+1)+'</span> '+esc(q.pergunta)+'</legend>';q.opcoes.forEach(function(o,j){h+='<label class="o"><input type="radio" name="q'+i+'" value="'+j+'"><span><b>'+L[j]+'.</b> '+esc(o)+'</span></label>'});h+='<div class="ex" hidden></div></fieldset>'});
h+='<p id="qmsg" class="qmsg" role="status" aria-live="polite"></p><div class="qb"><button type="button" class="btn" id="qgo">Ver resultado</button><button type="button" class="btn alt" id="qre" hidden>Refazer</button></div><div id="qres"></div>';root.innerHTML=h;
document.getElementById('qgo').onclick=check;document.getElementById('qre').onclick=function(){render();root.scrollIntoView({behavior:'smooth',block:'start'})}}
function check(){var fs=root.querySelectorAll('.q'),ok=0,miss=-1,sel=[];
fs.forEach(function(f,i){var c=f.querySelector('input:checked');sel[i]=c?+c.value:-1;if(!c&&miss<0)miss=i});
if(miss>=0){document.getElementById('qmsg').textContent='Responda a todas as perguntas (falta a pergunta '+(miss+1)+').';fs[miss].scrollIntoView({behavior:'smooth',block:'center'});return}
document.getElementById('qmsg').textContent='';
fs.forEach(function(f,i){var q=D.perguntas[i],right=q.correta-1,os=f.querySelectorAll('.o'),ex=f.querySelector('.ex');
os.forEach(function(o,j){o.classList.remove('ok','no');o.querySelector('input').disabled=true;if(j===right)o.classList.add('ok');else if(j===sel[i])o.classList.add('no')});
if(sel[i]===right)ok++;ex.hidden=false;ex.innerHTML=(sel[i]===right?'<b>Certo.</b> ':'<b>Errado.</b> A resposta correta é '+L[right]+'. ')+(q.explicacao?esc(q.explicacao):'')});
var n=D.perguntas.length,p=Math.round(ok*100/n),a=p>=pass;
document.getElementById('qres').innerHTML='<div class="qr '+(a?'pass':'fail')+'"><b>'+ok+' de '+n+' ('+p+'%)</b><br>'+(a?'Aprovado. Parabéns!':'Ainda não atingiu a nota mínima de '+pass+'%. Reveja o conteúdo e tente de novo.')+'</div>';
document.getElementById('qgo').hidden=true;document.getElementById('qre').hidden=false;document.getElementById('qres').scrollIntoView({behavior:'smooth',block:'center'})}
render()})();
