const regex1 =  new RegExp("<%=([^>]*)<%");
const regex2 =  new RegExp ("%[0-9].*");
const regex3 = new RegExp("&(?!nbsp;)[a-zA-Z]+;");

function checkRegexPattern(node){
    if(node.type === 'text' && node?.data){
        if (regex1.test(node.data)) {
            return { pattern: '<%=([^>]*)<%', content: node.data };
        }
        if (regex2.test(node.data)) {
            return { pattern: '%[0-9].*', content: node.data };
        }
        if (regex3.test(node.data)) {
            return { pattern: '&(?!nbsp;)[a-zA-Z]+;', content: node.data };
        }
        else return null;
    }
}

module.exports = {checkRegexPattern};


