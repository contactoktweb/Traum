const fs = require('fs');

// Remove from gracias page
const graciasPath = 'app/gracias/ClientGraciasPage.tsx';
let graciasContent = fs.readFileSync(graciasPath, 'utf8');
graciasContent = graciasContent.replace(/@import url\('https:\/\/fonts.googleapis.com[^]+?swap'\);/, '');
fs.writeFileSync(graciasPath, graciasContent);

// Remove from layout
const layoutPath = 'app/layout.tsx';
let layoutContent = fs.readFileSync(layoutPath, 'utf8');
layoutContent = layoutContent.replace(/<link rel="stylesheet" href="https:\/\/fonts.googleapis.com[^>]+ \/>\n?/, '');
fs.writeFileSync(layoutPath, layoutContent);

console.log("Removed Google Fonts URLs completely.");
