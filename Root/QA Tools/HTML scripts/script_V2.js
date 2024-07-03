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
 * @typedef {Array<Issue>} ListOfIssues
*/

/** @type {Issue} */
const issue = {
    issueType: '',
    validationType: '',
    line: 0,
    valid: true,
    message: ''
};


/**
 * @typedef {Function} ValidationFunction
 * 
 * @param {object} node - json object of html node
 * @returns {Issue}
 * @throws {Error} err in case node wasn't passed
 */



const { parseHtmlDom } = require('./parseHtml')





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

        /**
         * @type {ListOfIssues}
         */
        const bugsList = [];
        /**
         * @type {ListOfIssues}
         */
        const infosList = [];



        /**
         * @typedef {Function} pushResult
         * Pushes the result of a validation into the appropriate list based on its type.
         * 
         * @param {Issue} targetObject - The target object containing validation information.
         * @param {string} errorMessage - The error message to be thrown if the targetObject is invalid.
         * @param {number} [lineNumber=0] - The line number where the validation issue was found.
         * @throws {Error} Throws an error with the provided error message if targetObject is falsy.
         */
        function pushResult(targetObject, errorMessage, lineNumber = 0) {
            if (!targetObject) throw new Error(errorMessage);
            // issueType === 'bug' && valid: false => push to bugsList
            if (!targetObject.valid && targetObject.issueType === 'bug') bugsList.push({ ...targetObject, issueType: 'bug', validationType: targetObject.validationType, line: lineNumber})
            // issueType === 'unfo' && valid: true => push to infosList
            else if (targetObject.valid && targetObject.issueType === 'info') infosList.push({ ...targetObject, issueType: 'info', validationType: targetObject.validationType, line: lineNumber, message: targetObject.message });
        }





        function traverseNodes(nodes) {
            if (!Array.isArray(nodes)) nodes = [nodes];
            nodes.forEach(node => {
                // define line position of current line
                const nodePositionLine = getLineNumberFromPosition(html, node.startIndex);
                if (node?.type === 'tag') {
                    switch (node.name) {
                        case 'img':
                            // validationType: alts availability
                            const altsRes = {};
                            if (!altsRes) throw new Error('Error during alts validation');
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
                            if (linkLabelRes?.valid === true) pushResult({ ...linkLabelRes, issueType: 'info', message: node?.attribs?._label.trim() }, 'Error during link content validation', lineNumber)
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


function checkMeta(node) {
    if (!node) throw new Error("error, no node in checIncorrectkMeta");
    if (node?.attribs && node?.attribs?.content && node?.attribs?.content.includes('charset=utf-8'))
        return { issueType: 'bug', valid: true };
    return { issueType: 'bug', validationType: 'encoding type', valid: false };
}



// ---------------------------links validation overrides


/**
 * @type {ValidationFunction}
*/
function checkLinkContent(node) {
    if (!node) throw new Error('HTML pasring error');
    const hasBlankLinkContent = Boolean(!node.children.length || node.children.every(child => child.type === 'text' && !child.data.trim()));
    return { ...issue, issueType: 'bug', validationType: 'links content', valid: !hasBlankLinkContent };
}

function checkHrefPath(node) {
    if (!node) throw new Error('HTML pasring error');
    if (node?.attribs && node?.attribs?.href) {
        hasHrefPath = Boolean(node?.attribs?.href.trim());
        return { ...issue, issueType: 'bug', validationType: 'link href path', valid: hasHrefPath };
    }
    else return { ...issue, issueType: 'bug', validationType: 'link href path', valid: false };;
}

function checkHashHref(node) {
    if (!node) throw new Error('HTML pasring error');
    const hasHashLink = Boolean(node?.attribs && node?.attribs?.href === '#');
    return { ...issue, issueType: 'bug', validationType: '# in href path', valid: !hasHashLink };
}

function checkLinkLabel(node) {
    if (!node) throw new Error('HTML pasring error');
    if (node?.attribs && node?.attribs?._label) {
        const hasLinkLabel = Boolean(node?.attribs?._label.trim());
        return { ...issue, issueType: 'bug', validationType: '_label validation', valid: hasLabel };
    }
    return { ...issue, issueType: 'bug', validationType: '_label validation', valid: false };
}

function getLinkLabel(node) {
    if (!node) throw new Error('HTML pasring error');
    if (node?.attribs && node?.attribs?._label) {
        const linkLabel = node?.attribs?._label.trim();
        return { ...issue, issueType: 'info', validationType: '_label validation', valid: Boolean(linkLabel), message: linkLabel };
    }
    return { ...issue, issueType: 'info', validationType: '_label validation', valid: false };
}

// module.exports = {checkHrefPath, checkHashHref, checkLinkContent , checkLinkLabel, getLinkLabel}


// ---------------------------style validation overrides

// case 'style'"

if (node?.attribs?.data) {
    // validationType: hover validation
    const hasHoverClass = node?.attribs?.data.includes(':hover')
    pushResult({...issue, issueType: 'bug', valid: !hasHoverClass, validationType: 'hover validation'},'error during hover pseudo-class validation', lineNumber);
    
    // validationType: style #_two50
    const specialStyle = node?.attribs?.data.includes('#_two50');
    const hasSpecialStile = Boolean(specialStyle);
    pushResult({...issue, issueType: hasSpecialStile ? 'info' : 'bug', valid: hasSpecialStile, validationType: 'style #_two50', message: !hasSpecialStyle ? specialStyle : ''},'error during special class validation', lineNumber);
}

// ---------------------------images validation overrides

// const issue = require();

/** 
 * @type {ValidationFunction} 
 * @param {object} node
 * @returns {Issue} issue object
*/
function checkImageSrc(node){
    if (!node) throw new Error('HTML pasring error');
    if(node?.attribs && node?.attribs?.src){
        const hasSrc = Boolean(node?.attribs?.src.trim());
        return {...issue, issueType: 'bug', validationType: 'src availability', valid: hasSrc};
    }
    else return {...issue, issueType: 'bug', validationType: 'src availability', valid: false};
}

function getImageSrc(node){
    if (!node) throw new Error('HTML pasring error');
    if(node?.attribs && node?.attribs?.src){
        const imageSrc = node?.attribs?.src.trim();
        return {...issue, issueType: 'info', validationType: 'src availability', valid: Boolean(imageSrc), message: hasSrc};
    }
    else return {...issue, issueType: 'info', validationType: 'src availability', valid: false};
}


/**@type {ValidationFunction} */
function checkImageAls(node){
    if (!node) throw new Error('HTML pasring error');
    if(node?.attribs && node?.attribs?.alt){
        const hasAlt = Boolean(node?.attribs?.alt.trim());
        return {...issue, issueType: 'bug', validationType: 'alt availability', valid: hasAlt};
    }
    return {...issue, issueType: 'bug', validationType: 'alt availability', valid: false};
}

function getImageAls(node){
    if (!node) throw new Error('HTML pasring error');
    if(node?.attribs && node?.attribs?.alt){
        const imageAlt = node?.attribs?.alt.trim();
        return {...issue, issueType: 'info', validationType: 'alt availability', valid: Boolean(imageAlt), message: imageAlt};
    }
    return {...issue, issueType: 'info', validationType: 'alt availability', valid: false};
}

// module.exports = {checkImageAls, checkImageSrc, getImageAls, getImageSrc};

// invoke:
if(node?.attribs?.id !== '_two50_img'){
    const imageAltRes = checkImageAls(node);
    pushResult(imageAltRes, 'Error during image alt validation', lineNumber);
    if(imageAltRes.valid === 'true'){
        const imageAltRes = getImageAls(node);
        pushResult(imageAltRes, 'Error during image alt validation', lineNumber);
    }
    
    const imageSrcRes = checkImageSrc(node);
    pushResult(imageSrcRes, 'Error during image src validation', lineNumber);
    if(imageSrcRes.valid === 'true'){
        const imagSrcRes = getImageSrc(node);
        pushResult(imagSrcRes, 'Error during image src validation', lineNumber);
    }
}


// ---------------------------table validation overrides

function checkTableRole(node) {
    if (!node) throw new Error('HTML pasring error');
    
    if(node?.children &&  node?.children.every(child => child.type === 'text' && child.data.trim() !== "")){
        const hasRole = Boolean(node.attribs && node.attribs.role === 'presentation');
        return {...issue, issueType: 'bug', validationType: 'table role validation', valid: hasRole};
    }
    return {...issue, issueType: 'bug', valid: true};  
}
// module.exports = {checkTableRole};

//invoke:
const tableRoleRes = checkTableRole(node);
pushResult(tableRoleRes, 'Error during image alt validation', lineNumber);


// ---------------------------regEx validation overrides

const regExs = ["<%=([^>]*)<%", "%[0-9].*"]; // test regExs
const regExIssues = []; // acc of found issues

function checkRegexPatternToArray(node){
    if (!node) throw new Error('HTML pasring error');
    if(node.type === 'text' && node?.data){
        regExs.forEach(ex => {
            if (ex.test(node.data)) regExIssues.push({...issue, issueType: 'bug', validationType: 'regEx validation', valid: false, message: `${ex} : ${node.data}`});
        })
    }
}

// module.exports = {checkRegexPatternToArray};

//invoke:
const regexPatternRes = checkRegexPatternToArray(node);
if(regexPatternRes.length){
    regexPatternRes.forEach(res => pushResult(res, 'Error during regEx validation', lineNumber));
}



