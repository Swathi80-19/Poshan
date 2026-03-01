const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(dirPath);
    });
}

walk('c:/Users/srees/Downloads/Poshn/poshn/src', function (filePath) {
    if (filePath.endsWith('.svg') || filePath.endsWith('.png') || filePath.endsWith('.woff') || filePath.endsWith('.woff2') || filePath.endsWith('.ttf')) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let newContent = content
        .replace(/Poshn/g, 'Poshan')
        .replace(/poshn/g, 'poshan')
        .replace(/POSHN/g, 'POSHAN');
    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log('Updated', filePath);
    }
});

let indexHtmlPath = 'c:/Users/srees/Downloads/Poshn/poshn/index.html';
if (fs.existsSync(indexHtmlPath)) {
    let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
    let newIndexHtml = indexHtml
        .replace(/Poshn/g, 'Poshan')
        .replace(/poshn/g, 'poshan')
        .replace(/POSHN/g, 'POSHAN')
        .replace(/\/vite\.svg/g, '/favicon.svg');
    if (indexHtml !== newIndexHtml) {
        fs.writeFileSync(indexHtmlPath, newIndexHtml, 'utf8');
        console.log('Updated index.html');
    }
}
