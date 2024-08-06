const pdf = require("pdf-parse");
const mammoth = require("mammoth");

async function downloadAndParseDocument(buffer, key) {
  const fileExtension = getFileExtension(key);
  let text;

  if (fileExtension === "pdf") {
    const data = await pdf(buffer);
    text = data.text;
  } else if (fileExtension === "docx") {
    const result = await mammoth.extractRawText({ buffer: buffer });
    text = result.value;
  } else {
    throw new Error(
      "Unsupported file type. Please provide a PDF or DOCX file URL."
    );
  }

  return text;
}
function getFileExtension(key) {
  const parts = key.split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "";
}

module.exports = { downloadAndParseDocument };
