// Copies everything in public/ into dist/public/ and dist/ on every build.
import { cpSync, existsSync, mkdirSync } from 'fs';

mkdirSync('dist/public', { recursive: true });
if (existsSync('public')) {
  cpSync('public', 'dist/public', { recursive: true });
  cpSync('public', 'dist', { recursive: true });
  console.log('✔ public/ copied to dist/public/ and dist/');
} else {
  console.log('ℹ no public/ folder yet — skipping');
}
