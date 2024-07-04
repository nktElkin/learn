// imports
const {checkImageAls, checkImageSrc, getImageAls, getImageSrc} = require('./Tests_V2/imageValidation');
const {checkHrefPath, checkHashHref, checkLinkContent , checkLinkLabel, getLinkLabel} = require('./Tests_V2/linkValidation');
const {checkTableRole} = require('./Tests_V2/tableValidation');
const {checkRegexPatternToArray} = require('./Tests_V2/regexValidation');
const {getLang, checkMeta} = require('./Tests_V2/headValidation');
const issue = require('./config.js').issue
const {logIssue} = require('./InputOutput_V2/complectReport.js');
const {checkSrc} = require('./Tests_V2/readSource.js');

const { parseHtmlDom } = require('./InputOutput/parseHtmlDom.js');
const fs = require('fs');

/**
 * @typedef {Function} ValidationFunction
 * 
 * @param {object} node - json object of html node
 * @returns {Issue}
 * @throws {Error} err in case node wasn't passed
 */


/**
 * Get line number in html
 * 
 * @param {string} html - markup
 * @param {number} position - start index of node
 * @returns {number} line position od node
 * 
*/
function getLineNumberFromPosition(html, position) {
    const lines = html.substring(0, position).split("\n");
    return +lines.length;
}

