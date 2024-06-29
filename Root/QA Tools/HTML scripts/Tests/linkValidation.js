function checkIsEmptyLinks(node) {
    if (!node) throw new Error('HTML pasring error');
    const emptyLink = !node.children.length || node.children.every(child => child.type === 'text' && !child.data.trim());
    return emptyLink;
}

function checkIsHashHref(node) {
    if (!node) throw new Error('HTML pasring error');
    const hashLink = node.attribs && node.attribs.href === '#';
    return hashLink;
}
module.exports = {checkIsHashHref, checkIsEmptyLinks};
