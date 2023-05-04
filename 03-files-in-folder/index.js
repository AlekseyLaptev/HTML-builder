const fs = require('fs/promises');
const path = require("path");

function readDir(currentPath) {
    fs.readdir(currentPath,{withFileTypes: true})
.then(files => {
    for (const file of files) {
        if(!file.isDirectory()) {
            fs.stat(path.join(currentPath,file.name)).then(res => {
                console.log(`${path.parse(file.name).name}-${path.extname(file.name).replace(".","")}-${res.size}`); 
            })
        }
         
    }
});
}


readDir(path.join(__dirname,"secret-folder"))