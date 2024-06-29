const fs = require('fs');
const path = require('path');



//TODO:
// take from cmd like an argument
const srcDirName = './Test_document';

const errorSnippet = (message) => {
    return  `💣 Error - ${message}`
} ;



// const readHtml_old = async () => {
//     const docsInFolder = await fs.promises.readdir(srcDirName);
//     const htmlFile = docsInFolder.find((el) => el.endsWith(".html"));
//     if (!htmlFile) return null;
//     return fs.readFile(path.join(htmlFile), "utf8");
// };


// const readImages_old = async () => {
//     const imagesList = []
//     const dirExist = await fs.promises.lstatSync('/src/images');
//     if (!dirExist) return null;
//     fs.readdir(directoryPath, (err, files) => {
//         if (err) {
//             console.log('error in imges folder reading')
//             return;
//         }
//         files.forEach(file => {
//             imagesList.push(file);
//         });
//     });
//     if (readImages.length === 0) return null;
//     return imagesList;
// };


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


async function checkSrc(){
    try {
        const markup = await readHtml();
        const images = await readImages();
        const hasHtml = markup !== null;
        const hasImages = images !== null;
   
        return {hasHtml, hasImages, markup, images};
    } catch (err) {
        console.log('error during src reading');
        return null;
    }
};

module.exports = {checkSrc};




