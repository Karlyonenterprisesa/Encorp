#!/usr/bin/env python3
"""Reduz imagens pesadas em uploads/ e img/ SEM mudar o nome nem o caminho (as referências no CMS continuam válidas).
Uso:  pip install pillow  &&  python tools/otimizar-imagens.py            (limite: 1600 px de largura, > 300 KB)"""
import os, sys
from PIL import Image
LIM_KB, LARG = 300, 1600
tot = 0
for raiz in ('uploads', 'img'):
    for r, _, fs in os.walk(raiz):
        for f in fs:
            p = os.path.join(r, f)
            if not f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')) or os.path.getsize(p) < LIM_KB * 1024: continue
            antes = os.path.getsize(p); im = Image.open(p)
            if im.width > LARG: im = im.resize((LARG, round(im.height * LARG / im.width)), Image.LANCZOS)
            ext = f.lower().rsplit('.', 1)[1]
            if ext == 'png': im.save(p, 'PNG', optimize=True)
            elif ext in ('jpg', 'jpeg'): im.convert('RGB').save(p, 'JPEG', quality=84, optimize=True, progressive=True)
            else: im.save(p, 'WEBP', quality=84, method=6)
            dep = os.path.getsize(p)
            if dep >= antes: print('mantida (sem ganho):', p); continue
            tot += antes - dep; print(f'{p}: {antes//1024} KB -> {dep//1024} KB')
print(f'Poupança total: {tot//1024} KB')
