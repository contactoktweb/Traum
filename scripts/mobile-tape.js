const fs = require('fs');

function addMobile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('@media (max-width: 640px) {\n  .tape-banner')) {
    const mobileCss = `
  @media (max-width: 640px) {
    .tape-banner {
      font-size: 0.85rem;
      padding: 6px 20px;
      letter-spacing: 4px;
      text-indent: 4px;
    }
  }
`;
    // Put it after the tape-banner block
    content = content.replace('animation: floatTape 4s ease-in-out infinite;\n        }', 'animation: floatTape 4s ease-in-out infinite;\n        }' + mobileCss);
    
    // Check if css file vs react file
    if(filePath.includes('.css')) {
      content = content.replace('animation: floatTape 4s ease-in-out infinite;\n          }', 'animation: floatTape 4s ease-in-out infinite;\n          }' + mobileCss.replace(/  /g, ' '));
    }
    
    fs.writeFileSync(filePath, content);
    console.log("Added to", filePath);
  }
}

addMobile('app/gracias/ClientGraciasPage.tsx');
addMobile('app/tienda/tienda.css');

