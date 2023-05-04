const fs = require('fs/promises');
const fsClean = require("fs");
const path = require("path");

async function readDir(currentPath) {
    const writeStream = new fsClean.WriteStream(path.join(__dirname,"project-dist","bundle.css"));
    const files = await fs.readdir(currentPath,{withFileTypes: true})
    files
        .filter(file => path.extname(file.name).indexOf(".css") != -1)
        .map(file => new fsClean.ReadStream(path.join(currentPath,path.parse(file.name).base)))
        .forEach(stream => stream.pipe(writeStream))
}


readDir(path.join(__dirname,"styles"))