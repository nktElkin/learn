/**
 * Validate if meta is correct
 *
 * @returns true - correct
 * @returns false - incorrect
 * 
 * @param object json node (html dom node)
 */
function checkMeta(node){
    if(!node) throw new Error("error, no node in checIncorrectkMeta");
    if(node?.attrib && node?.attrib?.content && node?.attrib?.content.trim() === "text/html; charset=utf-8")
        return true;
    return false;
}


/**
 * Validate if set lang in html head
 *
 * @returns value of attribute lang - was set, correct
 * @returns false - not found, is incorrect
 * 
 * @param object json node (html dom node)
 */

function checkLang(node){
    if(!node) throw new Error("error, no node in checkIncorrectLang");
    if(node?.attrib && node?.attrib?.lang && node?.attrib?.lang.trim() !== "")
        return node.attrib.lang;
    return false;
}

method.exports = {checkMeta, checkLang};