// imports
const {checkImageAls, checkImageSrc, getImageAls, getImageSrc} = require('./Tests_V2/imageValidation');
const {checkHrefPath, checkHashHref, checkLinkContent , checkLinkLabel, getLinkLabel} = require('./Tests_V2/linkValidation');
const {checkTableRole} = require('./Tests_V2/tableValidation');
const {checkRegexPatternToArray} = require('./Tests_V2/regexValidation');
const {getLang, checkMeta} = require('./Tests_V2/headValidation');




/**
 * @typedef {Array<Issue>} ListOfIssues
*/



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
                                if(imageAltRes.valid === 'true'){
                                    const imageAlt = getImageAls(node);
                                    pushResult(imageAlt, 'Error during image alt validation', lineNumber);
                                }
                                
                                // validationType: 'src availability'
                                const imageSrcRes = checkImageSrc(node);
                                pushResult(imageSrcRes, 'Error during image src validation', lineNumber);
                                if(imageSrcRes.valid === 'true'){
                                    const imagaSrc = getImageSrc(node);
                                    pushResult(imagaSrc, 'Error during image src validation', lineNumber);
                                }
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
                            pushResult(tableRoleRes, 'Error during image alt validation', lineNumber);
                            break;    
                        case 'html':
                            // validationType: lang validation
                            const langRes = getLang(node);
                            pushResult(langRes,'Error during lang validation', lineNumber);
                            break;
                        case 'meta':
                            // validationType: encoding type
                            const metaRes = checkMeta(node);
                            pushResult(metaRes,'Error during encoding type validation', lineNumber);
                            break;
                    }
                }

                // node type: style
                if(node?.type === 'style'){
                    if (node?.attribs?.data) {
                        // validationType: hover validation
                        const hasHoverClass = node?.attribs?.data.includes(':hover')
                        pushResult({...issue,
                            issueType: 'bug', valid: !hasHoverClass, validationType: 'hover validation'},
                            'Error during hover pseudo-class validation', lineNumber);
                        
                        // validationType: style #_two50
                        const specialStyle = node?.attribs?.data.includes('#_two50');
                        const hasSpecialStile = Boolean(specialStyle);
                        // if has -> issueType: info, else issueType: bug 
                        pushResult({...issue,
                            issueType: hasSpecialStile ? 'info' : 'bug', valid: hasSpecialStile, validationType: 'style #_two50',
                            message: !hasSpecialStyle ? specialStyle : ''},
                            'Error during special class validation', lineNumber);
                    }
                }

                // node type: text
                if(node?.type === 'text' && node?.data){
                    // validationType: regEx validation
                    const regexPatternRes = checkRegexPatternToArray(node);
                    if(regexPatternRes.length){
                        regexPatternRes.forEach(res => pushResult(res, 'Error during regEx validation', lineNumber));
                    }
                }
            })
        }


        traverseNodes(dom);
    } catch (err) {
        console.error(err);
    }
}






















