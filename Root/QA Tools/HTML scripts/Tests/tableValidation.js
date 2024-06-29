function checkIsRoleTable(node) {
    if (!node) throw new Error('HTML pasring error');
    const hasRole = node.attribs && node.attribs.role === 'presentation';
    return hasRole;
}
module.exports = {checkIsRoleTable};
