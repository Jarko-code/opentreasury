import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SERVICE_API = 'services';
const SUPPLIER_MATRIX = 'entities';
const BUSINESS_ENTITY_SERVICE = 'types';

const RELATIVE_SERVICE_API = './services';
const SUPPLIER_MATRIX_MODEL = './entities';
const RELATIVE_BUSINESS_ENTITY_SERVICE = './types';

const PATHS = {
    [SUPPLIER_MATRIX]: SUPPLIER_MATRIX_MODEL,
    [BUSINESS_ENTITY_SERVICE]: RELATIVE_BUSINESS_ENTITY_SERVICE,
    [SERVICE_API]: RELATIVE_SERVICE_API,
};

const finalLines = [];

for (const [absolutPath, relativePath] of Object.entries(PATHS)) {
    const fullPath = path.join(__dirname, 'src', absolutPath);

    const generated = generateExportLines(fullPath, relativePath);
    const formattedLines = generated.map(formatExportLine(absolutPath, relativePath));
    finalLines.push(...formattedLines);
}

console.log(finalLines.join('\n'));

// Write to index.ts
const indexPath = path.join(__dirname, 'src', 'index.ts');
const content = finalLines.join('\n');
fs.writeFileSync(indexPath, content, 'utf-8');

//HELPERS

function generateExportLines(dirPath, relativePath) {
    const exportLines = [];
    const items = fs.readdirSync(dirPath);

    items.forEach((item) => {
        const itemPath = path.join(dirPath, item);
        const itemRelativePath = path.join(relativePath, item);
        const stats = fs.statSync(itemPath);

        if (stats.isDirectory()) {
            exportLines.push(...generateExportLines(itemPath, itemRelativePath));
        } else if (stats.isFile() && item.endsWith('.ts')) {
            const exportName = path.basename(item, '.ts');
            const fileContent = fs.readFileSync(itemPath, 'utf-8');
            const codeMatch = fileContent.match(/export\s+const\s+(\w+)\s*=\s*/);

            // Najdi všechny exportované typy
            const typeMatches = [
                ...fileContent.matchAll(/export\s+type\s+(\w+)/g),
                ...fileContent.matchAll(/export\s+interface\s+(\w+)/g),
                ...fileContent.matchAll(/export\s+enum\s+(\w+)/g),
            ];

            if (typeMatches.length >= 1 && !fileContent.includes(`class ${exportName}`) && !codeMatch) {
                // Pokud je v souboru více typů a není zde třída ani exportovaná konstanta, exportuj všechny typy najednou
                const typeNames = typeMatches.map((match) => match[1]).join(', ');
                exportLines.push(`export { ${typeNames} } from '${itemRelativePath.replace(/\\/g, '/')}';`);
            } else {
                exportLines.push(`export { ${exportName} } from '${itemRelativePath.replace(/\\/g, '/')}';`);
                if (codeMatch) {
                    const codeName = codeMatch[1];
                    exportLines.push(`export { ${codeName} } from '${itemRelativePath.replace(/\\/g, '/')}';`);
                }
                typeMatches.forEach((match) => {
                    const typeName = match[1];
                    exportLines.push(`export { ${typeName} } from '${itemRelativePath.replace(/\\/g, '/')}';`);
                });
            }
        }
    });

    return exportLines;
}

function formatExportLine(path, relativePath) {
    return (line) => {
        return line.replace(path, relativePath).replace('.ts', '.js');
    };
}
