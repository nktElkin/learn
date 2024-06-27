const fs = require('fs');
const { parseDOM } = require('htmlparser2');
const {parse} = require('html-dom-parser');
// import parse from 'html-dom-parser';



// Get line of issue
function getLineNumberFromPosition(html, position) {
    const lines = html.substring(0, position).split("\n");
    return lines.length;
}

// Validation
function checkIsEmptyLinks(node) {
    if (!node) throw new Error('HTML pasring error');
    const emptyLink = !node.children.length || node.children.every(child => child.type === 'text' && !child.data.trim());
    return emptyLink;
}
function checkIsHashHref(node) {
    if (!node) throw new Error('HTML pasring error');
    const hashLink = node.attribs && node.attribs.href === '#';
    return hashLink;
}
function checkIsRoleTable(node) {
    if (!node) throw new Error('HTML pasring error');
    const hasRole = node.attribs && node.attribs.role === 'presentation';
    return hasRole;
}
async function checkIsImageAvailable(node) {
    if (!node) throw new Error('HTML parsing error');
    const hasSrc = node.attribs && node.attribs.src;
    if (!hasSrc) {
        return false;
    }
    try {
        const response = await axios.head(node.attribs.src);
        return response.status === 200;
    } catch (error) {
        return false;
    }
}





function logReport(type, list) {
    if (list?.length) console.log(`🔴 Faild:    ${type}: ${list.join(', ')}`);
    else console.log(`🟢 Succeed:  ${type}`)
}
function tableReport(type, list) {    
    let result = '🔴 Faild';
    let log = ""
    if (list?.length) log = `${type}: ${list.join(', ')}`;
    else result = '🟢 Succeed'
    return [result, type, log]
}




// Parse HTML and find special link tags and :hover pseudo-classes
function findSpecialLinkTags(html) {

    // Parse html
    const dom = parseDOM(html, { withStartIndices: true });

    // List declaration
    const emptyLinks = [];
    const hrefHashLines = [];
    const hoverLines = [];
    const tableTags = [];
    const missingImages = [];


    function traverseNodes(nodes) {
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

            if (node.children && node.children.length) {
                traverseNodes(node.children);
            }
        });
    }


    traverseNodes(dom);
    return { emptyLinks, hrefHashLines, hoverLines, tableTags, missingImages };
}




// Get directory of test document
const filePath = process.argv[2];

if (!filePath) {
    console.error('Please provide a path to the HTML file.');
    process.exit(1);
}


// Read document, trigger parsing
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }
    const { emptyLinks, hrefHashLines, hoverLines, tableTags, missingImages} = findSpecialLinkTags(data);

    logReport("Emplty links", emptyLinks);
    logReport("# href", hrefHashLines);
    logReport(":hover class", hoverLines);
    logReport("table without role 'presenatation'", tableTags);
    // logReport("image is available", missingImages);
    
    // const links = tableReport("Emplty links", emptyLinks);
    // const  href = tableReport("# href", hrefHashLines);
    // hover = tableReport(":hover class", hoverLines);
    // table = tableReport("table without role 'presenatation'", tableTags);



    // const reportTable = [
    //     ["result", "type", "log"],
    //     [links[0], links[1], links[2]],
    //     [href[0], href[1], href[2]],
    //     [hover[0], hover[1], hover[2]]
    // ];
    // console.table(reportTable)
});




//TODO:
    // 1. add alt text check for images - if is avalabel/not, is is field/not
    // 2. add genetation of links hrefs, images alts, _lables (only valid) to csv/excel
    // 3. add add regex validation
    // 4. add check of meta tag validity
    // 5. add possibility to generate json/html of whole report to export functionality

    // 6. re-write to async
    // 7. create an electron GUI wrapper/shell 
    // 8. migrate to electron
