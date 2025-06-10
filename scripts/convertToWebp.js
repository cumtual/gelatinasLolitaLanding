import sharp from 'sharp';
import { readdir } from 'fs/promises';
import { join, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sourceDir = join(__dirname, '../src/assets/images/gelatinasCombinadas');

// Función para convertir una imagen a WebP
async function convertToWebP(inputPath) {
  const outputPath = inputPath.replace(/\.(png|jpg|jpeg)$/, '.webp');
  
  try {
    await sharp(inputPath)
      .webp({ quality: 80 }) // Ajusta la calidad según necesites (0-100)
      .toFile(outputPath);
    
    console.log(`✅ Convertido: ${basename(inputPath)} -> ${basename(outputPath)}`);
  } catch (error) {
    console.error(`❌ Error al convertir ${basename(inputPath)}:`, error);
  }
}

// Procesar todas las imágenes en el directorio
async function processDirectory() {
  try {
    const files = await readdir(sourceDir);
    
    for (const file of files) {
      if (file.match(/\.(png|jpg|jpeg)$/i)) {
        const inputPath = join(sourceDir, file);
        await convertToWebP(inputPath);
      }
    }
    
    console.log('🎉 Conversión completada!');
  } catch (error) {
    console.error('Error al procesar el directorio:', error);
  }
}

processDirectory(); 