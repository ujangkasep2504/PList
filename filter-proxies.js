const fs = require('fs');

try {
  // Delete existing filtered file if it exists
  if (fs.existsSync('ProxyList.txt')) {
    console.log('Deleting existing ProxyList.txt file...');
    fs.unlinkSync('ProxyList.txt');
  }
  
  // Read the original file
  const data = fs.readFileSync('rawProxyList.txt', 'utf8');
  
  // Split the file into lines
  const lines = data.trim().split('\n');
  
  console.log(`Original file has ${lines.length} entries.`);
  
  // Create a Set to store unique entries
  const uniqueEntries = new Set();
  
  // Process each line
  for (const line of lines) {
    // Skip empty lines
    if (line.trim() === '') continue;
    uniqueEntries.add(line.trim());
  }
  
  // Convert the Set back to an array and join with newlines
  const uniqueLines = [...uniqueEntries].join('\n');
  
  // Write to a new file
  fs.writeFileSync('ProxyList.txt', uniqueLines);
  
  console.log(`Filtered file has ${uniqueEntries.size} entries.`);
  console.log('Duplicates removed:', lines.length - uniqueEntries.size);
  
  // Verify no duplicates exist in the final file
  const verifyData = fs.readFileSync('ProxyList.txt', 'utf8');
  const verifyLines = verifyData.trim().split('\n');
  const verifySet = new Set(verifyLines);
  
  if (verifyLines.length !== verifySet.size) {
    console.error('Error: Duplicates still exist in the filtered file!');
    process.exit(1);
  } else {
    console.log('Verification successful: No duplicates in the filtered file.');
  }
} catch (error) {
  console.error('Error processing proxy list:', error);
  process.exit(1);
}
