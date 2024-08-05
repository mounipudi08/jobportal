// Function to convert parsed text into JSON format
function convertToJson(parsedText) {
  const jsonResult = {
    name: "",
    title: "",
    about: "",
    availability: "Yes",
    contact: {
      email: "",
      phone: "",
    },
    education: [],
    trainings: [],
    projects: [],
    skills: {
      primary: "",
      secondary: [],
    },
  };

  const lines = parsedText.split("\n");
  let section = "";

  for (let line of lines) {
    line = line.trim();
    if (line === "") continue;

    if (
      line.toLowerCase().includes("ABOUT ME:".toLowerCase()) ||
      line.toLowerCase().includes("Background".toLowerCase())
    ) {
      section = "about";
      //continue;
    } else if (line.toLowerCase().includes("EDUCATION:".toLowerCase())) {
      section = "education";
      //continue;
    } else if (
      line.toLowerCase().includes("TRAININGS AND PROJECTS:".toLowerCase()) ||
      line.toLowerCase().includes("Trainings:".toLowerCase())
    ) {
      section = "trainings";
      //continue;
    } else if (line.toLowerCase().includes("PROJECTS:".toLowerCase())) {
      section = "projects";
      //continue;
    } else if (line.toLowerCase().includes("SKILLS:".toLowerCase())) {
      section = "skills";
      //continue;
    } else if (
      line.toLowerCase().includes("C O N T A C T".toLowerCase()) ||
      line.toLowerCase().includes("Contact".toLowerCase())
    ) {
      section = "contact";
      //continue;
    }

    switch (section) {
      case "about":
        if (line.toLowerCase().includes("About me:".toLowerCase())) {
          jsonResult["about"] += line.split("ABOUT ME:").pop();
        } else {
          jsonResult["about"] += line + " ";
        }
        break;
      case "education":
        if (line.includes("Batch:")) {
          const [college, batch] = line.split("Batch:");
          jsonResult["education"].push({
            institution: college.trim(),
            batch: batch.trim(),
          });
        } else if (line.includes("completed the program of")) {
          let resultLine = line.split("completed the program of").pop().trim();
          jsonResult["education"].slice(-1)[0]["course"] = resultLine
            .split("with")[0]
            .trim();
        }
        if (line.includes("aggregate score of")) {
          jsonResult["education"].slice(-1)[0]["score"] = line
            .split("aggregate score of")
            .pop()
            .trim();
        }
        break;
      case "trainings":
        if (line.includes("Course:")) {
          let resultLine = line.split("Course:").pop().trim();
          jsonResult["trainings"].push({
            course: resultLine.split("Duration:")[0].trim(),
            duration: "",
            description: "",
          });
        }
        if (line.toLowerCase().includes("Duration:".toLowerCase())) {
          jsonResult["trainings"].slice(-1)[0]["duration"] = line
            .split("Duration:")
            .pop()
            .trim();
        }
        if (line.includes("Description:")) {
          let desc = "";
          try {
            let index = lines.findIndex((item) => item.includes(line));
            while (
              lines[index]?.trim().valueOf() !== "" &&
              index < lines.length &&
              !lines[index].toLowerCase().includes("Course:".toLowerCase()) &&
              !lines[index].toLowerCase().includes("Projects:".toLowerCase())
            ) {
              desc += lines[index];
              index++;
            }
          } catch (error) {
            console.log(error);
          }
          jsonResult["trainings"].slice(-1)[0]["description"] += desc
            .split("Description:")
            .pop()
            .trim();
        }
        break;
      case "projects":
        if (line.includes("TITLE:")) {
          jsonResult["projects"].push({
            title: line.split("TITLE:").pop().trim(),
            technologies: "",
            description: "",
          });
        } else if (line.includes("Technologies used:")) {
          jsonResult["projects"].slice(-1)[0]["technologies"] = line
            .split("Technologies used:")
            .pop()
            .trim();
        } else if (line.includes("Description:")) {
          let desc = "";
          try {
            let index = lines.findIndex((item) => item.includes(line));
            while (
              lines[index]?.trim() !== "" &&
              index < lines.length &&
              !lines[index].toLowerCase().includes("Title:".toLowerCase()) &&
              !(
                lines[index]
                  .toLowerCase()
                  .includes("C o n t a c t".toLowerCase()) ||
                lines[index].toLowerCase().includes("Contact:".toLowerCase())
              )
            ) {
              desc += lines[index];
              index++;
            }
          } catch (error) {
            console.log(error);
          }
          jsonResult["projects"].slice(-1)[0]["description"] +=
            desc.split("Description:").pop().trim() + " ";
        }
        break;
      case "skills":
        if (line.includes("PRIMARY SKILL:")) {
          jsonResult["skills"]["primary"] = lines[
            lines.findIndex((item) => item.includes("PRIMARY SKILL:")) + 1
          ]
            .split("PRIMARY SKILL:")
            .pop()
            .trim();
        } else if (
          line.toLowerCase().includes("SECONDARY SKILLS:".toLowerCase())
        ) {
          let resultLine = "";
          try {
            let index = lines.findIndex((item) => item.includes(line));
            while (
              lines[index]?.trim().valueOf() !== "" &&
              index < lines.length
            ) {
              resultLine += lines[index];
              index++;
            }
          } catch (error) {
            console.log(error);
          }
          jsonResult["skills"]["secondary"] = resultLine
            .split("SECONDARY SKILLS:")
            .pop()
            .split(",")
            .map((skill) => skill.trim());
        }
        break;
      case "contact":
        if (line.includes("@")) {
          jsonResult["contact"]["email"] = line;
        } else if (
          /^\d{10}$/.test(line) ||
          /(?:\+\d{1,3})?\s*(?:\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})/g.test(
            line
          ) ||
          /\+\d{2}\s\d{10}/g.test(line)
        ) {
          jsonResult["contact"]["phone"] = line;
        }
        break;
      default:
        break;
    }
  }

  // Extract name and title from the top section of the resume
  let nameLine = "";
  let titleLine = "";
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() !== "") {
      nameLine = lines[i].trim();
      titleLine = lines[i + 1].trim();
      break;
    }
  }

  let nameLineArray = nameLine.split(" ");
  let nameLineResult = "";
  for (let name of nameLineArray) {
    name = name.toLowerCase();
    nameLineResult += name.charAt(0).toUpperCase() + name.slice(1) + " ";
  }

  let titleLineArray = titleLine.split(" ");
  let titleLineResult = "";
  for (let title of titleLineArray) {
    title = title.toLowerCase();
    titleLineResult += title.charAt(0).toUpperCase() + title.slice(1) + " ";
  }

  jsonResult["name"] = nameLineResult.trim();
  jsonResult["title"] = titleLineResult.trim();

  return jsonResult;
}

// Main function to execute the process
async function main(parsedText) {
  if (parsedText) {
    const resumeJson = convertToJson(parsedText);
    return resumeJson;
  } else {
    console.log("Failed to parse document");
  }
}

module.exports = main;
