const fs = require('fs/promises');
const path = require("path");

const sourcePath = path.join(__dirname,"files");
const destinationPath = path.join(__dirname,"files-copy");

async function copyDir() {
    await fs.rm(destinationPath,{recursive: true})
    await fs.mkdir(destinationPath,{recursive: true})
    
    const files = await fs.readdir(sourcePath,{withFileTypes: true})
    files.forEach(async file => {
        await fs.copyFile(path.join(sourcePath,file.name), path.join(destinationPath,file.name));
    })
}

copyDir()