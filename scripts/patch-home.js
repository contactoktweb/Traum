const fs = require('fs');
let code = fs.readFileSync('app/ClientHomePage.tsx', 'utf8');

// remove custom cursor div
code = code.replace(/\{\/\* Cursor \*\/\}[\s\n]*<div[^]*?transition:[^}]*\}\}[^>]*\/>/, '');

// remove cursor: none if present
code = code.replace(/@media \(min-width: 768px\) \{\s*\*\s*\{\s*cursor:\s*none;\s*\}\s*\}/, '');

fs.writeFileSync('app/ClientHomePage.tsx', code);
