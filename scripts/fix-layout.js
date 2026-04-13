const fs = require('fs');
const layoutPath = 'app/layout.tsx';
let content = fs.readFileSync(layoutPath, 'utf8');

const headTagToInject = `      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Montserrat:wght@700;800;900&display=swap" />
      </head>
`;

if (!content.includes('<head>')) {
  // inject before <body
  content = content.replace('<body', headTagToInject + '      <body');
  fs.writeFileSync(layoutPath, content);
  console.log("Injected");
} else {
  console.log("Already has head");
}
