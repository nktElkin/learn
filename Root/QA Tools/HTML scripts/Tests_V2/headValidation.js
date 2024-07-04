const issue = require('../config').issue;

 /** 
 * @param {object} node
 * @returns {import('../config').Issue} issue object
*/
function getLang(node) {
    if (!node) throw new Error("error, no node in checkIncorrectLang");
    if (node?.attribs && node?.attribs?.lang && node?.attribs?.lang.trim() !== "" && typeof node?.attribs?.lang === 'string')
        return {...issue, issueType: 'info', validationType: 'lang validation', valid: true, message: node.attribs.lang };
    return {...issue, issueType: 'bug', validationType: 'lang validation', valid: false };
}

 /** 
 * @param {object} node
 * @returns {import('../config').Issue} issue object
*/
function checkMeta(node) {
    if (!node) throw new Error("error, no node in checIncorrectkMeta");
    if (node?.attribs && node?.attribs?.content && node?.attribs?.content.includes('charset=utf-8'))
        return {...issue, issueType: 'bug', valid: true };
    return {...issue, issueType: 'bug', validationType: 'encoding type', valid: false };
}

module.exports = {getLang, checkMeta};