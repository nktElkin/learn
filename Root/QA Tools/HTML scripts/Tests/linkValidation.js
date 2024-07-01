function checkIsEmptyLinks(node) {
    if (!node) throw new Error('HTML pasring error');
    const emptyLink = !node.children.length || node.children.every(child => child.type === 'text' && !child.data.trim());
    return emptyLink;
}

function checkIsEmptyPath(node){
    if (!node) throw new Error('HTML pasring error');
    if(node?.attribs && node?.attribs?.href){
        isEmptyPath = !node?.attribs?.href.trim();
        return isEmptyPath;
    }
    else return true;
}
function checkIsHashHref(node) {
    if (!node) throw new Error('HTML pasring error');
    const hashLink = node?.attribs && node?.attribs?.href === '#';
    return hashLink;
}

function checkIncorrectLabel(node){
    if (!node) throw new Error('HTML pasring error');
    if(node?.attribs && node?.attribs?._label){
        lableValue = node?.attribs?._label.trim();
        if(!lableValue) return true
        return lableValue;
    }
    return true;
}

module.exports = {checkIsHashHref, checkIsEmptyLinks, checkIsEmptyPath, checkIncorrectLabel};
