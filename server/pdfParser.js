const fs = require("fs");
const pdf = require("pdf-parse");

// Function to read and parse PDF data
async function parsePdf(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  try {
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    console.error(`Error reading PDF file: ${error}`);
    return null;
  } finally {
    fs.unlinkSync(filePath);
  }
}

module.exports = parsePdf;
