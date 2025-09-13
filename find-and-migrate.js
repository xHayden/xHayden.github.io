#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

// Find all img.hayden.gg URLs in src/components and src/data
function findImageUrls() {
  const srcDirs = ['src/components', 'src/data'];
  const urls = new Set();
  
  function scanFile(filePath) {
    if (!filePath.endsWith('.jsx') && !filePath.endsWith('.js')) return;
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const matches = content.match(/https:\/\/img\.hayden\.gg\/[^\s"'`)]+/g);
      if (matches) {
        matches.forEach(url => urls.add(url));
      }
    } catch (error) {
      console.error(`Error reading ${filePath}:`, error.message);
    }
  }
  
  function scanDirectory(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else {
        scanFile(fullPath);
      }
    });
  }
  
  srcDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      scanDirectory(dir);
    }
  });
  return Array.from(urls);
}

function downloadFile(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filename);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(filename);
      });
    }).on('error', (err) => {
      fs.unlink(filename, () => {});
      reject(err);
    });
  });
}

async function migrateImages() {
  const urls = findImageUrls();
  console.log('Found URLs:', urls);
  
  const photosDir = 'public/photos';
  const urlMapping = {};
  
  for (const url of urls) {
    const urlParts = new URL(url);
    const filename = path.basename(urlParts.pathname);
    const nameWithoutExt = path.parse(filename).name;
    const ext = path.parse(filename).ext;
    
    const tempPath = path.join(photosDir, filename);
    const webpPath = path.join(photosDir, `${nameWithoutExt}.webp`);
    
    try {
      console.log(`Downloading: ${url}`);
      await downloadFile(url, tempPath);
      
      // Skip conversion for gifs, keep original
      if (ext === '.gif') {
        urlMapping[url] = `/photos/${filename}`;
        console.log(`Kept GIF: ${tempPath}`);
      } else {
        // Try to convert to webp
        try {
          execSync(`which cwebp`, { stdio: 'ignore' });
          execSync(`cwebp "${tempPath}" -o "${webpPath}"`, { stdio: 'inherit' });
          fs.unlinkSync(tempPath);
          urlMapping[url] = `/photos/${nameWithoutExt}.webp`;
          console.log(`Converted to webp: ${webpPath}`);
        } catch (error) {
          console.log(`cwebp not found, keeping original: ${tempPath}`);
          urlMapping[url] = `/photos/${filename}`;
        }
      }
      
    } catch (error) {
      console.error(`Error processing ${url}:`, error.message);
    }
  }
  
  console.log('\nURL Mapping:');
  console.log(JSON.stringify(urlMapping, null, 2));
  return urlMapping;
}

migrateImages().catch(console.error);