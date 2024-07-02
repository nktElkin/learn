/**
Represents an issue found during validation.
@typedef {Object} Issue
@property {string} issueType - The type of issue ('bug', 'info').
@property {string} validationType - The type of validation that was performed.
@property {number} line - The line number where the issue was found.
@property {boolean} valid - Whether the validation passed or failed.
@property {string} message - A descriptive message about the issue.
 */

const {parseHtmlDom} = require('./parseHtml')



/** @type {Issue} */
const issue = {
    issueType: '',
    validationType: '',
    line: 0,
    valid: true,
    message: ''
};


/**
 * Get line number in html
 * 
*/
function getLineNumberFromPosition(html, position) {
    const lines = html.substring(0, position).split("\n");
    return +lines.length;
}





async function analizeDocument(html){
    try{
        // DOM parsing
        const dom = await parseHtmlDom(html);
        if(dom === null) throw new Error("html parsing error, can't continue")

        const bugsList = [];
        const infosList = [];

        

    
    
        function traverseNodes(nodes) {
            if(!Array.isArray(nodes)) nodes = [nodes];
            nodes.forEach(node => {
                const nodePositionLine = getLineNumberFromPosition(html, node.startIndex);
                switch(node.type){
                    case 'tag':
                        {

                        }
                    break;
                }
            })
        }








        traverseNodes(dom);
    }catch(err){}
}







function checkLang(node){
    if(!node) throw new Error("error, no node in checkIncorrectLang");
    if(node?.attrib && node?.attrib?.lang && node?.attrib?.lang.trim() !== "")
        return {validationType:'lang', valid: true, message: node.attrib.lang};
    return {validationType:'lang', valid: false};
}


function checkMeta(node){
    if(!node) throw new Error("error, no node in checIncorrectkMeta");
    if(node?.attrib && node?.attrib?.content && node?.attrib?.content.trim() === "text/html; charset=utf-8")
        return {type:'encoding type', valid: true};
    return {type:'encoding type', valid: false};
}


//later:

    const lineNumber = getNodeLine();

    const res = checkLang(node); //false if incorrect
    if(!res.valid) bugsList.push({...issue, issueType: 'bug', validationType: res.validationType, line: lineNumber})
    else messagesList.push({...issue, issueType: 'message', validationType: res.validationType, line: lineNumber, message: res.message});
    
   