/**
 * @async
 * @function
 * @param {object} html
 * @returns {Promise<Array<import('./config').Issue>>} bugsList, infosList
 * @returns {Error}
*/
async function analizeDocument(html) {
    try {
        // DOM parsing
        const dom = await parseHtmlDom(html);
        if (dom === null) throw new Error("html parsing error, can't continue")

        /**
         * @type {Array<import('./config.js').Issue>}
         */
        const bugsList = [];
        /**
         * @type {Array<import('./config.js').Issue>}
         */
        const infosList = [];

        
        /**
         * Pushes the result of a validation into the appropriate list based on its type.
         * 
         * @param {Issue} targetObject - The target object containing validation information.
         * @param {string} errorMessage - The error message to be thrown if the targetObject is invalid.
         * @param {number} [lineNumber=0] - The line number where the validation issue was found.
         * @throws {Error} Throws an error with the provided error message if targetObject is falsy.
         */
        function pushResult(targetObject, errorMessage = 'Error during validation', lineNumber = 0) {
            if (!targetObject) throw new Error(errorMessage);
            // issueType === 'bug' && valid: false => push to bugsList
            if (!targetObject.valid && targetObject.issueType === 'bug') bugsList.push({ ...targetObject, issueType: 'bug', validationType: targetObject.validationType, line: lineNumber})
                // issueType === 'unfo' && valid: true => push to infosList
            else if (targetObject.valid && targetObject.issueType === 'info') infosList.push({ ...targetObject, issueType: 'info', validationType: targetObject.validationType, line: lineNumber, message: targetObject.message });
        }
        

        // validationType: src reading

    
        const {markupIssue, imagesIssue} = await checkSrc();
        if(imagesIssue) pushResult(imagesIssue);
      
        

        function traverseNodes(nodes) {
            if (!Array.isArray(nodes)) nodes = [nodes];
            nodes.forEach(node => {
                // calculate line position of current line
                const lineNumber = getLineNumberFromPosition(html, node.startIndex);
                // node type: tag
                if (node?.type === 'tag') {
                    switch (node.name) {
                        case 'img':
                            // invoke:
                            if(node?.attribs?.id !== '_two50_img'){
                                // validationType: 'alt availability'
                                const imageAltRes = checkImageAls(node);
                                pushResult(imageAltRes, 'Error during image alt validation', lineNumber);
                                if(imageAltRes.valid === true){
                                    const imageAlt = getImageAls(node);
                                    pushResult(imageAlt, 'Error during image alt validation', lineNumber);
                                }
                                
                                // validationType: 'src availability'
                                const imageSrcRes = checkImageSrc(node);
                                pushResult(imageSrcRes, 'Error during image src validation', lineNumber);
                                if(imageSrcRes.valid === true){
                                    const imagaSrc = getImageSrc(node);
                                    pushResult(imagaSrc, 'Error during image src validation', lineNumber);
                                }
                            }

                            // validationType: _two50
                            if(node?.attribs?.id && node?.attribs?.width === '1' && node?.attribs?.height === '1'){
                                const hasTargetId = node?.attribs?.id === '_two50_img';
                                pushResult({...issue,
                                    issueType: hasTargetId ? 'info' : 'bug', valid: hasTargetId, validationType: '_two50',
                                    message: !hasTargetId ? 'no _two50_img id in img' : `<img> tag`},
                                    'Error during special class validation', lineNumber);
                            }
                            break;
                            // {, getLinkLabel}
                        case 'a':
                            // validationType: link content
                            const linkContentRes = checkLinkContent(node);
                            pushResult(linkContentRes, 'Error during link content validation', lineNumber)

                            // validationType: # in href path
                            const linkHashPathRes = checkHashHref(node);
                            pushResult(linkHashPathRes, 'Error during link href validation', lineNumber)

                            // validationType: link href path
                            const linkHrefRes = checkHrefPath(node);
                            pushResult(linkHrefRes, 'Error during link href validation', lineNumber)

                            // validationType: _label validation
                            const linkLabelRes = checkLinkLabel(node);
                            pushResult(linkLabelRes, 'Error during link label validation', lineNumber);
                            if (linkLabelRes?.valid === true){
                                const linkLabel = getLinkLabel(node);
                                pushResult(linkLabel, 'Error during link label validation', lineNumber); 
                            }
                            break;
                        case 'table':
                            // validationType: table role validation
                            const tableRoleRes = checkTableRole(node);
                            // console.log(tableRoleRes.issueType, tableRoleRes.validationType, tableRoleRes.valid  )
                            pushResult(tableRoleRes, 'Error during table role validation', lineNumber);
                            break;    
                        case 'html':
                            // validationType: lang validation
                            const langRes = getLang(node);
                            pushResult(langRes,'Error during lang validation', lineNumber);
                            break;
                        case 'meta':
                            // validationType: encoding type
                            if(!node.attribs.hasOwnProperty('name')){
                                const metaRes = checkMeta(node);
                                pushResult(metaRes,'Error during encoding type validation', lineNumber);
                            }
                            break;
                        case 'div':
                            // validationType: _two50
                            if(node?.attribs){
                                const hasTargetId = node?.attribs?.id === '_two50';
                                pushResult({...issue,
                                    issueType: hasTargetId ? 'info' : 'bug', valid: hasTargetId, validationType: '_two50',
                                    message: !hasTargetId ? 'no _two50 id in div' : `<div> tag`},
                                    'Error during special class validation', lineNumber);
                            }
                            break;
                        case 'td':
                             // validationType: preheader validation
                            if(node?.attribs?.style){
                                const displayNone = node?.attribs?.style.includes('display:none');
                                // const zeroFontSize = node?.attribs?.style.includes('font-size:0');
                                // const zeroLineHeight = node?.attribs?.style.includes('line-height:0');
                                if(displayNone){
                                    const innerContent = node?.children[0]?.data.replace('\n', ' ').replace('\r', ' ').trim();
                                    const hasContent = Boolean(innerContent);
                                    pushResult({...issue,
                                        issueType: hasContent ? 'info' : 'bug', valid: hasContent, validationType: 'preheader validation',
                                        message: !hasContent ? 'not provided' : innerContent},
                                        'Error during preheader validation', lineNumber);   
                                }
                            }
                            break;
                    }
                }

                // node type: style
                if(node?.type === 'style'){
                    if (node?.children) {
                        // validationType: hover validation
                        const hasHoverClass = node?.children[0].data.includes(':hover');
                        pushResult({...issue,
                            issueType: 'bug', valid: !hasHoverClass, validationType: 'hover validation'},
                            'Error during hover pseudo-class validation', lineNumber);
                        
                        
                        // validationType: style #_two50
                        if(Object.keys(node?.attribs).length === 0){
                            const hasSpecialStile = node?.children[0].data.includes('#_two50');
                            let matches;
                            if(hasSpecialStile) matches = node?.children[0].data.split('#_two50').length - 1;
                            // if has -> issueType: info, else issueType: bug 
                            pushResult({...issue,
                                issueType: hasSpecialStile ? 'info' : 'bug', valid: hasSpecialStile, validationType: '_two50',
                                message: !hasSpecialStile ? 'no #_two50 in style' : `${matches} ${matches > 1 ? 'times': 'time'} <style> tag`},
                                'Error during special class validation', lineNumber);
                        }
                    }
                }

                // node type: text
                if(node?.type === 'text' && node?.data){
                    try {
                        // validationType: regEx validation
                        const regexPatternRes = checkRegexPatternToArray(node);
                        if(regexPatternRes?.length){
                            regexPatternRes.forEach(res => pushResult(res, 'Error during regEx validation', lineNumber));
                        }
                    } catch (error) {
                        console.log(error)
                    }
                }


                // recursion
                if (node.children && node.children.length) {
                    traverseNodes(node.children);
                }
            })
        }


        traverseNodes(dom);
        // console.log(bugsList, infosList);
        return {bugsList, infosList};
    } catch (err) {
        console.error(err);
    }
}




// read cmd
const cmdRequest = process.argv;
if(!cmdRequest[2]){
    console.error("path to markup file wasn't provided");
    process.exit(1);

} 
const markupFile = process.argv[2];


const getReport = async (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }
    try {
        const {bugsList, infosList} = await analizeDocument(data)

        logIssue(bugsList, 'bug');
        logIssue(infosList, 'info');


    } catch (error) {
        console.error("💣 error during the process", error);
        process.exit(1);
    }
} 


fs.readFile(markupFile, 'utf8', (err, data) => getReport(err, data));






















