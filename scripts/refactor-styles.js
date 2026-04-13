const fs = require('fs');

const globalsPath = 'app/globals.css';
const pagePath = 'app/tienda/ClientTiendaPage.tsx';

let globalsContent = fs.readFileSync(globalsPath, 'utf8');
let pageContent = fs.readFileSync(pagePath, 'utf8');

const regex = /(@import url\('https:\/\/fonts.googleapis.com[^]*?\` \}\} \/>)/;
const match = pageContent.match(regex);

if (match) {
  let extract = match[1];
  
  // Cut it from page
  pageContent = pageContent.replace(extract, '` }} />');
  
  // Format the extracted part to remove the closing backtick and block
  extract = extract.replace('` }} />', '').trim();
  
  // Add Chewy and edit Google fonts
  const fontFaceChewy = `
@font-face {
  font-family: 'Chewy';
  src: url('/chewy/Chewy-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
`;
  extract = extract.replace(
    "@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Chewy&family=Montserrat:wght@700;800;900&display=swap');",
    ""
  );

  const finalAppendedCss = `\n/* Tienda Phase 1 Styles */\n${fontFaceChewy}${extract}`;
  
  // Also we need to inject the import at the top of globals.css after tailwind imports
  const importStatement = "@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Montserrat:wght@700;800;900&display=swap');";
  
  let lines = globalsContent.split('\n');
  let insertIndex = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('@import')) {
      insertIndex = i + 1;
    }
  }
  lines.splice(insertIndex, 0, importStatement);
  globalsContent = lines.join('\n') + finalAppendedCss;

  fs.writeFileSync(globalsPath, globalsContent);
  fs.writeFileSync(pagePath, pageContent);
  console.log("Refactored successfully");
} else {
  console.log("Could not find the style block to extract");
}
