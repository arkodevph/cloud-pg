"""Refresh vector logo placements and export the existing guide pages as PDFs."""
from pathlib import Path
import subprocess
import xml.etree.ElementTree as E
R=Path(__file__).resolve().parents[1]
D=R/'design-sources/logo-guide-2026-10-20'
S='{http://www.w3.org/2000/svg}'
E.register_namespace('',S[1:-1])
logo=E.parse(R/'public/assets/cloudpg-logo.svg').getroot()
for number in (1,2):
 path=D/f'page-{number}.svg'
 root=E.parse(path).getroot()
 placements=0
 for position,old in enumerate(list(root)):
  if old.tag!=S+'svg':continue
  new=E.fromstring(E.tostring(logo))
  for attribute in ('x','y','width','height'):new.set(attribute,old.get(attribute))
  if number==2 and placements==0:
   for letter in new:
    if letter.tag==S+'path':letter.set('fill','#ffffff')
  root.remove(old);root.insert(position,new);placements+=1
 path.write_text(E.tostring(root,encoding='unicode'))
(D/'Cloud-Payment-Group-Logo.svg').write_text(E.tostring(logo,encoding='unicode'))
subprocess.run(['rsvg-convert','-f','pdf','-o',str(D/'Cloud-Payment-Group-Logo-Guide.pdf'),*[str(D/f'page-{number}.svg') for number in range(1,5)]],check=True)
subprocess.run(['rsvg-convert','-f','pdf','-w','595.28pt','-o',str(D/'Cloud-Payment-Group-Logo.pdf'),str(R/'public/assets/cloudpg-logo.svg')],check=True)
