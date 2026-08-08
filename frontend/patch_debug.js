const fs = require('fs');
let content = fs.readFileSync('src/pages/AuraPage.tsx', 'utf8');

// Replace buildNetwork to also dump SVG to a visible div
content = content.replace(
  'const basePath = createSvgPath(pathData, "flow-base");',
  `const basePath = createSvgPath(pathData, "flow-base");
          console.log("Draw path from", fromIdx, "to", toIdx, "->", pathData);`
);

content = content.replace(
  'cards.forEach(card => {',
  `console.log("Aura Center:", auraP);
      console.log("Points:", points);
      cards.forEach(card => {`
);

fs.writeFileSync('src/pages/AuraPage.tsx', content);
