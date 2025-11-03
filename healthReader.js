// healthReader.js
const fs = require('fs/promises');

async function readHealthFile(filepath) {
  try {
    // Read JSON file asynchronously
    const data = await fs.readFile(filepath, 'utf8');
    const healthData = JSON.parse(data);

    // Log success
    console.log("Success! Found your health data!");

    // Log total entries if available
    if (healthData.metrics && Array.isArray(healthData.metrics)) {
      console.log("Total health entries:", healthData.metrics.length);
    } else {
      console.log("Warning: JSON file does not contain a metrics array.");
    }

    // Return full object so tests can access metrics
    return healthData;

  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log("File not found - check the file path");
    } else if (error.name === 'SyntaxError') {
      console.log("Invalid JSON - check the file format");
    } else {
      console.log("Unknown error:", error.message);
    }
    return null;
  }
}

module.exports = { readHealthFile };
