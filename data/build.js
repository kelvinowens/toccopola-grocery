const fs = require('fs');

// Clean dist folder
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true });
}

// Recreate dist
fs.mkdirSync('dist');
fs.mkdirSync('dist/data');

// Copy files
fs.copyFileSync('admin.html', 'dist/admin.html');
fs.copyFileSync('index.html', 'dist/index.html');
fs.copyFileSync('data/menu.json', 'dist/data/menu.json');

console.log('✅ Build complete');