# Auditoria de contraste (WCAG AA) com Chromium: node tests/servidor-dev.mjs  e  python3 tests/contraste.py /pagina.html ...  (porta 8123: python3 -m http.server 8123)
import sys, json
from playwright.sync_api import sync_playwright
JS = r"""
() => {
  const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if(!m) return null; const p = m[1].split(',').map(x=>parseFloat(x)); return {r:p[0],g:p[1],b:p[2],a:p.length>3?p[3]:1}; };
  const lum = (c) => { const f = v => { v/=255; return v<=0.03928? v/12.92 : Math.pow((v+0.055)/1.055,2.4); }; return 0.2126*f(c.r)+0.7152*f(c.g)+0.0722*f(c.b); };
  const blend = (fg,bg) => ({r:fg.r*fg.a+bg.r*(1-fg.a), g:fg.g*fg.a+bg.g*(1-fg.a), b:fg.b*fg.a+bg.b*(1-fg.a), a:1});
  const bgOf = (el) => { let stack=[]; let n=el; let img=false;
    while(n && n.nodeType===1){ const cs=getComputedStyle(n); if(cs.backgroundImage && cs.backgroundImage!=='none') img=true; const c=parse(cs.backgroundColor); if(c && c.a>0){ stack.push(c); if(c.a>=1) break; } n=n.parentElement; }
    let base={r:255,g:255,b:255,a:1}; for(let i=stack.length-1;i>=0;i--) base=blend(stack[i],base); return {c:base,img}; };
  const out=[]; const seen=new Set();
  const els=[...document.body.querySelectorAll('*')];
  for(const el of els){
    const cs=getComputedStyle(el); if(cs.display==='none'||cs.visibility==='hidden'||parseFloat(cs.opacity)===0) continue;
    const r=el.getBoundingClientRect(); if(r.width<2||r.height<2) continue;
    let txt=''; for(const ch of el.childNodes) if(ch.nodeType===3) txt+=ch.textContent; txt=txt.trim();
    const isCtl = ['INPUT','BUTTON','SELECT','TEXTAREA'].includes(el.tagName);
    if(isCtl){ txt = el.tagName==='INPUT' ? (el.value||el.placeholder||'') : (el.innerText||'').trim(); }
    if(!txt) continue;
    let fg=parse(cs.color); if(!fg) continue; const {c:bg,img}=bgOf(el); if(fg.a<1) fg=blend(fg,bg);
    const L1=lum(fg),L2=lum(bg); const ratio=(Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05);
    const size=parseFloat(cs.fontSize), bold=parseInt(cs.fontWeight)>=700; const large=size>=24||(size>=18.66&&bold);
    const need=large?3:4.5;
    if(ratio<need){ const key=el.tagName+'|'+(el.className||'')+'|'+cs.color+'|'+cs.backgroundColor; if(seen.has(key)) continue; seen.add(key);
      out.push({tag:el.tagName, cls:String(el.className).slice(0,60), id:el.id, txt:txt.slice(0,40), fg:cs.color, bg:`rgb(${Math.round(bg.r)},${Math.round(bg.g)},${Math.round(bg.b)})`, ratio:Math.round(ratio*100)/100, img}); }
  }
  return out;
}
"""
pages = sys.argv[1:]
with sync_playwright() as p:
    b = p.chromium.launch()
    for scheme in ['light','dark']:
        ctx = b.new_context(viewport={'width':390,'height':800}, color_scheme=scheme)
        pg = ctx.new_page()
        for u in pages:
            try:
                pg.goto('http://localhost:8123'+u, wait_until='load', timeout=20000); pg.wait_for_timeout(600)
                res = pg.evaluate(JS)
            except Exception as e:
                print('ERRO', u, str(e)[:80]); continue
            if res:
                print(f'== [{scheme}] {u}: {len(res)} problemas')
                for x in res[:12]: print('   ', x['ratio'], x['tag'], x['cls'] or x['id'], '|', x['txt'], '|', x['fg'], 'sobre', x['bg'], '(img)' if x['img'] else '')
        ctx.close()
    b.close()
