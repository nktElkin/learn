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


/**
Parses an HTML string into a DOM-like structure using htmlparser2.
 *
@param {string} html - The HTML string to be parsed.
@returns {Promise<Object|null>} A promise that resolves to the parsed DOM object or null if parsing fails.
@throws {Error} If there is an error during parsing.
 */
async function parseHtmlDom(html) {
    try {
        if (!html) return null;
        const dom = parseDocument(html, options);
        return dom;
    } catch (err) {
        console.error(err);
        return null;
    }
}


module.exports = { parseHtmlDom };