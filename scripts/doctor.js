import fs from 'fs';
import http from 'http';
import https from 'https';
import net from 'net';
import path from 'path';

const checks = [];
const add = (name, ok, detail, fix) => checks.push({ name, ok, detail, fix });

function exists(file) {
  return fs.existsSync(path.resolve(file));
}

function portOpen(port, host = '127.0.0.1') {
  return new Promise((resolve) => {
    const socket = net.createConnection({ port, host, timeout: 900 });
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.on('error', () => resolve(false));
  });
}

function get(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https:') ? https : http;
    const req = client.get(url, (res) => {
      res.resume();
      resolve({ ok: res.statusCode >= 200 && res.statusCode < 400, status: res.statusCode });
    });
    req.setTimeout(1200, () => {
      req.destroy();
      resolve({ ok: false, status: 'timeout' });
    });
    req.on('error', () => resolve({ ok: false, status: 'offline' }));
  });
}

const major = Number(process.versions.node.split('.')[0]);
add('Node.js version', major >= 18, `Detected ${process.version}`, 'Install Node.js 18 or newer.');

const backendEnv = exists('backend/.env');
const frontendEnv = exists('frontend/.env');
const backendDeps = exists('backend/node_modules');
const frontendDeps = exists('frontend/node_modules');

add('Backend env file', backendEnv, backendEnv ? 'backend/.env exists' : 'backend/.env is missing', 'Run: npm run setup:env');
add('Frontend env file', frontendEnv, frontendEnv ? 'frontend/.env exists' : 'frontend/.env is missing', 'Run: npm run setup:env');
add('Backend dependencies', backendDeps, backendDeps ? 'backend/node_modules exists' : 'backend/node_modules is missing', 'Run: npm --prefix backend install');
add('Frontend dependencies', frontendDeps, frontendDeps ? 'frontend node_modules exists' : 'frontend/node_modules is missing', 'Run: npm --prefix frontend install');

const [mongoOpen, apiOpen, webOpen, health, registry] = await Promise.all([
  portOpen(27017),
  portOpen(5000),
  portOpen(5173),
  get('http://127.0.0.1:5000/health'),
  get('https://registry.npmjs.org/bcryptjs')
]);

add('npm registry access', registry.ok, `registry.npmjs.org returned ${registry.status}`, 'Fix npm/network/proxy access, then run: npm run setup. If you see HTTP 403, remove/repair proxy or registry policy settings.');
add('MongoDB port 27017', mongoOpen, mongoOpen ? 'MongoDB appears reachable' : 'MongoDB is not reachable on 127.0.0.1:27017', 'Start MongoDB or run: docker compose up -d mongo');
add('Backend port 5000', apiOpen, apiOpen ? 'Backend port is open' : 'Backend is not listening on port 5000', 'Run: npm run dev:api');
add('Frontend port 5173', webOpen, webOpen ? 'Frontend port is open' : 'Frontend is not listening on port 5173', 'Run: npm run dev:web');
add('Backend health endpoint', health.ok, `GET /health returned ${health.status}`, 'Check backend logs and MongoDB connection.');

console.log('\nJalSetu local diagnostics\n');
let failed = 0;
for (const check of checks) {
  const icon = check.ok ? '✅' : '❌';
  console.log(`${icon} ${check.name}: ${check.detail}`);
  if (!check.ok) {
    failed += 1;
    console.log(`   Fix: ${check.fix}`);
  }
}

console.log('\nExpected local links after npm run dev:');
console.log('- App: http://localhost:5173');
console.log('- API health: http://localhost:5000/health');
console.log('- API base: http://localhost:5000/api');

process.exitCode = failed ? 1 : 0;
