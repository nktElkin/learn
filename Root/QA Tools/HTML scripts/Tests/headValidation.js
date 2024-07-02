/**
 * Validate if meta is correct
 *
 * @returns {boolean} true - correct
 * @returns {boolean} false - incorrect
 * 
 * @param {object} node - json object (html dom node)
 */
function checkMeta(node){
    if(!node) throw new Error("error, no node in checIncorrectkMeta");
    if(node?.attribs && node?.attribs?.content && node?.attribs?.content.includes('charset=utf-8'))
        return true;
    return false;
}


/**
 * Validate if set lang in html head
 * 
 * @param {object} node - json object (html dom node)
 * 
 * @returns {string} value of attribute lang - was set, correct
 * @returns {boolean} false - incorrect
 * 
 */

function checkLang(node){
    if(!node) throw new Error("error, no node in checkIncorrectLang");
    if(node?.attribs && node?.attribs?.lang && node?.attribs?.lang.trim() !== "")
        return node.attribs.lang;
    return false;
}

module.exports = {checkMeta, checkLang};