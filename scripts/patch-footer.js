const fs = require('fs');
const files = [
  'app/ClientHomePage.tsx',
  'app/tienda/ClientTiendaPage.tsx',
  'app/gracias/ClientGraciasPage.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  if (!content.includes('const [currentYear')) {
    // Add state variable right after other states
    content = content.replace(/(const \[.*?\] = useState.*?\n)/, '$1  const [currentYear, setCurrentYear] = useState("")\n');
    
    // Add the useEffect content
    content = content.replace(/useEffect\(\(\) => \{\n/, 'useEffect(() => {\n    setCurrentYear(new Date().getFullYear().toString())\n');
    
    // Replace new Date().getFullYear() in jsx
    content = content.replace(/\{new Date\(\)\.getFullYear\(\)\}/g, '{currentYear || new Date().getFullYear()}');
    fs.writeFileSync(file, content);
    console.log("Patched", file);
  }
});
