import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const input = "./public/background";
const output = "./public/bg-webp";

const files = fs.readdirSync(input);
const pngFiles = files.filter(f => f.endsWith('.png')).sort();

console.log(`Starting conversion of ${pngFiles.length} files...`);

for (const file of pngFiles) {
  const inputPath = path.join(input, file);
  const outputPath = path.join(output, file.replace(".png", ".webp"));
  
  try {
    await sharp(inputPath)
      .webp({ quality: 70 })
      .toFile(outputPath);
    console.log(`Converted: ${file} -> ${file.replace(".png", ".webp")}`);
  } catch (err) {
    console.error(`Error converting ${file}:`, err);
  }
}

console.log("Conversion complete!");
