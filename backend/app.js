const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const { json } = require("express");

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next();
})

const logsDirectory = process.env.LOGS_DIRECTORY || "./storage/logs";
if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory);
}

const storageDirectory = process.env.FILES_DIRECTORY || "./storage/data";
if (!fs.existsSync(storageDirectory)) {
  fs.mkdirSync(storageDirectory);
}

const saveFile = (fileName, data) => {
  const filePath = `${process.env.FILES_DIRECTORY || "./storage/data"}/${fileName}.txt`;
  fs.writeFileSync(filePath, data);
};

app.post("/api/data", (req, res) => {
  try {
    const { title, text } = req.body;
    if (!title) {
      res.status(400).send({ error: "Title is required" });
      return;
    }
    const fileName = title;
    saveFile(fileName, text);
    fs.appendFileSync(
      `${logsDirectory}/logs.txt`,
      `[${new Date().toLocaleString()}] Saved file "${fileName}"\n`
    );
    res.send({ message: "File saved successfully." });
  } catch (error) {
    fs.appendFileSync(
      `${logsDirectory}/logs.txt`,
      `[${new Date().toLocaleString()}] Error: ${error}\n`
    );
    res.status(500).send({ error: "Could not save file." });
  }
});

app.get("/api/data", (req, res) => {
  try {
    const filesDirectory = process.env.FILES_DIRECTORY || "./storage/data";
    const files = fs
      .readdirSync(filesDirectory)
      .filter((file) => file.endsWith(".txt"))
      .map((file) => file.slice(0, -4));
    res.send({ files });
  } catch (error) {
    fs.appendFileSync(
      `${logsDirectory}/logs.txt`,
      `[${new Date().toLocaleString()}] Error: ${error}\n`
    );
    res.status(500).send({ error: "Could not retrieve file list." });
  }
});

app.listen(3000, () => {
  console.log("API listening on port 3000");
});
