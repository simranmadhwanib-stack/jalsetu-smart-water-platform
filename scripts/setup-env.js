import fs from 'fs';
import path from 'path';

const files = [
  ['backend/.env.example', 'backend/.env'],
  ['frontend/.env.example', 'frontend/.env']
];

for (const [source, target] of files) {
  const sourcePath = path.resolve(source);
  const targetPath = path.resolve(target);
  if (!fs.existsSync(sourcePath)) {
    console.warn(`Skipping ${target}: ${source} not found`);
    continue;
  }
  if (fs.existsSync(targetPath)) {
    console.log(`Keeping existing ${target}`);
    continue;
  }
  fs.copyFileSync(sourcePath, targetPath);
  console.log(`Created ${target}`);
}
