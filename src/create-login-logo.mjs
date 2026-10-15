import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import * as THREE from 'three';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';

globalThis.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then(result => { this.result = result; this.onloadend?.(); });
  }
};

const logo = new THREE.Group();
logo.name = 'Cloud Payment Group ribbon globe';
logo.rotation.z = -19 * Math.PI / 180;
const orange = new THREE.MeshStandardMaterial({ color:0xf26536, roughness:.32, metalness:.18 });
const blue = new THREE.MeshStandardMaterial({ vertexColors:true, roughness:.28, metalness:.25 });
logo.add(new THREE.Mesh(new THREE.SphereGeometry(.95, 64, 40), orange));
const cyan = new THREE.Color(0x00addb), silver = new THREE.Color(0xb9d5de);
const tint = geometry => {
  const positions = geometry.attributes.position;
  const colors = [];
  for (let i = 0; i < positions.count; i++) {
    const color = cyan.clone().lerp(silver, THREE.MathUtils.clamp((positions.getX(i) + 1.06) / 2.12, 0, 1) * .8);
    colors.push(color.r, color.g, color.b);
  }
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  return geometry;
};
const radius = 1.06;
for (const [lower, upper] of [[-1,-.8],[-.66,-.34],[-.17,.17],[.34,.66],[.8,1]]) {
  const start = Math.acos(upper);
  const end = Math.acos(lower);
  logo.add(new THREE.Mesh(tint(new THREE.SphereGeometry(radius, 64, 12, 0, Math.PI * 2, start, end - start)), blue));
  for (const [height, direction] of [[lower,-1],[upper,1]]) {
    if (Math.abs(height) === 1) continue;
    const y = height * radius;
    const outer = Math.sqrt(radius * radius - y * y);
    const inner = Math.sqrt(Math.max(0, .95 * .95 - y * y));
    const rim = new THREE.RingGeometry(inner, outer, 64);
    rim.rotateX(direction * -Math.PI / 2);
    rim.translate(0, y, 0);
    logo.add(new THREE.Mesh(tint(rim), blue));
  }
}
const out = resolve(import.meta.dirname, '../public/assets/3d');
mkdirSync(out, { recursive:true });
const binary = await new GLTFExporter().parseAsync(logo, { binary:true });
writeFileSync(resolve(out, 'cloudpg-ribbon-globe.glb'), Buffer.from(binary));
console.log(`Created ribbon globe: ${(binary.byteLength / 1024).toFixed(0)} KB`);
