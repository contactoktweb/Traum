const fs = require('fs');
let code = fs.readFileSync('app/ClientHomePage.tsx', 'utf8');

const cursorMarkup = `      {/* Cursor */}
      <div
        className="fixed pointer-events-none z-[100] rounded-full mix-blend-difference hidden md:block"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          width: hoverMascot ? 60 : 12,
          height: hoverMascot ? 60 : 12,
          transform: "translate(-50%, -50%)",
          background: colors.cream,
          transition: "width 0.25s, height 0.25s",
        }}
      />
`;

if (!code.includes('{/* Cursor */}')) {
  code = code.replace('<Header />', '<Header />\n' + cursorMarkup);
  fs.writeFileSync('app/ClientHomePage.tsx', code);
  console.log('Cursor restored');
}
