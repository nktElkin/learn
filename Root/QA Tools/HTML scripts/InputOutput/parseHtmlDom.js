const { parseDocument } = require("htmlparser2");


// Parse options
const options = {
    xmlMode: false,
    decodeEntities: true,
    lowerCaseTags: true,
    lowerCaseAttributeNames: true,
    recognizeSelfClosing: true,
    recognizeCDATA: false,
    sourceCodeLocationInfo: true,
    withStartIndices: true
};


async function parseHtmlDom(html){
    try{
        if(!html) return null;
        const dom  = parseDocument(html, options);
        return dom;
    }catch(err){
        console.error(err);
        return null;
    }
}

module.exports = {parseHtmlDom};