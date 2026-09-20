const fs = require('fs');
const path = require('path');

const dir = 'src/pages/brand/';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Regex to match the typical currentBrand assignment
  const currentBrandRegex = /const currentBrand\s*=\s*brands\.find\([^)]+\)\s*\|\|\s*\{[^}]+\}\s*as any;/g;
  
  // Replace with a strict lookup and an early return empty state if not found.
  let replacement = `const currentBrand = brands.find(b => b.id === user?.id || (user?.email && b.email === user?.email));

  if (!currentBrand) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Complete your Brand Profile</h2>
        <p className="text-slate-500">Please set up your brand profile to access this page.</p>
      </div>
    );
  }`;
  
  if (content.match(currentBrandRegex)) {
    content = content.replace(currentBrandRegex, replacement);
    fs.writeFileSync(filePath, content);
    console.log('Fixed', filePath);
  }
}

// SearchSeekers.tsx also uses currentBrand?
const searchSeekersPath = 'src/pages/SearchSeekers.tsx';
if (fs.existsSync(searchSeekersPath)) {
  let content = fs.readFileSync(searchSeekersPath, 'utf8');
  const regex = /const currentBrand\s*=\s*brands\.find\([^)]+\)\s*\|\|\s*\{[^}]+\}\s*as any;/g;
  const replacement = `const currentBrand = brands.find(b => b.id === user?.id || (user?.email && b.email === user?.email));`;
  if (content.match(regex)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(searchSeekersPath, content);
    console.log('Fixed', searchSeekersPath);
  }
}
