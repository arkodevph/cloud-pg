"""Build smooth vector logo contours with continuous guide-based shading."""
from pathlib import Path
import xml.etree.ElementTree as E
R=Path(__file__).resolve().parents[1]
S='{http://www.w3.org/2000/svg}';E.register_namespace('',S[1:-1])
old=E.parse(R/'public/assets/cloudpg-logo.svg').getroot()
letters=''.join(E.tostring(n,encoding='unicode') for n in old if n.tag==S+'path')
# Paths are authored in half-size source coordinates, keeping the existing lockup.
defs='''<defs>
<linearGradient id="cloud-blue" x1="210" y1="66" x2="305" y2="323" gradientUnits="userSpaceOnUse"><stop stop-color="#00c0f3"/><stop offset=".42" stop-color="#1b75bc"/><stop offset="1" stop-color="#082859"/></linearGradient>
<linearGradient id="cloud-left" x1="173" y1="153" x2="222" y2="323" gradientUnits="userSpaceOnUse"><stop stop-color="#00c0f3"/><stop offset=".48" stop-color="#1b75bc"/><stop offset="1" stop-color="#082859"/></linearGradient>
<linearGradient id="cloud-right" x1="362" y1="175" x2="417" y2="315" gradientUnits="userSpaceOnUse"><stop stop-color="#00a8de"/><stop offset=".45" stop-color="#1b75bc"/><stop offset="1" stop-color="#082859"/></linearGradient>
<linearGradient id="folder-orange" x1="294" y1="185" x2="348" y2="323" gradientUnits="userSpaceOnUse"><stop stop-color="#ffbc77"/><stop offset=".45" stop-color="#f26922"/><stop offset="1" stop-color="#ef4136"/></linearGradient>
<linearGradient id="folder-fold" x1="394" y1="220" x2="338" y2="323" gradientUnits="userSpaceOnUse"><stop stop-color="#f26922"/><stop offset="1" stop-color="#cf2b27"/></linearGradient>
</defs>'''
mark='<g transform="scale(2)">\n<path fill="url(#cloud-blue)" d="M156 148 C166 99 208 63 260 63 C311 63 354 101 363 153 C370 150 379 148 386 148 C431 148 466 187 466 235 C466 284 428 323 380 323 H162 C113 323 74 285 74 236 C74 187 113 148 156 148 Z"/>\n<path fill="#005099" opacity=".16" d="M199 86 C217 91 231 107 246 123 L298 175 L310 198 L276 224 H250 C238 224 234 217 234 204 C234 174 211 148 181 148 H156 C162 124 178 102 199 86 Z"/>\n<path fill="url(#cloud-right)" d="M363 153 C370 150 379 148 386 148 C431 148 466 187 466 235 C466 284 428 323 380 323 H330 L326 213 Z"/>\n<path fill="url(#cloud-left)" d="M156 148 H181 C211 148 234 174 234 204 V207 C234 220 242 227 255 227 H280 L278 269 L244 323 H162 C113 323 74 285 74 236 C74 187 113 148 156 148 Z"/>\n<path fill="url(#folder-orange)" d="M246 323 C227 323 213 309 213 290 V252 C213 233 227 219 245 219 H254 C267 219 275 211 275 198 V195 C275 183 283 176 295 176 H360 C379 176 394 191 394 210 V291 C394 310 381 323 362 323 Z"/>\n<path fill="url(#folder-fold)" d="M232 320 L381 184 C389 190 394 199 394 210 V291 C394 310 381 323 362 323 H246 C241 323 236 322 232 320 Z"/>\n</g>\n'
for name,view,body,label in [('cloudpg-logo.svg','0 0 2092 752',mark+letters,'Cloud Payment Group'),('cloudpg-cloud-mark.svg','12 0 988 752',mark,'Cloud Payment Group cloud mark')]:
 (R/'public/assets'/name).write_text(f'<svg xmlns="{S[1:-1]}" viewBox="{view}" role="img" aria-label="{label}">{defs}{body}</svg>\n')
