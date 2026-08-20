// Copies manifest.json into dist/ on every build so dist/ is always
// a complete, loadable extension folder with nothing missing or stale.
import { copyFileSync, mkdirSync } from 'fs';

mkdirSync('dist', { recursive: true });
copyFileSync('manifest.json', 'dist/manifest.json');
console.log('✔ manifest.json copied to dist/');
