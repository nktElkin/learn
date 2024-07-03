const issue = require('../config').issue;


/**
 * @param {object} node 
 * @returns {import('../config').Issue} 
 */
function checkTableRole(node) {
    if (!node) throw new Error('HTML pasring error');
    
    if(node?.children &&  node?.children.every(child => child.type === 'text' && child.data.trim() !== "")){
        const hasRole = Boolean(node.attribs && node.attribs.role === 'presentation');
        return {...issue, issueType: 'bug', validationType: 'table role validation', valid: hasRole};
    }
    return {...issue, issueType: 'bug', valid: true};  
}

module.exports = {checkTableRole};