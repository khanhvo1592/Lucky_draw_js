const fs = require("fs");

let numbers = [];
for (let i = 2001; i <= 2064; i++) {
    numbers.push(i);
}

let json = JSON.stringify({ numbers: numbers }, null, 2);

fs.writeFile("numbers.json", json, "utf8", (err) => {
    if (err) throw err;
    console.log("The file has been saved!");
});
