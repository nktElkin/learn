
function checkIsEmptySrc(node){
    if (!node) throw new Error('HTML pasring error');
    if(node?.attribs && node?.attribs?.src){
        isEmptyPath = !node?.attribs?.href.trim();
        return isEmptyPath;
    }
    else return true;
}

function checkIncorrectAlt(node){
    if (!node) throw new Error('HTML pasring error');
    if(node?.attribs && node?.attribs?.alt){
        lableValue = node?.attribs?.alt.trim();
        if(!lableValue) return true
        return lableValue;
    }
    return true;
}

module.exports = {checkIncorrectAlt, checkIsEmptySrc}