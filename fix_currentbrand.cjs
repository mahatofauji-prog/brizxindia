const fs = require('fs');
const path = require('path');

const dir = 'src/pages/brand/';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // We split by standard parts
  if (content.includes('as any;')) {
    const lines = content.split('\n');
    let newLines = [];
    let changed = false;
    for (let i=0; i<lines.length; i++) {
       let line = lines[i];
       if (line.includes('const currentBrand = brands.find') && line.includes('as any;')) {
         newLines.push(`  const currentBrand = brands.find(b => b.id === user?.id || (user?.email && b.email === user?.email));`);
         newLines.push(`  if (!currentBrand) {`);
         newLines.push(`    return (`);
         newLines.push(`      <div className="flex flex-col items-center justify-center h-96 space-y-4">`);
         newLines.push(`        <h2 className="text-xl font-bold text-slate-800">Complete your Brand Profile</h2>`);
         newLines.push(`        <p className="text-slate-500">Please set up your brand profile to access this page.</p>`);
         newLines.push(`      </div>`);
         newLines.push(`    );`);
         newLines.push(`  }`);
         changed = true;
       } else {
         newLines.push(line);
       }
    }
    if (changed) {
      fs.writeFileSync(filePath, newLines.join('\n'));
      console.log('Fixed', filePath);
    }
  }
}

const searchSeekersPath = 'src/pages/SearchSeekers.tsx';
if (fs.existsSync(searchSeekersPath)) {
  let content = fs.readFileSync(searchSeekersPath, 'utf8');
  const lines = content.split('\n');
  let newLines = [];
  let changed = false;
  for (let i=0; i<lines.length; i++) {
     let line = lines[i];
     if (line.includes('const currentBrand = brands.find') && line.includes('as any;')) {
       newLines.push(`  const currentBrand = brands.find(b => b.id === user?.id || (user?.email && b.email === user?.email));`);
       changed = true;
     } else {
       newLines.push(line);
     }
  }
  if (changed) {
    fs.writeFileSync(searchSeekersPath, newLines.join('\n'));
    console.log('Fixed', searchSeekersPath);
  }
}
