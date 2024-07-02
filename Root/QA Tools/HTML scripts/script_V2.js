/**
* Represents an issue found during validation.
* @typedef {Object} Issue
* @property {string} issueType - The type of issue ('bug', 'info').
* @property {string} validationType - The type of validation that was performed.
* @property {number} line - The line number where the issue was found.
* @property {boolean} valid - Whether the validation passed or failed.
* @property {string} message - A descriptive message about the issue.
 */

/**
 * @typedef {Issue[]} ListOfIssues
*/



const { parseHtmlDom } = require('./parseHtml')



/** @type {Issue} */
const issue = {
    issueType: '',
    validationType: '',
    line: 0,
    valid: true,
    message: ''
};


/**
 * Get line number in html
 * 
*/
function getLineNumberFromPosition(html, position) {
    const lines = html.substring(0, position).split("\n");
    return +lines.length;
}




/**
 * @type {Function} analizer
 * @param {object} html
 * @returns {Promise<object | null>} 
 * @returns {Error} 
*/
async function analizeDocument(html) {
    try {
        // DOM parsing
        const dom = await parseHtmlDom(html);
        if (dom === null) throw new Error("html parsing error, can't continue")


        const bugsList = [];
        const infosList = [];

        function pushResult(targetObject, errorMessage, lineNumber = 0){
            if (!targetObject) throw new Error(errorMessage);
            if (!targetObject.valid && targetObject.issueType === 'bug') bugsList.push({ ...targetObject, issueType: 'bug', validationType: targetObject.validationType, line: lineNumber })
            else if(targetObject.valid && targetObject.issueType === 'info') infosList.push({ ...targetObject, issueType: 'info', validationType: targetObject.validationType, line: lineNumber, message: targetObject.message });
        }





        function traverseNodes(nodes) {
            if (!Array.isArray(nodes)) nodes = [nodes];
            nodes.forEach(node => {
                // define line position of current line
                const nodePositionLine = getLineNumberFromPosition(html, node.startIndex);
                if (node?.type === 'tag') {
                    switch(node.name) {
                        case 'img':
                            // validationType: alts availability
                            const altsRes = {};
                            if(!altsRes) throw new Error('Error during alts validation');
                            if (!altsRes.valid) bugsList.push({ ...issue, issueType: 'bug', validationType: altsRes.validationType, line: lineNumber })
                            else messagesList.push({ ...issue, issueType: 'info', validationType: altsRes.validationType, line: lineNumber, message: res.message });
                            // validationType: src availability
                            const srcRes = {};
                            pushResult(srcRes, 'Error during src validation', lineNumber);



                           

                            break;
                        case 'a':
                            const linkContentRes = {};
                            pushResult(linkContentRes, 'Error during link content validation', lineNumber)
                            const linkHashPathRes = {};
                            pushResult(linkHashPathRes, 'Error during link content validation', lineNumber)
                            const linkHrefRes = {};
                            pushResult(linkHrefRes, 'Error during link content validation', lineNumber)
                            const linkLabelRes = {}; 
                            pushResult(linkLabelRes, 'Error during link content validation', lineNumber); 
                            if(linkLabelRes?.valid === true) pushResult({...linkLabelRes, issueType: 'info', message: node?.attribs?._label.trim()}, 'Error during link content validation', lineNumber)
                            break;
                    } 


                }
            })
        }








        traverseNodes(dom);
    } catch (err) { }
}







function checkLang(node) {
    if (!node) throw new Error("error, no node in checkIncorrectLang");
    if (node?.attrib && node?.attrib?.lang && node?.attrib?.lang.trim() !== "")
        return { issueType: 'info', validationType: 'lang validation', valid: true, message: node.attrib.lang };
    return { issueType: 'bug', validationType: 'lang validation', valid: false };
}


function checkMeta(node){
    if(!node) throw new Error("error, no node in checIncorrectkMeta");
    if(node?.attribs && node?.attribs?.content && node?.attribs?.content.includes('charset=utf-8'))
        return {issueType: 'bug', valid: true};
    return { issueType: 'bug', validationType: 'encoding type', valid: false };
}



// ---------------------------links validation overrides

/**
 * @typedef {Function} ValidationFunction
 * @returns {Issue} 
*/


/**
 * @type {ValidationFunction}
*/
function checkLinkContent(node) {
    if (!node) throw new Error('HTML pasring error');
    const emptyLink = !node.children.length || node.children.every(child => child.type === 'text' && !child.data.trim());
    return {...issue, issueType: 'bug', validationType: 'links content', valid: emptyLink};
}

function checkHrefPath(node){
    if (!node) throw new Error('HTML pasring error');
    if(node?.attribs && node?.attribs?.href){
        hasHrefPath = node?.attribs?.href.trim();
        return {...issue, issueType: 'bug', validationType: 'link href path', valid: hasHrefPath};
    }
    else return {...issue, issueType: 'bug', validationType: 'link href path', valid: false};;
}

function checkHashHref(node) {
    if (!node) throw new Error('HTML pasring error');
    const hasHashLink = node?.attribs && node?.attribs?.href === '#';
    return  {...issue, issueType: 'bug', validationType: '# in href path', valid: !hasHashLink};
}

function checkLabel(node){
    if (!node) throw new Error('HTML pasring error');
    if(node?.attribs && node?.attribs?._label){
        lableValue = node?.attribs?._label.trim();
        return  {...issue, issueType: 'bug', validationType: '_label validation', valid: lableValue};
    }
    return {...issue, issueType: 'bug', validationType: '_label validation', valid: false};
}

// module.exports = {checkHrefPath, checkHashHref, checkLabel, checkLinkContent}


// ---------------------------links validation overrides

