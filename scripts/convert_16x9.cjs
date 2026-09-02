const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../src/assets/images/16x9');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const characters = [
  { id: 1, src: 'char_female_investor_1_1788107446499.jpg', out: 'char_16x9_1.jpg' },
  { id: 2, src: 'char_male_founder_1_1788107461128.jpg', out: 'char_16x9_2.jpg' },
  { id: 3, src: 'char_female_executive_2_1788107474758.jpg', out: 'char_16x9_3.jpg' },
  { id: 4, src: 'char_male_investor_2_1788107493697.jpg', out: 'char_16x9_4.jpg' },
  { id: 5, src: 'char_female_founder_3_1788107512135.jpg', out: 'char_16x9_5.jpg' },
  { id: 6, src: 'char_male_director_3_1788107524283.jpg', out: 'char_16x9_6.jpg' },
  { id: 7, src: 'char_female_partner_4_1788107547969.jpg', out: 'char_16x9_7.jpg' },
  { id: 8, src: 'char_male_entrepreneur_4_1788107561508.jpg', out: 'char_16x9_8.jpg' },
  { id: 9, src: 'char_female_strategist_5_1788107576541.jpg', out: 'char_16x9_9.jpg' },
  { id: 10, src: 'char_male_executive_5_1788107592295.jpg', out: 'char_16x9_10.jpg' }
];

characters.forEach((char) => {
  const srcPath = path.join(__dirname, '../src/assets/images', char.src);
  const outPath = path.join(outDir, char.out);
  
  console.log(`Processing character ${char.id} -> ${char.out}`);
  
  // Create seamless 16:9 widescreen composition:
  // Background: ambient blurred & dark tone extension (1600x900)
  // Foreground: full character portrait scaled to fit 900px height placed at exact center
  // This preserves 100% of the character head, hair, face, shoulders and outfit with zero cut!
  const cmd = `ffmpeg -y -i "${srcPath}" -filter_complex "[0:v]scale=1600:900:force_original_aspect_ratio=increase,crop=1600:900,boxblur=25:6,eq=brightness=-0.12:contrast=1.05[bg];[0:v]scale=-1:900[fg];[bg][fg]overlay=(W-w)/2:0" -q:v 2 "${outPath}"`;
  
  execSync(cmd, { stdio: 'inherit' });
});

console.log('All 10 characters converted to 16:9 widescreen format successfully!');
