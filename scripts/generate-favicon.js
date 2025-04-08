const fs = require('fs');
const { createCanvas } = require('canvas');
const sharp = require('sharp');
const path = require('path');

// Create directory if it doesn't exist
if (!fs.existsSync('scripts')) {
  fs.mkdirSync('scripts');
}

async function generateFavicon() {
  try {
    // Create a 32x32 canvas for favicon
    const faviconCanvas = createCanvas(32, 32);
    const ctx = faviconCanvas.getContext('2d');
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 32, 32);
    gradient.addColorStop(0, '#FFA63D');
    gradient.addColorStop(0.5, '#EA4C89');
    gradient.addColorStop(1, '#7367F0');
    
    // Fill background
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(0, 0, 32, 32, 8);
    ctx.fill();
    
    // Draw a simple post icon (simplified for small size)
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.roundRect(8, 8, 16, 16, 3);
    ctx.fill();
    
    // Draw a line in the "document"
    ctx.fillStyle = gradient;
    ctx.fillRect(11, 13, 10, 2);
    ctx.fillRect(11, 17, 10, 2);
    
    // Save as PNG first (we'll convert to ICO)
    const pngBuffer = faviconCanvas.toBuffer('image/png');
    fs.writeFileSync('public/favicon-32x32.png', pngBuffer);
    
    // Create apple touch icon (180x180)
    const appleCanvas = createCanvas(180, 180);
    const appleCtx = appleCanvas.getContext('2d');
    
    // Create gradient background
    const appleGradient = appleCtx.createLinearGradient(0, 0, 180, 180);
    appleGradient.addColorStop(0, '#FFA63D');
    appleGradient.addColorStop(0.5, '#EA4C89');
    appleGradient.addColorStop(1, '#7367F0');
    
    // Fill background
    appleCtx.fillStyle = appleGradient;
    appleCtx.beginPath();
    appleCtx.roundRect(0, 0, 180, 180, 45);
    appleCtx.fill();
    
    // Draw a post icon
    appleCtx.fillStyle = 'white';
    appleCtx.beginPath();
    appleCtx.roundRect(45, 45, 90, 90, 12);
    appleCtx.fill();
    
    // Draw a line in the "document"
    appleCtx.fillStyle = appleGradient;
    appleCtx.fillRect(60, 70, 60, 8);
    appleCtx.fillRect(60, 90, 60, 8);
    appleCtx.fillRect(60, 110, 40, 8);
    
    // Save apple touch icon
    const applePngBuffer = appleCanvas.toBuffer('image/png');
    fs.writeFileSync('public/apple-touch-icon.png', applePngBuffer);
    
    // Use sharp to convert the PNG to ICO
    await sharp('public/favicon-32x32.png')
      .resize(32, 32)
      .toFile('public/favicon.ico');
    
    console.log('✅ Favicon files generated successfully!');
  } catch (err) {
    console.error('Error generating favicon:', err);
  }
}

generateFavicon(); 