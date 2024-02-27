const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const numbersFilePath = path.join(__dirname, "public", "numbers.json");
const luckyNumbersFilePath = path.join(__dirname, "public", "lucky_num.json");

// Đường dẫn đến thư mục views
const viewsPath = path.join(__dirname, "views");

app.get("/", (req, res) => {
    res.sendFile(path.join(viewsPath, "index.html"));
});
app.post("/pick-number", (req, res) => {
    const pickedNumber = req.body.number;
    if (!pickedNumber) {
        return res.status(400).send("Number is required.");
    }

    try {
        // Đọc và cập nhật numbers.json
        let numbersData = fs.readFileSync(numbersFilePath);
        let numbers = JSON.parse(numbersData).numbers;
        numbers = numbers.filter((number) => number !== pickedNumber);
        fs.writeFileSync(numbersFilePath, JSON.stringify({ numbers }, null, 2));

        // Đọc và cập nhật lucky_num.json
        let luckyNumbersData = fs.existsSync(luckyNumbersFilePath)
            ? fs.readFileSync(luckyNumbersFilePath)
            : '{"luckyNumbers":[]}';
        let luckyNumbers = JSON.parse(luckyNumbersData).luckyNumbers;
        luckyNumbers.push(pickedNumber);
        fs.writeFileSync(
            luckyNumbersFilePath,
            JSON.stringify({ luckyNumbers }, null, 2)
        );

        res.send("Number processed successfully.");
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error.");
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
