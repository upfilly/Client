const fs = require('fs');
const path = require('path');

const cssToScss = (filePath, wrapperClass, newFilePath) => {
    let css = fs.readFileSync(filePath, 'utf8');
    let importUrl = '';
    // Extract @import if exists
    const importRegex = /@import url\([^)]+\);/g;
    css = css.replace(importRegex, match => {
        importUrl += match + '\n';
        return '';
    });
    
    let scss = `${importUrl}\n.${wrapperClass} {\n${css}\n}`;
    fs.writeFileSync(newFilePath, scss);
    fs.unlinkSync(filePath);
}

// 1. affiliateguide
cssToScss('src/app/affguide/affiliateguide.css', 'affiliate-guide', 'src/app/affguide/affiliateguide.scss');
let affGuideJs = fs.readFileSync('src/app/affguide/page.jsx', 'utf8');
affGuideJs = affGuideJs.replace('import "./affiliateguide.css";', 'import "./affiliateguide.scss";');
fs.writeFileSync('src/app/affguide/page.jsx', affGuideJs);

// 2. TrackingGuide
let trackingCss = fs.readFileSync('src/app/shopifyguide/TrackingGuide.css', 'utf8');
let trackingScss = `.tracking-setup {\n${trackingCss.replace(/\.tracking-setup\s*{([^}]*)}/g, '&$1')}\n}`;
// Wait, the regex replace might be tricky, let's just use a wrapper class tracking-setup-wrapper
fs.writeFileSync('src/app/shopifyguide/TrackingGuide.scss', `.tracking-setup-wrapper {\n${trackingCss}\n}`);
fs.unlinkSync('src/app/shopifyguide/TrackingGuide.css');
let trackingJs = fs.readFileSync('src/app/shopifyguide/page.js', 'utf8');
trackingJs = trackingJs.replace("import './TrackingGuide.css';", "import './TrackingGuide.scss';");
trackingJs = trackingJs.replace('className="tracking-setup"', 'className="tracking-setup tracking-setup-wrapper"');
fs.writeFileSync('src/app/shopifyguide/page.js', trackingJs);

// 3. DataComparison
cssToScss('src/app/activitydetail/DataComparison.css', 'data-comparison-wrapper', 'src/app/activitydetail/DataComparison.scss');
let dataCompJs = fs.readFileSync('src/app/activitydetail/compareData.js', 'utf8');
dataCompJs = dataCompJs.replace("import './DataComparison.css';", "import './DataComparison.scss';");
dataCompJs = dataCompJs.replace("<div className='my-5'>", "<div className='data-comparison-wrapper'>\n            <div className='my-5'>");
dataCompJs = dataCompJs.replace("</Layout></>", "</Layout>\n        </div>\n        </>"); // wait, compareData.js has no <Layout>, it returns <> <div className='my-5'>...</div> </>
fs.writeFileSync('src/app/activitydetail/compareData.js', dataCompJs);

// 4. CustomDatePicker
cssToScss('src/app/components/common/DatePicker/CustomDatePicker.css', 'custom-date-picker-wrapper', 'src/app/components/common/DatePicker/CustomDatePicker.scss');
let datePickerJs = fs.readFileSync('src/app/components/common/DatePicker/DatePickerCustom.js', 'utf8');
datePickerJs = datePickerJs.replace('import "./CustomDatePicker.css";', 'import "./CustomDatePicker.scss";');
datePickerJs = datePickerJs.replace('return (\n    <div className={comparisonPeriod', 'return (\n    <div className="custom-date-picker-wrapper">\n    <div className={comparisonPeriod');
datePickerJs = datePickerJs.replace('      </div>\n    </div>\n  );\n};\n\nexport default CustomDatePicker;', '      </div>\n    </div>\n    </div>\n  );\n};\n\nexport default CustomDatePicker;');
fs.writeFileSync('src/app/components/common/DatePicker/DatePickerCustom.js', datePickerJs);

// 5. Tooltip
cssToScss('src/app/components/common/Tooltip/Tooltip.css', 'tooltip-scoped-wrapper', 'src/app/components/common/Tooltip/Tooltip.scss');
let tooltipJs = fs.readFileSync('src/app/components/common/Tooltip/CustomTooltip.js', 'utf8');
tooltipJs = tooltipJs.replace("import './Tooltip.css';", "import './Tooltip.scss';");
tooltipJs = tooltipJs.replace('className="tooltip-container"', 'className="tooltip-container tooltip-scoped-wrapper"');
fs.writeFileSync('src/app/components/common/Tooltip/CustomTooltip.js', tooltipJs);

console.log("Done refactoring css files");
