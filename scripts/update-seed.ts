import * as fs from 'fs';
import * as path from 'path';

// Use process.cwd() to get the project root directory
const projectRoot = process.cwd();
const indicatorsFilePath = path.join(projectRoot, 'src/lib/indicators.md');
const seedFilePath = path.join(projectRoot, 'prisma/seed-hmis-indicators.ts');

async function syncIndicators() {
  // Read indicators from the markdown file
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

  // Generate the full content for the seed file
  const newIndicatorEntries = mdIndicators.map(ind => {
    const escapedName = ind.name.replace(/"/g, '\"');
    return `  {\n    code: "${ind.code}",\n    name: "${escapedName}",\n    type: 'number'\n  }`; // Removed trailing comma for the last element
  }).join(',\n');

  const newSeedFileContent = `import { Prisma } from "../src/generated/prisma";

export const hmisIndicators: Omit<Prisma.IndicatorCreateInput, 'id'>[] = [
${newIndicatorEntries}
];
`;

  fs.writeFileSync(seedFilePath, newSeedFileContent);

  console.log(`Overwrote seed file with ${mdIndicators.length} indicators from the markdown file.`);
}

syncIndicators().catch(error => {
  console.error('Error syncing indicators:', error);
});
