const issue = require('../config').issue;


/** 
 * @param {object} node
 * @returns {import('../config').Issue} issue object
*/
function checkImageSrc(node){
    if (!node) throw new Error('HTML pasring error');
    if(node?.attribs && node?.attribs?.src){
        const hasSrc = Boolean(node?.attribs?.src.trim());
        return {...issue, issueType: 'bug', validationType: 'src availability', valid: hasSrc};
    }
    else return {...issue, issueType: 'bug', validationType: 'src availability', valid: false};
}

 /** 
 * @param {object} node
 * @returns {import('../config').Issue} issue object
*/
function getImageSrc(node){
    if (!node) throw new Error('HTML pasring error');
    if(node?.attribs && node?.attribs?.src){
        const imageSrc = node?.attribs?.src.trim();
        return {...issue, issueType: 'info', validationType: 'src availability', valid: Boolean(imageSrc), message: hasSrc};
    }
    else return {...issue, issueType: 'info', validationType: 'src availability', valid: false};
}

 /** 
 * @param {object} node
 * @returns {import('../config').Issue} issue object
*/
function checkImageAls(node){
    if (!node) throw new Error('HTML pasring error');
    if(node?.attribs && node?.attribs?.alt){
        const hasAlt = Boolean(node?.attribs?.alt.trim());
        return {...issue, issueType: 'bug', validationType: 'alt availability', valid: hasAlt};
    }
    return {...issue, issueType: 'bug', validationType: 'alt availability', valid: false};
}

 /** 
 * @param {object} node
 * @returns {import('../config').Issue} issue object
*/
function getImageAls(node){
    if (!node) throw new Error('HTML pasring error');
    if(node?.attribs && node?.attribs?.alt){
        const imageAlt = node?.attribs?.alt.trim();
        return {...issue, issueType: 'info', validationType: 'alt availability', valid: Boolean(imageAlt), message: imageAlt};
    }
    return {...issue, issueType: 'info', validationType: 'alt availability', valid: false};
}

module.exports = {checkImageAls, checkImageSrc, getImageAls, getImageSrc};