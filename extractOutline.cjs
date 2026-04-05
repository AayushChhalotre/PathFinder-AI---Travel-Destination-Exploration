const fs = require('fs');
const lines = fs.readFileSync('src/App.tsx', 'utf-8').split('\n');
let outline = '';
lines.forEach((l, i) => {
  if (l.startsWith('function ') || (l.startsWith('const ') && (l.includes('=>') || l.includes('Ref('))) || l.startsWith('export ') || l.startsWith('interface ')||l.startsWith('type ')) {
    outline += (i+1) + ': ' + l.substring(0, 100) + '\n';
  }
});
fs.writeFileSync('outline.txt', outline);
