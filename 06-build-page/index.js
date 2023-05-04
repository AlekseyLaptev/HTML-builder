const fs = require('fs/promises');
const fsClean = require("fs");
const path = require("path");
const readline = require("readline");
const { EOL } = require("os");


const destinationPath = path.join(__dirname,"project-dist");

async function bundleCss(currentPath) {
    const writeStream = new fsClean.WriteStream(path.join(destinationPath,"style.css"));
    const files = await fs.readdir(currentPath,{withFileTypes: true})
    files
        .filter(file => path.extname(file.name).indexOf(".css") != -1)
        .map(file => new fsClean.ReadStream(path.join(currentPath,path.parse(file.name).base)))
        .forEach(stream => stream.pipe(writeStream))
}

async function bundleHtml() {
    await fs.mkdir(destinationPath,{recursive: true}) 
    const writeStream = new fsClean.WriteStream(path.join(destinationPath,"index.html"))
    const rl = readline.createInterface(
        new fsClean.ReadStream(path.join(__dirname,"template.html")));

    for await (const line of rl) {
        const regexResult = line.match(/{{[a-z]+}}/g)
        if(regexResult != null) {
            for await (const subLine of regexResult) {
                const name = subLine.replaceAll("{","").replaceAll("}","").trim()
                const content = await fs.readFile(path.join(__dirname,"components",`${name}.html`))
                writeStream.write(content);
                writeStream.write(EOL);
            }

        } else {
            writeStream.write(`${line}${EOL}`);
        }
    }
}

async function bundleAssets(src,folderName,dst) {
    const sourcePath = path.join(src,folderName)
    const files = await fs.readdir(sourcePath,{withFileTypes: true});
    files.forEach(async file => {
        if(file.isDirectory()) {
            bundleAssets(sourcePath,file.name, path.join(dst,file.name));
        } else {
            await fs.mkdir(dst,{recursive: true})
            await fs.copyFile(path.join(sourcePath,file.name), path.join(dst,file.name));
        }
    })
}

bundleHtml()
bundleCss(path.join(__dirname,"styles"))
bundleAssets(__dirname,"assets",path.join(destinationPath,"assets"))