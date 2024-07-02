const fs = require('fs');
const { parseDOM } = require('htmlparser2');
// const {parse} = require('html-dom-parser');


// // Imports js
const { logReport, tableTags} = require('./InputOutput/complectReport.js');
const { checkIsEmptyLinks, checkIsHashHref, checkIsEmptyPath, checkIncorrectLabel} = require('./Tests/linkValidation.js');
const {checkIncorrectAlt, checkIsEmptySrc} = require('./Tests/imagesValidation.js');
const {checkRegexPattern} = require('./Tests/regexValidation.js');
const {checkMeta, checkLang} = require('./Tests/headValidation.js');
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
    const hrefIsEmpty = []
    const hoverLines = [];
    const tableTags = [];
    const missingImages = [];
    const incorrectAlts = [];
    const regExPatterns = [];
    const incorrectLabel = [];
    
    let correctMetaData = true; // false if incorrect
    let langData = ''; // false if incorrect, value if correct
    
    
    const {hasHtml, hasImages, markup, images} = await checkSrc();
    const imagesList = images !== null? images : [];
    
    const labelList = [];
    const altsList = [];
    // console.log(images);
    
    if(hasHtml === null) return null;
    
    
    function traverseNodes(nodes) {
        if(!Array.isArray(nodes)) nodes = [nodes];
        nodes.forEach(node => {

            if (node.type === 'tag') {
                let lineNumber;
                switch (node.name) {
                    case 'img':
                        const hasNoCorrectAlts = checkIncorrectAlt(node);
                        lineNumber = getLineNumberFromPosition(html, node.startIndex);
                        if(typeof hasNoCorrectAlts === 'string') altsList.push(`line ${lineNumber}: ${hasNoCorrectAlts}`);
                        if (hasNoCorrectAlts && typeof hasNoCorrectAlts !== 'string') {
                            incorrectAlts.push(lineNumber);
                        }
                    case 'a':
                        const hasEmptyLabel = checkIsEmptyLinks(node);
                        const hasHrefHash = checkIsHashHref(node);
                        const hasEmptyHrefPath = checkIsEmptyPath(node);
                        const hasNoCorrectLabels = checkIncorrectLabel(node)
                        
                        // const hasIncorrect = checkIncorrectLabel(node)
                        lineNumber = getLineNumberFromPosition(html, node.startIndex);
                        if(typeof hasNoCorrectLabels === 'string') labelList.push(`line ${lineNumber}: ${hasNoCorrectLabels}`);
                        

                        if (hasEmptyLabel) {
                            emptyLinks.push(lineNumber);
                        }
                        if (hasHrefHash) {
                            hrefHashLines.push(lineNumber);
                        }
                        if (hasEmptyHrefPath) {
                            hrefIsEmpty.push(lineNumber);
                        }
                        if (hasNoCorrectLabels && typeof hasNoCorrectLabels !== 'string') {
                            incorrectLabel.push(lineNumber);
                        }
                        
                        break;
                    case 'style':
                        const styleContent = node.children[0] && node.children[0].data;
                        if (styleContent && styleContent.includes(':hover')) {
                            lineNumber = getLineNumberFromPosition(html, node.startIndex);
                            hoverLines.push(lineNumber);
                        }
                        break;

                    case 'html':
                        const hasLang = checkLang(node); //false if incorrect
                        if(!hasLang && typeof hasLang === 'boolean'){
                            langData = false;
                        }
                        lineNumber = getLineNumberFromPosition(html, node.startIndex);
                        if(typeof hasLang === 'string') langData = `line ${lineNumber}: language is ${hasLang}`;
                        break;

                    case 'meta':
                        if(node?.attribs?.content && !node?.attribs?.name){
                            correctMetaData = checkMeta(node); // false if incorrect
                            //  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
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
                    //         const imageExists = checkIsImageAvailabel(node);
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

    // exports
    return { emptyLinks, hrefHashLines,
        hoverLines, tableTags,
        missingImages, imagesList,
        regExPatterns, hrefIsEmpty,
        labelList, incorrectLabel,
        altsList, incorrectAlts,
        correctMetaData, langData};
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

    const { emptyLinks, hrefHashLines, hoverLines,
            tableTags, missingImages, imagesList,
            regExPatterns, hrefIsEmpty, labelList,
            incorrectLabel, incorrectAlts, altsList,
            correctMetaData, langData} = await findSpecialLinkTags(data);

    logReport('list', 'images', imagesList);
    logReport('tag', "Emplty links", emptyLinks);
    logReport('tag', "Emplty href path", hrefIsEmpty);
    logReport('tag', "# href", hrefHashLines);
    logReport('tag', ":hover class", hoverLines);
    logReport('tag', "table without role 'presenatation'", tableTags);
    logReport('regex', "regEx pattern", regExPatterns);
    logReport('tag', "no _label", incorrectLabel);
    logReport('list', 'labels', labelList);
    logReport('tag', "no alts values", incorrectAlts);
    logReport('list', 'alts', altsList);
    logReport('value', 'meta tag', [], correctMetaData);
    logReport('value', 'language', [], langData);
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
