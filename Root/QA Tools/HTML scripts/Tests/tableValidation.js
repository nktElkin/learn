
/**
 * Validate if table with text has role 'presentation' 
 * 
 * @param {object}    - json node of html markup in json format
 * 
 * @returns {boolean} true if is correct
 * @returns {boolean} false if no role/role is not 'presentation'
 */
function checkIsRoleTable(node) {
    if (!node) throw new Error('HTML pasring error');
    // console.log(node?.children.type === 'text')
    if(node?.children &&  node.children[0].type === 'text' && node.children[0].data.trim() !== ""){
        const hasRole = node?.attribs && node?.attribs?.role === 'presentation' // true if correct
        return hasRole;
    }
    return false;  
}
module.exports = {checkIsRoleTable};
