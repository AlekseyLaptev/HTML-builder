const fs = require("fs");
const path = require("path");
const { EOL } = require("os");
const readline = require("readline");
const readStream = process.stdin;
const writeStream = new fs.WriteStream(path.join(__dirname,"text.txt"));
const stopPhrase = "**exit**"

const rl = readline.createInterface(readStream)

writeStream.on('ready',() => {
    console.log("Ready to see")
})

rl.on('SIGINT', function() {
    process.emit("SIGINT");
});

rl.on("line", function (line) {
    if(line != null && line.toString() === stopPhrase) {
        console.log("Bye-bye")
        rl.close();
    } 
    writeStream.write(`${line}${EOL}`);
  });

  process.on("SIGINT", function () {
    console.log("Bye-bye")
    rl.close();
  });