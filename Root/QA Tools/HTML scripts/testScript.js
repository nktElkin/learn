const fs = require('fs');
const { parseDOM } = require('htmlparser2');
// const {parse} = require('html-dom-parser');


// // Imports js
const { logReport, tableTags} = require('./InputOutput/complectReport');
const { checkIsEmptyLinks, checkIsHashHref} = require('./Tests/linkValidation');
const {checkRegexPattern} = require('./Tests/regexValidation.js');
const {checkIsRoleTable} = require('./Tests/tableValidation.js');
const {checkSrc} = require('./Tests/readSource.js');
const {parseHtmlDom} = require('./InputOutput/parseHtmlDom.js');
// const { tableTags} = require('./Output/complectReport');



// Get line of issue
function getLineNumberFromPosition(html, position) {
    const lines = html.substring(0, position).split("\n");
    return lines.length;
}

// async function checkIsImageAvailable(node) {
//     if (!node) throw new Error('HTML parsing error');
//     const hasSrc = node.attribs && node.attribs.src;
//     if (!hasSrc) {
//         return false;
//     }
//     try {
//         const response = await axios.head(node.attribs.src);
//         return response.status === 200;
//     } catch (error) {
//         return false;
//     }
// }



// Parse HTML and find special link tags and :hover pseudo-classes
async function findSpecialLinkTags(html) {

    // Parse html


    
    const dom = await parseHtmlDom(html);
    // const dom = parseDOM(html, { withStartIndices: true });



    // List declaration
    const emptyLinks = [];
    const hrefHashLines = [];
    const hoverLines = [];
    const tableTags = [];
    const missingImages = [];
    const regExPatterns = [];


    const {hasHtml, hasImages, markup, images} = await checkSrc();
    const imagesList = images !== null? images : [];
    // console.log(images);

    if(hasHtml === null) return null;

    
    function traverseNodes(nodes) {
        if(!Array.isArray(nodes)) nodes = [nodes];
        nodes.forEach(node => {

            if (node.type === 'tag') {
                let lineNumber;
                switch (node.name) {
                    case 'a':
                        const hasEmptyLabel = checkIsEmptyLinks(node);
                        const hasHrefHash = checkIsHashHref(node);
                        lineNumber = getLineNumberFromPosition(html, node.startIndex);

                        if (hasEmptyLabel) {
                            emptyLinks.push(lineNumber);
                        }
                        if (hasHrefHash) {
                            hrefHashLines.push(lineNumber);
                        }
                        break;
                    case 'style':
                        const styleContent = node.children[0] && node.children[0].data;
                        if (styleContent && styleContent.includes(':hover')) {
                            lineNumber = getLineNumberFromPosition(html, node.startIndex);
                            hoverLines.push(lineNumber);
                        }
                        break;
                    case 'table':
                        const hasRolePresentation = checkIsRoleTable(node);
                        if (!hasRolePresentation){
                            lineNumber = getLineNumberFromPosition(html, node.startIndex);
                            tableTags.push(lineNumber);
                        }
                        break;
                    // case 'img':
                    //         const imageExists = checkIsImageAvailable(node);
                    //         if (!imageExists) {
                    //             lineNumber = getLineNumberFromPosition(html, node.startIndex);
                    //             console.log(node.startIndex);
                    //             missingImages.push(lineNumber);
                    //         }
                    //         break;

                }
                

                if (node.attribs && node.attribs.style && node.attribs.style.includes(':hover')) {
                    const lineNumber = getLineNumberFromPosition(html, node.startIndex);
                    hoverLines.push(lineNumber);
                }
            }
            
            if(node.type === 'text' && node?.data){
                const hasRegExPattern = checkRegexPattern(node) 
                if(hasRegExPattern !== null && hasRegExPattern !== undefined){
                    const {pattern, content} = hasRegExPattern;
                    lineNumber = getLineNumberFromPosition(html, node.startIndex)
                    regExPatterns.push(`${pattern} in node from ${lineNumber}`);
                }
            }


            if (node.children && node.children.length) {
                traverseNodes(node.children);
            }
        });
    }

    traverseNodes(dom);
    return { emptyLinks, hrefHashLines, hoverLines, tableTags, missingImages, imagesList, regExPatterns };
}






// Get directory of test document
const filePath = process.argv[2];

if (!filePath) {
    console.error('Please provide a path to the HTML file.');
    process.exit(1);
}


const reportimg = async (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    const { emptyLinks, hrefHashLines, hoverLines, tableTags, missingImages, imagesList, regExPatterns} = await findSpecialLinkTags(data);

    logReport('images', ' ', imagesList);
    logReport('tag', "Emplty links", emptyLinks);
    logReport('tag', "# href", hrefHashLines);
    logReport('tag', ":hover class", hoverLines);
    logReport('tag', "table without role 'presenatation'", tableTags);
    logReport('regex', "regEx pattern", regExPatterns);
}

fs.readFile(filePath, 'utf8', (err, data) => reportimg(err, data));






//TODO:
    // 👍 1. add alt text check for images - if is avalabel/not, is is field/not
    // 2. add generation of links hrefs, images alts, _lables (only valid) to csv/excel
    // 👍⭕ - needed more 3. add add regex validation
    // 4. add check of meta tag validity
    // 5. add possibility to generate json/html of whole report to export functionality

    // 6. re-write to async
    // 7. create an electron GUI wrapper/shell 
    // 8. migrate to electron
