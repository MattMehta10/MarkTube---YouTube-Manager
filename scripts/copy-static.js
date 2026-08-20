// Copies everything in public/ into dist/public/ on every build.
// Fonts, fire animation, logo, etc. go here — not into src/.
import { cpSync, existsSync, mkdirSync } from 'fs';

mkdirSync('dist/public', { recursive: true });
if (existsSync('public')) {
  cpSync('public', 'dist/public', { recursive: true });
  console.log('✔ public/ copied to dist/public/');
} else {
  console.log('ℹ no public/ folder yet — skipping');
}
