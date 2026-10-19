import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

// Obtain original files directly from Fontshare; never redistribute them through the repo.
export async function ensureFonts(root) {
  const directory = join(root, 'public', 'assets', 'fonts', 'fontshare');
  const manifest = JSON.parse(readFileSync(join(root, 'public', 'assets', 'fonts', 'fontshare-sources.json'), 'utf8'));
  mkdirSync(directory, { recursive:true });
  await Promise.all(manifest.fonts.map(async font => {
    const path = join(directory, font.file);
    if (existsSync(path)) return;
    const response = await fetch(font.source);
    if (!response.ok) throw new Error(`Fontshare download failed for ${font.family}: ${response.status}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.toString('ascii', 0, 4) !== 'wOF2' || createHash('sha256').update(bytes).digest('hex') !== font.sha256) {
      throw new Error(`Fontshare file did not match the original ${font.file}`);
    }
    writeFileSync(path, bytes);
  }));
}
