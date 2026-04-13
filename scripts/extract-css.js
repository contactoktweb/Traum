const fs = require('fs');

const file = fs.readFileSync('app/tienda/ClientTiendaPage.tsx', 'utf8');

const startStr = "@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Chewy&family=Montserrat:wght@700;800;900&display=swap');";
const endStr = "</style>";

const startIndex = file.indexOf(startStr);
const endIndex = file.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
  const cssToMove = file.substring(startIndex, endIndex);
  fs.writeFileSync('css-extracted.txt', cssToMove);
  console.log("Extracted");
} else {
  console.log("Not found", startIndex, endIndex);
}
