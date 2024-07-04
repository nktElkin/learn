const issue = require('../config').issue;
const regExs = require('../config').regExs // test regExs

const regExIssues = []; // acc of found issues

 /** 
 * @param {object} node
 * @returns {Array<import('../config').Issue>} issue object
*/
function checkRegexPatternToArray(node){
    try {
        if(!regExs) return;
        if (!node) throw new Error('HTML pasring error - regexValidation');
        if(node.type === 'text' && node?.data){
            regExs.forEach(ex => {
                const regEx = RegExp(ex);
                if (regEx.test(node.data)) regExIssues.push({...issue, issueType: 'bug', validationType: 'regEx validation', valid: false, message: `${ex} : ${node.data}`});
            })
        }
        return regExIssues;
    } catch (error) {
        console.error(error);
    }
}

module.exports = {checkRegexPatternToArray};