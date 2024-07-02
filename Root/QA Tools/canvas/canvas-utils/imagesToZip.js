import fs from 'fs'
import { join } from 'path';
import archiver from 'archiver';

export function imagesToZip(sourceDir, targetDir) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(sourceDir)) {
            reject(`Source directory '${sourceDir}' does not exist. Check if a folder is correctly named.`);
            return;
        }

        const output = fs.createWriteStream(join(targetDir, 'images.zip'));
        const archive = archiver('zip', {
            zlib: { level: 9 }
        });

        console.log('Creating a zip file...')
        output.on('close', () => {
            console.log(archive.pointer() + ' total bytes');
            resolve();
        });

        archive.on('warning', err => {
            if (err.code === 'ENOENT') {
                console.warn(err);
            } else {
                reject(err);
            }
        });

        archive.on('error', err => {
            reject(err);
        });

        archive.pipe(output);

        const files = fs.readdirSync(sourceDir);

        for (const file of files) {
            const filePath = join(sourceDir, file);
            archive.file(filePath, { name: `images/${file}` });
        }

        archive.finalize();
    });
}

// const sourceDir = process.argv[2];
// const targetDir = process.argv[3];

// if (!sourceDir || !targetDir) {
//     console.error('Error: Please provide both source directory and target directory.');
//     process.exit(1);
// }

// imagesToZip(sourceDir, targetDir)
//     .then(() => console.log('Directory zipped successfully'))
//     .catch(err => console.error('Error zipping a directory:', err));
