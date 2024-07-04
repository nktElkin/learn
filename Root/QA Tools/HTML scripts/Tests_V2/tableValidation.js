const issue = require('../config').issue;


/**
 * Check is tabel node has role 'presentation'
 * @param {object} node 
 * @returns {import('../config').Issue} 
 */
function checkTableRole(node) {
    if (!node) throw new Error('HTML pasring error');
    const hasRolePressentation = node?.attribs && node?.attribs?.role === 'presentation';
    return {...issue, issueType: 'bug', valid: hasRolePressentation, validationType: 'table role validation'};  



    // node?.children.forEach(trChild => {
    //     trChild?.children.forEach(tdChild => {
    //         const hasContent = tdChild?.children.type === 'text' && tdChild?.children.data.trim() !== ""'
    //     })
    // })


    // if(node?.children &&  node?.children.every(child => child.type === 'text' && child.data.trim() !== "")){
    //     const hasRole = Boolean(node.attribs && node.attribs.role === 'presentation');
    //     return {...issue, issueType: 'bug', validationType: 'table role validation', valid: hasRole};
    // }
    // return {...issue, issueType: 'bug', valid: true, validationType: 'table role validation'};  
}

module.exports = {checkTableRole};