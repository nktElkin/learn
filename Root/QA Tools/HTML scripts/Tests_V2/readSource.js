const fs = require('fs');
const path = require('path');
const issue = require('../config').issue;



//TODO:
// take from cmd like an argument
const srcDirName = './src';

const errorSnippet = (message) => {
    return  `💣 Error - ${message}`
} ;

const readHtml = async () => {
    try {
        const docsInFolder = await fs.promises.readdir(srcDirName);
        const htmlFile = docsInFolder.find((el) => el.endsWith(".html"));
        if (!htmlFile) return null;
        const filePath = path.join(srcDirName, htmlFile);
        return await fs.promises.readFile(filePath, "utf8");
    } catch (error) {
        console.error(errorSnippet('reading html'), error);
        return null;
    }
};

const readImages = async () => {
    try {
        const directoryPath = `${srcDirName}/images`;
        const dirExist = await fs.promises.lstat(directoryPath);
        if (!dirExist.isDirectory()) return null;
        
        const files = await fs.promises.readdir(directoryPath);
        const imagesList = [];
        files.forEach(element => {
            imagesList.push(element);
        });
        // const imagesList = files.filter(file => !fs.promises.lstat(path.join(directoryPath, file)).isDirectory());
        
        if (imagesList.length === 0) return null;
        
        return imagesList;
    } catch (error) {
        console.error(errorSnippet('reding images folder'), error);
        return null;
    }
};


/**
 * Read html and images folder from the Src dir
 * @async @function @returns {Promise<boolean, boolean, string, string | null>}
 */
async function checkSrc(){
    try {
        const markupRes = await readHtml();
        const imagesRes = await readImages();
        const markupIssue = {...issue, issueType: Boolean(markupRes) ? 'info' : 'bung',
            validationType: 'src reading', message: Boolean(markupRes) ? markupRes : "can't read *.html"}
        const imagesIssue = {...issue, issueType: Boolean(imagesRes) ? 'info' : 'bung',
            validationType: 'src reading', message: Boolean(imagesRes) ? imagesRes : "can't read dir images"}
        return {markupIssue, imagesIssue};
    } catch (err) {
        throw new Error('error during src reading');
    }
};

module.exports = {checkSrc};




