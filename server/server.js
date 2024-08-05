const express = require("express");
const pdfParser = require("./pdfParser");
const officeParserMain = require("./officeParser");
const main = require("./textToJson");
const cors = require("cors");
const multer = require("multer");
const upload = multer({ dest: "upload/" });
var type = upload.single("file");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.post("/upload", type, async (req, res) => {
  const filePath = req.file.path;
  let parsedText = null;
  if (req.file.mimetype === "application/pdf") {
    parsedText = await pdfParser(filePath);
  } else {
    parsedText = await officeParserMain(filePath);
  }
  const resumeJson = await main(parsedText);
  res.status(200).send(resumeJson);
});

app.listen(5000, () => console.log("Server listening on 5000"));
