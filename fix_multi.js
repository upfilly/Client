const fs = require('fs');

const cssToScss = (filePath, wrapperClass, newFilePath) => {
    let css = fs.readFileSync(filePath, 'utf8');
    let importUrl = '';
    const importRegex = /@import url\([^)]+\);/g;
    css = css.replace(importRegex, match => {
        importUrl += match + '\n';
        return '';
    });
    let scss = `${importUrl}\n.${wrapperClass} {\n${css}\n}`;
    fs.writeFileSync(newFilePath, scss);
    fs.unlinkSync(filePath);
}

// 1. Convert MultiSelectDropdownData.css to scss
cssToScss('src/app/campaign/MultiSelectDropdownData.css', 'multi-select-wrapper', 'src/app/campaign/MultiSelectDropdownData.scss');

// 2. Update MultiSelectDropdownData.jsx
let multiDropJs = fs.readFileSync('src/app/campaign/MultiSelectDropdownData.jsx', 'utf8');
multiDropJs = multiDropJs.replace('import "./MultiSelectDropdownData.css";', 'import "./MultiSelectDropdownData.scss";');
multiDropJs = multiDropJs.replace('<div className="dropdown-container show-drop">', '<div className="dropdown-container show-drop multi-select-wrapper">');
fs.writeFileSync('src/app/campaign/MultiSelectDropdownData.jsx', multiDropJs);

// 3. Update MultiSelectRegion.jsx
let multiRegionJs = fs.readFileSync('src/app/campaign/MultiSelectRegion.jsx', 'utf8');
multiRegionJs = multiRegionJs.replace('import "./MultiSelectDropdownData.css";', 'import "./MultiSelectDropdownData.scss";');
multiRegionJs = multiRegionJs.replace('<div className="dropdown-container show-drop">', '<div className="dropdown-container show-drop multi-select-wrapper">');
fs.writeFileSync('src/app/campaign/MultiSelectRegion.jsx', multiRegionJs);

console.log("Done refactoring MultiSelect");
