#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const photosDir = 'public/photos';

// Get all image files
const files = fs.readdirSync(photosDir).filter(file => 
  file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')
);

console.log('Converting images to webp...');

files.forEach(file => {
  const inputPath = path.join(photosDir, file);
  const nameWithoutExt = path.parse(file).name;
  const outputPath = path.join(photosDir, `${nameWithoutExt}.webp`);
  
  try {
    // Try cwebp first (Google's webp encoder)
    try {
      execSync('which cwebp', { stdio: 'ignore' });
      execSync(`cwebp "${inputPath}" -o "${outputPath}"`, { stdio: 'inherit' });
      fs.unlinkSync(inputPath); // Remove original
      console.log(`✓ Converted: ${file} -> ${nameWithoutExt}.webp`);
    } catch (cwebpError) {
      // Fallback to imagemagick
      try {
        execSync('which convert', { stdio: 'ignore' });
        execSync(`convert "${inputPath}" "${outputPath}"`, { stdio: 'inherit' });
        fs.unlinkSync(inputPath); // Remove original
        console.log(`✓ Converted (ImageMagick): ${file} -> ${nameWithoutExt}.webp`);
      } catch (convertError) {
        console.log(`⚠ Keeping original format: ${file} (no webp converter found)`);
      }
    }
  } catch (error) {
    console.error(`✗ Error converting ${file}:`, error.message);
  }
});

console.log('\nConversion complete!');