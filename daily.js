const sample = require('lodash/sample');
const fs = require('fs');
const path = require('path');

// Utility function to read file content safely
function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    throw new Error(`Failed to read file: ${filePath}. ${error.message}`);
  }
}

// Utility function to get the current date in YYYY-MM-DD format
function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  let month = now.getMonth() + 1;
  month = month < 10 ? `0${month}` : month;
  let day = now.getDate();
  day = day < 10 ? `0${day}` : day;
  return `${year}-${month}-${day}`;
}

// Utility function to validate quotations format
function validateQuotations(quotations) {
  return quotations.filter(quote => quote.startsWith('-')).map(quote => quote.trim());
}

// Main function to run the update
function run() {
  const readmePath = './README.md';
  const quotationsPath = './quotations.md';

  try {
    // Read and validate README.md
    const readme = readFileSafe(readmePath);
    const insertionPoint = '</a>**';
    const index = readme.indexOf(insertionPoint);

    if (index === -1) {
      throw new Error('Insertion point not found in README.md.');
    }

    const before = readme.substring(0, index + 8);

    // Get current date
    const date = getCurrentDate();

    // Read and validate quotations.md
    const quotationContent = readFileSafe(quotationsPath);
    const quotations = quotationContent.split('\n');
    const validQuotations = validateQuotations(quotations);

    if (validQuotations.length === 0) {
      throw new Error('No valid quotations found in quotations.md.');
    }

    console.log(`quotations: ${validQuotations.length}`);
    const dailyQuotation = sample(validQuotations);
    console.log(`daily: ${dailyQuotation}`);

    // Construct new README content
    const newReadme = `${before}

<kbd>${date}</kbd>

${dailyQuotation}

<!-- Randomly taken from quotations.md -->
`;

    // Only write to README if there are changes
    if (newReadme !== readme) {
      fs.writeFileSync(readmePath, newReadme);
      console.log('Update Success!');
    } else {
      console.log('No changes to commit to README.md.');
    }
  } catch (error) {
    console.error('Error occurred:', error.message);
  }
}

run();
