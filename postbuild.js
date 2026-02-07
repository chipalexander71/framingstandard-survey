const fs = require('fs');

// Vite outputs the survey entry as dist/index.html
// We need to move it to dist/survey/index.html
// and promote home.html to dist/index.html (the homepage)

fs.mkdirSync('dist/survey', { recursive: true });

// Move Vite's survey entry into /survey/
if (fs.existsSync('dist/index.html')) {
  fs.renameSync('dist/index.html', 'dist/survey/index.html');
}

// Promote homepage to root
if (fs.existsSync('dist/home.html')) {
  fs.renameSync('dist/home.html', 'dist/index.html');
}

console.log('Post-build: homepage → /index.html, survey → /survey/index.html');
