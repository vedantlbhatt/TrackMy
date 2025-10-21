const { spawn } = require('child_process');

const port = process.env.PORT || 8080;

console.log(`Starting Next.js on port ${port}`);

const child = spawn('npx', ['next', 'start', '-p', port.toString()], {
  stdio: 'inherit',
  env: { ...process.env }
});

child.on('error', (error) => {
  console.error('Failed to start Next.js:', error);
  process.exit(1);
});

child.on('exit', (code) => {
  console.log(`Next.js exited with code ${code}`);
  process.exit(code);
});
