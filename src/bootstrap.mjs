import { spawn } from 'child_process';
import { stat } from 'fs/promises';

const root = new URL('..', import.meta.url).pathname; 
const npm = new URL('../node_modules', import.meta.url).pathname;

try {
  await stat(npm);
} catch (e) {
  const child = spawn('npm', ['i'], { cwd: root, stdio: 'pipe' });
  await new Promise((resolve, reject) => {
    child.on('exit', (code, signal) => {
      if (code === 0 || code === null) {
        resolve();
      } else {
        reject(Object.assign(new Error('Error calling npm'), { code, signal }));
      }
    });
  });
}
