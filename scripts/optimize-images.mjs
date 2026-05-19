#!/usr/bin/env node
import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname, basename, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const CONFIG = {
  // Input directory (relative to project root)
  inputDir: 'public/images',
  // Maximum width for images
  maxWidth: 1200,
  // Maximum height for images
  maxHeight: 1200,
  // Quality settings
  quality: {
    jpeg: 80,
    webp: 80,
    png: 80
  },
  // Supported extensions
  supportedExts: ['.jpg', '.jpeg', '.png', '.webp']
};

async function getImageFiles(dir) {
  const files = [];
  
  try {
    const entries = await readdir(dir);
    
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stats = await stat(fullPath);
      
      if (stats.isDirectory()) {
        // Recursively get files from subdirectories
        const subFiles = await getImageFiles(fullPath);
        files.push(...subFiles);
      } else if (stats.isFile()) {
        const ext = extname(entry).toLowerCase();
        if (CONFIG.supportedExts.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not read directory ${dir}:`, error.message);
  }
  
  return files;
}

async function optimizeImage(inputPath) {
  try {
    const ext = extname(inputPath).toLowerCase();

    // Create a temporary file path
    const tempPath = inputPath + '.tmp';
    
    let sharpInstance = sharp(inputPath)
      .resize(CONFIG.maxWidth, CONFIG.maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      });

    // Apply format-specific optimizations
    switch (ext) {
      case '.jpg':
      case '.jpeg':
        sharpInstance = sharpInstance.jpeg({ quality: CONFIG.quality.jpeg });
        break;
      case '.png':
        sharpInstance = sharpInstance.png({ quality: CONFIG.quality.png });
        break;
      case '.webp':
        sharpInstance = sharpInstance.webp({ quality: CONFIG.quality.webp });
        break;
    }

    // Save to temporary file first
    await sharpInstance.toFile(tempPath);
    
    // Get file sizes for comparison
    const originalStats = await stat(inputPath);
    const optimizedStats = await stat(tempPath);
    const savings = ((originalStats.size - optimizedStats.size) / originalStats.size * 100).toFixed(1);
    
    // Replace original with optimized version
    const { rename } = await import('fs/promises');
    await rename(tempPath, inputPath);
    
    console.log(`✅ ${basename(inputPath)}: ${formatBytes(originalStats.size)} → ${formatBytes(optimizedStats.size)} (${savings}% reduction)`);
    
  } catch (error) {
    console.error(`❌ Error optimizing ${basename(inputPath)}:`, error.message);
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function main() {
  const projectRoot = join(__dirname, '..');
  const inputDir = join(projectRoot, CONFIG.inputDir);

  console.log('🖼️  Image Optimization Tool');
  console.log(`📁 Processing directory: ${CONFIG.inputDir}`);
  console.log(`📐 Max dimensions: ${CONFIG.maxWidth}x${CONFIG.maxHeight}px`);
  console.log('⚠️  WARNING: This will replace your original images!');
  console.log('');

  // Get all image files
  const imageFiles = await getImageFiles(inputDir);
  
  if (imageFiles.length === 0) {
    console.log('No image files found in the input directory.');
    return;
  }

  console.log(`Found ${imageFiles.length} image(s) to optimize:`);
  console.log('');

  // Process each image
  for (const inputPath of imageFiles) {
    await optimizeImage(inputPath);
  }

  console.log('');
  console.log('✨ Image optimization complete!');
}

main().catch(console.error);