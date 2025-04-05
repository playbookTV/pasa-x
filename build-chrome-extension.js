import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const distDir = path.join(__dirname, 'dist');
const publicDir = path.join(__dirname, 'public');

// Clean dist directory
console.log('Cleaning dist directory...');
fs.emptyDirSync(distDir);

// Run the Vite build
console.log('Building the extension...');
try {
  execSync('pnpm build-ext', { stdio: 'inherit' });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}

// Copy manifest and other static files
console.log('Copying manifest and static files...');
fs.copyFileSync(
  path.join(publicDir, 'manifest.json'),
  path.join(distDir, 'manifest.json')
);

// Create a fixed popup.html with correct paths
console.log('Creating popup.html with correct paths...');
const popupHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Pasa - AI Job Assistant</title>
  
  <!-- Preconnect to Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  
  <link rel="stylesheet" href="./assets/popup.css" />
</head>
<body>
  <div id="root"></div>
  <script type="module" src="./assets/popup.js"></script>
</body>
</html>`;

fs.writeFileSync(path.join(distDir, 'popup.html'), popupHtml);

// Copy icon
if (fs.existsSync(path.join(publicDir, 'icon.png'))) {
  fs.copyFileSync(
    path.join(publicDir, 'icon.png'),
    path.join(distDir, 'icon.png')
  );
}

// Copy content script and background script if not already included
console.log('Verifying content and background scripts...');
if (!fs.existsSync(path.join(distDir, 'content.js'))) {
  fs.copyFileSync(
    path.join(publicDir, 'content.js'),
    path.join(distDir, 'content.js')
  );
}

if (!fs.existsSync(path.join(distDir, 'background.js'))) {
  fs.copyFileSync(
    path.join(publicDir, 'background.js'),
    path.join(distDir, 'background.js')
  );
}

// Remove public/popup.html from dist if it exists (to avoid confusion)
if (fs.existsSync(path.join(distDir, 'public', 'popup.html'))) {
  console.log('Removing duplicate popup.html...');
  fs.removeSync(path.join(distDir, 'public', 'popup.html'));
}

console.log('Chrome extension build completed successfully!');
console.log('You can load the extension from the "dist" folder in Chrome.'); 