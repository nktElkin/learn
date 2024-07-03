const issue = require('../config').issue;

 /** 
 * @param {object} node
 * @returns {import('../config').Issue} issue object
*/
function checkLinkContent(node) {
    if (!node) throw new Error('HTML pasring error');
    const hasBlankLinkContent = Boolean(!node.children.length || node.children.every(child => child.type === 'text' && !child.data.trim()));
    return { ...issue, issueType: 'bug', validationType: 'links content', valid: !hasBlankLinkContent };
}

 /** 
 * @param {object} node
 * @returns {import('../config').Issue} issue object
*/
function checkHrefPath(node) {
    if (!node) throw new Error('HTML pasring error');
    if (node?.attribs && node?.attribs?.href) {
        hasHrefPath = Boolean(node?.attribs?.href.trim());
        return { ...issue, issueType: 'bug', validationType: 'link href path', valid: hasHrefPath };
    }
    else return { ...issue, issueType: 'bug', validationType: 'link href path', valid: false };;
}

 /** 
 * @param {object} node
 * @returns {import('../config').Issue} issue object
*/
function checkHashHref(node) {
    if (!node) throw new Error('HTML pasring error');
    const hasHashLink = Boolean(node?.attribs && node?.attribs?.href === '#');
    return { ...issue, issueType: 'bug', validationType: '# in href path', valid: !hasHashLink };
}

 /** 
 * @param {object} node
 * @returns {import('../config').Issue} issue object
*/
function checkLinkLabel(node) {
    if (!node) throw new Error('HTML pasring error');
    if (node?.attribs && node?.attribs?._label) {
        const hasLinkLabel = Boolean(node?.attribs?._label.trim());
        return { ...issue, issueType: 'bug', validationType: '_label validation', valid: hasLabel };
    }
    return { ...issue, issueType: 'bug', validationType: '_label validation', valid: false };
}

 /** 
 * @param {object} node
 * @returns {import('../config').Issue} issue object
*/
function getLinkLabel(node) {
    if (!node) throw new Error('HTML pasring error');
    if (node?.attribs && node?.attribs?._label) {
        const linkLabel = node?.attribs?._label.trim();
        return { ...issue, issueType: 'info', validationType: '_label validation', valid: Boolean(linkLabel), message: linkLabel };
    }
    return { ...issue, issueType: 'info', validationType: '_label validation', valid: false };
}

module.exports = {checkHrefPath, checkHashHref, checkLinkContent , checkLinkLabel, getLinkLabel};