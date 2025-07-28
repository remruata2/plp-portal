import * as fs from 'fs';
import * as path from 'path';

const projectRoot = process.cwd();
const indicatorsFilePath = path.join(projectRoot, 'src/lib/indicators.md');

function countIndicators() {
  try {
    const mdContent = fs.readFileSync(indicatorsFilePath, 'utf-8');
    
    const mdIndicators = mdContent
      .split(/\s+(?=\d+\.)/)
      .map(line => {
          const [code, ...nameParts] = line.split('::');
          return {
              code: code.trim(),
              name: nameParts.join('::').trim(),
          };
      })
      .filter(ind => ind.code && ind.name); // Filter out any empty results

    console.log(`Found ${mdIndicators.length} indicators in src/lib/indicators.md using the script's parsing logic.`);
  } catch (error) {
    console.error('Error counting indicators:', error);
  }
}

countIndicators();
