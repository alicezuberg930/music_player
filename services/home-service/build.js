const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

// Build with TypeScript
execSync('tsc', { stdio: 'inherit' });

// Transform @ imports to relative paths
function transformPaths(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            transformPaths(filePath);
        } else if (file.endsWith('.js')) {
            let content = fs.readFileSync(filePath, 'utf8');
            content = content.replace(/@\//g, './');
            fs.writeFileSync(filePath, content);
        }
    });
}

transformPaths('./dist');
console.log('Build complete with path transformation');