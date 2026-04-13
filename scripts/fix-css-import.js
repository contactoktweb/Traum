const fs = require('fs');
const globalsPath = 'app/globals.css';
let content = fs.readFileSync(globalsPath, 'utf8');

const importStr = "@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Montserrat:wght@700;800;900&display=swap');";

content = content.replace(importStr, ''); // remove it
content = importStr + '\n' + content.trim(); // put at absolute top

fs.writeFileSync(globalsPath, content);
