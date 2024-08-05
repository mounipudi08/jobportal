const officeParser = require("officeparser");
const fs = require("fs");

const officeParserMain = async (filePath) => {
  try {
    // "data" string returned from promise here is the text parsed from the office file passed in the argument
    const dataBuffer = fs.readFileSync(filePath);
    const data = await officeParser.parseOfficeAsync(dataBuffer);
    return data;
  } catch (err) {
    console.log(err);
  } finally {
    fs.unlinkSync(filePath);
  }
};

module.exports = officeParserMain;
