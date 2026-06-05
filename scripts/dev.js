import { spawn } from 'child_process';

const commands = [
  { name: 'api', command: 'npm', args: ['--prefix', 'backend', 'run', 'dev'] },
  { name: 'web', command: 'npm', args: ['--prefix', 'frontend', 'run', 'dev'] }
];

const children = commands.map(({ name, command, args }) => {
  const child = spawn(command, args, { stdio: ['inherit', 'pipe', 'pipe'], shell: process.platform === 'win32' });
  child.stdout.on('data', (data) => process.stdout.write(`[${name}] ${data}`));
  child.stderr.on('data', (data) => process.stderr.write(`[${name}] ${data}`));
  child.on('exit', (code, signal) => {
    if (signal) console.log(`[${name}] stopped with signal ${signal}`);
    else if (code !== 0) console.error(`[${name}] exited with code ${code}`);
  });
  return child;
});

function shutdown(signal) {
  console.log(`\nStopping JalSetu dev servers (${signal})...`);
  for (const child of children) child.kill(signal);
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

console.log('Starting JalSetu dev servers...');
console.log('- Frontend: http://localhost:5173');
console.log('- Backend:  http://localhost:5000/health');
