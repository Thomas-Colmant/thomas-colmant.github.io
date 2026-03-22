const fs = require('fs');
const path = require('path');

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        if (file === 'node_modules' || file === '.git' || file === '.gemini') return;
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walkDir(file));
        } else { 
            if (file.endsWith('.html')) {
                results.push(file);
            }
        }
    });
    return results;
}

const dir = 'c:\\Users\\colma\\Desktop\\thomas-colmant.github.io';
const files = walkDir(dir);
let count = 0;

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    let modified = false;
    
    if (content.includes('../fond ecran prod audioviusle.png')) {
        content = content.split('../fond ecran prod audioviusle.png').join('../web tv layover point.png');
        modified = true;
    }
    
    // Check for root references or other typo paths
    if (content.includes('/web tv - layover point.png')) {
        // Change from the incorrect hyphenated one to the actual file name
        content = content.split('/web tv - layover point.png').join('/web tv layover point.png');
        modified = true;
    }
    
    if (content.includes('./web tv - layover point.png')) {
        content = content.split('./web tv - layover point.png').join('./web tv layover point.png');
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(f, content, 'utf8');
        console.log(`Updated ${f}`);
        count++;
    }
});

console.log(`Total files updated: ${count}`);
