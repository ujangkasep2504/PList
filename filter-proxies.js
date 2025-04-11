import fs from 'fs/promises';

async function filterProxies() {
  try {
    // Read the original file
    const data = await fs.readFile('ProxyList.txt', 'utf8');
    
    // Split the file into lines
    const lines = data.trim().split('\n');
    
    console.log(`Original file has ${lines.length} entries.`);
    
    // Create a Set to store unique entries
    const uniqueEntries = new Set();
    
    // Process each line
    for (const line of lines) {
      uniqueEntries.add(line);
    }
    
    // Convert the Set back to an array and join with newlines
    const uniqueLines = [...uniqueEntries].join('\n');
    
    // Write to a new file
    await fs.writeFile('FilteredProxyList.txt', uniqueLines);
    
    console.log(`Filtered file has ${uniqueEntries.size} entries.`);
    console.log('Duplicates removed:', lines.length - uniqueEntries.size);
    console.log('Filtered file saved as FilteredProxyList.txt');
    
    // Show the filtered content
    console.log('\nFiltered content:');
    console.log(uniqueLines);
  } catch (error) {
    console.error('Error processing the file:', error);
  }
}

// Run the function
filterProxies();
