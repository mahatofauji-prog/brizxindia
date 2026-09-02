const fs = require('fs');
let code = fs.readFileSync('src/context/AuthContext.tsx', 'utf8');

// Replace new brand owner creation logic to also push to brizx_brands
const oldBrandLogic = `
      if (existingBrand) {
        targetUser = existingBrand;
      } else {
        targetUser = {
          id: \`brand_\${Date.now()}\`,
          name: email.split('@')[0],
          email: email,
          role: 'BRAND_OWNER',
          verified: true,
          createdAt: new Date().toISOString()
        } as User;
      }
`;

const newBrandLogic = `
      const storedBrandsRaw = localStorage.getItem('brizx_brands');
      let allBrands = storedBrandsRaw ? JSON.parse(storedBrandsRaw) : mockBrands;
      const existingBrand = allBrands.find(b => b.email.toLowerCase() === email.toLowerCase());

      if (existingBrand) {
        targetUser = existingBrand;
      } else {
        const newBrandId = \`brand_\${Date.now()}\`;
        targetUser = {
          id: newBrandId,
          name: email.split('@')[0],
          email: email,
          role: 'BRAND_OWNER',
          verified: true,
          createdAt: new Date().toISOString()
        } as User;

        const newBrand = {
          id: newBrandId,
          ownerId: newBrandId,
          brandName: email.split('@')[0],
          email: email,
          logo: '',
          industry: 'Other',
          investmentRequired: { min: 5, max: 20 },
          cityTargets: [],
          description: '',
          establishedYear: new Date().getFullYear().toString(),
          spaceRequired: '100-500 Sq.Ft.',
          verified: false,
          activeOutlets: '0',
          royaltyFee: '0%',
          savedLeads: [],
          unlockedLeads: [],
          createdAt: new Date().toISOString()
        };
        allBrands.unshift(newBrand);
        localStorage.setItem('brizx_brands', JSON.stringify(allBrands));
      }
`;

code = code.replace(oldBrandLogic.trim(), newBrandLogic.trim());
fs.writeFileSync('src/context/AuthContext.tsx', code);
