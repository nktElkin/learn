import fs from "fs/promises";
import path from "path";
import snippet from "./canvas-utils/snippet.js";
import bgcolor from "./canvas-utils/bgcolor.js";
import url_symbols from "./canvas-utils/url_symbols.js";
import cfc_token from "./canvas-utils/cfc_token.js";
import { imagesToZip } from "./canvas-utils/imagesToZip.js";

const FOLDER_NAME = "full_version";

const getHTML = async () => {
  const docsInFolder = await fs.readdir("./src");
  const htmlFile = docsInFolder.find((el) => el.endsWith(".html"));
  if (!htmlFile) return null;
  return fs.readFile(path.join("./src", htmlFile), "utf8");
};

const wrapImageInAtag = (html) => {
  const imageRegex = /(?<!<a[^>]*>)<img[^>]*>(?![^<]*<\/a>)/g;
  return html.replace(imageRegex, (match) => `<a href="#">${match}</a>`);
};

const makeDownloadSymbDisappear = (html) => {
  const regEx = /<\/head>/g;
  return html.replace(
    regEx,
    (match) => `<style data-embed>
  img + div { display: none !important; }
  table select { max-width: 300px; }    
  </style>${match}`
  );
};

const deleteFolderIfExist = async (folderName) => {
  try {
    await fs.access(folderName);
    await fs.rm(folderName, { recursive: true, force: true });
  } catch (error) {
    // Folder does not exist or other error, ignore
  }
};

const changePhotosNames = (html = "") => {
  const srcRegex = /src=("|')(.+?)("|')/g;
  let counter = 1;
  const mapper = {};
  const newHTML = html.replace(srcRegex, (match, p1, p2) => {
    const [imgName, format] = p2.split("images/")[1].split(".");
    const newName = `image-${counter.toString().padStart(2, "0")}.${format}`;
    mapper[decodeURI(imgName)] = newName;
    counter++;
    return `src="images/${newName}"`;
  });
  return { newHTML, mapper };
};

const copyImageToNewFolder = async (mapper, html) => {
  await deleteFolderIfExist(FOLDER_NAME);
  await fs.mkdir(FOLDER_NAME);
  await fs.writeFile(path.join(FOLDER_NAME, "build.html"), html);

  const photosInFolder = await fs.readdir("src/images");
  for (const el of photosInFolder) {
    const imageName = el.split(".")[0].normalize("NFD");
    if (!imageName) continue;
    await fs.cp(
      path.join("src/images", el),
      path.join(FOLDER_NAME, "images", mapper[imageName])
    );
  }
};

const fix_constructor = async () => {
  const html = await getHTML();
  if (!html) return;

  let fixedHtml = snippet(html);
  fixedHtml = bgcolor(fixedHtml);
  fixedHtml = url_symbols(fixedHtml);
  fixedHtml = cfc_token(fixedHtml);
  fixedHtml = makeDownloadSymbDisappear(fixedHtml);

  const { newHTML, mapper } = changePhotosNames(fixedHtml);
  await copyImageToNewFolder(mapper, newHTML);
};

// Execute the entire flow
fix_constructor()
  .then(() => {
    imagesToZip(path.join(FOLDER_NAME, "images"), FOLDER_NAME)
      .then(() => console.log("Directory zipped successfully"))
      .catch((err) => console.error("Error zipping a directory:", err));
  })
  .catch((err) => console.error("Error in processing:", err));
