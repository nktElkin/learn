const fs = require('fs');
const { parseDOM } = require('htmlparser2');

// Get line of issue
function getLineNumberFromPosition(html, position) {
    const lines = html.substring(0, position).split("\n");
    return lines.length;
}

// Parse HTML and find special link tags and :hover pseudo-classes
function findSpecialLinkTags(html) {
    
    // Parse html
    const dom = parseDOM(html, { withStartIndices: true });

    // List declaration
    const emptyLabelLines = [];
    const hrefHashLines = [];
    const hoverLines = [];

    // 
    function traverseNodes(nodes) {
        nodes.forEach(node => {
            if (node.type === 'tag') {
                
                if (node.name === 'a') {
                    const hasEmptyLabel = !node.children.length || node.children.every(child => child.type === 'text' && !child.data.trim());
                    const hasHrefHash = node.attribs && node.attribs.href === '#';
                    const lineNumber = getLineNumberFromPosition(html, node.startIndex);

                    if (hasEmptyLabel) {
                        emptyLabelLines.push(lineNumber);
                    }
                    if (hasHrefHash) {
                        hrefHashLines.push(lineNumber);
                    }
                } else if (node.name === 'style') {
                    const styleContent = node.children[0] && node.children[0].data;
                    if (styleContent && styleContent.includes(':hover')) {
                        const lineNumber = getLineNumberFromPosition(html, node.startIndex);
                        hoverLines.push(lineNumber);
                    }
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
    return { emptyLabelLines, hrefHashLines, hoverLines };
}

// Get file path from command line arguments
const filePath = process.argv[2];

if (!filePath) {
    console.error('Please provide a path to the HTML file.');
    process.exit(1);
}

// Read HTML file
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }
    const { emptyLabelLines, hrefHashLines, hoverLines } = findSpecialLinkTags(data);
    
    if (emptyLabelLines.length) {
        console.log('Links with empty labels found at lines:', emptyLabelLines.join(', '));
    } else {
        console.log('No links with empty labels found.');
    }

    if (hrefHashLines.length) {
        console.log('Links with href="#" found at lines:', hrefHashLines.join(', '));
    } else {
        console.log('No links with href="#" found.');
    }

    if (hoverLines.length) {
        console.log(':hover pseudo-classes found at lines:', hoverLines.join(', '));
    } else {
        console.log('No :hover pseudo-classes found.');
    }
});
