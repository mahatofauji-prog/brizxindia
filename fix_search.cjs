const fs = require('fs');

const searchSeekersPath = 'src/pages/SearchSeekers.tsx';
let content = fs.readFileSync(searchSeekersPath, 'utf8');

const regex = /const currentSub = subscriptions.find\(s => s.brandId === currentBrand.id\);/;
const replacement = `if (!currentBrand) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Complete your Brand Profile</h2>
        <p className="text-slate-500">Please set up your brand profile to access this page.</p>
      </div>
    );
  }

  const currentSub = subscriptions.find(s => s.brandId === currentBrand.id);`;

content = content.replace(regex, replacement);
fs.writeFileSync(searchSeekersPath, content);
