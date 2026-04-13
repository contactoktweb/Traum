const fs = require('fs');

const globalsPath = 'app/globals.css';
let globalsContent = fs.readFileSync(globalsPath, 'utf8');

const marker = "/* Tienda Phase 1 Styles */";
const startIndex = globalsContent.indexOf(marker);

if (startIndex !== -1) {
  const customCss = globalsContent.substring(startIndex);
  // remove it from globals
  globalsContent = globalsContent.substring(0, startIndex).trim();
  fs.writeFileSync(globalsPath, globalsContent);
  
  // write it to tienda.css
  fs.writeFileSync('app/tienda/tienda.css', customCss);
  console.log("Moved to tienda.css");
} else {
  console.log("Marker not found in globals.css");
}
