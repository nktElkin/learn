
/**
 * Validate if table with text has role 'presentation' 
 * 
 * @param object - node of html markup in json format
 * 
 * @returns true if is correct
 * @returns false if no role/role is not 'presentation'
 */
function checkIsRoleTable(node) {
    if (!node) throw new Error('HTML pasring error');
    if(node?.children &&  node.children.every(child => child.type === 'text' && child.data.trim() !== "")){
        const hasRole = node?.attribs && node?.attribs?.role === 'presentation' // true if correct
        return hasRole;
    }
    return false;  
}
module.exports = {checkIsRoleTable};
