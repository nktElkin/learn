const fs = require('fs').promises;
const path = require('path');
const xl = require('excel4node');

/**
 * Create a directory if it doesn't exist
 * 
 * @param {string} dirPath - Path to the directory
 * @returns {Promise<void>}
 */
async function createDirectoryIfNotExists(dirPath) {
    try {
        await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
        console.error(`Error creating directory ${dirPath}:`, error);
    }
}



/**
 * Generate a file path based on inputs
 * 
 * @param {string} filePath - required file path
 * @param {number} number - number of file in directory
 * 
 * @returns {path} path - path of new file
 */
const genrateNewFilePath = (filePath, number) => {
    const dir = path.dirname(filePath); // Get the directory of the file
    const ext = path.extname(filePath); // Get the extension of the file (e.g., '.xls')
    const baseName = path.basename(filePath, ext); // Get the base name of the file without extension
    return path.join(dir, `${baseName}_${number}.${ext}`);
};



/**
 * Create an xls file if it doesn't exist, or create a new file with an incremented number if it does.
 * 
 * @param {string} filePath - Initial path to the xls file
 * @param {number} numberOfFiles - Number of existing files to determine the next sequential number
 * @param {Array} imagesList - List of images
 * @param {Array} linksList - List of links
 * @param {Array} altsList - List of alt texts
 * @param {Array} labelsList - List of labels
 * @returns {Promise<void>}
 */
async function createXlsFileIfNotExists(filePath, imagesList = [], linksList = [], altsList = [], labelsList = []) {
    try {
        // Check if the file exists
        if (!fs.existsSync(filePath)) {
            // Create a new instance of a Workbook class
            const wb = new xl.Workbook();

            // Add Worksheets to the workbook
            const reportPage = wb.addWorksheet('Report');
            const checkListPage = wb.addWorksheet('Check list');

            // Create and struct data into excel sheet
            // cell(y b y columns, x by row) demensions
            reportPage.row(1).setHeight(15);
            reportPage.row(1).set
            reportPage.cell(1, 2).string('Images');
            reportPage.cell(1, 4).string('Links');
            reportPage.cell(1, 6).string('Alts');
            reportPage.cell(1, 8).string('Labels');
            for(let col  = 1; col<12; col++){
                for(let row  = 0; row<10; row++){
                    reportPage.cell(i + 1, j + 1).number(data[i][j]);
                }
            }
            for(let i = 2; i++; i<9){
                reportPage.cell(1, i+1).formula('')
            }
            
            checkListPage.cell(1, 1).string('Images');
            



            // Write to the file
            wb.write(filePath, (err, stats) => {
                if (err) {
                    console.error(`Error writing to file ${filePath}:`, err);
                } else {
                    console.log(`File ${filePath} created successfully.`);
                }
            });
        } else {
            console.log(`File ${filePath} already exists.`);
        }
    } catch (error) {
        console.error(`Error checking or creating file ${filePath}:`, error);
    }
    genrateNewFilePath()
}

module.exports = { createXlsFileIfNotExists, createDirectoryIfNotExists };
