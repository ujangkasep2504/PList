const fs = require('fs');

try {
  // Baca file asli
  const data = fs.readFileSync('rawProxyList.txt', 'utf8');
  
  // Pisahkan file menjadi baris-baris
  const lines = data.trim().split('\n');
  
  console.log(`File asli memiliki ${lines.length} entri.`);
  
  // Buat Map untuk menyimpan entri unik berdasarkan IP:port
  const uniqueEntries = new Map();
  
  // Proses setiap baris untuk deduplikasi
  for (const line of lines) {
    // Lewati baris kosong
    if (line.trim() === '') continue;
    
    // Pisahkan data berdasarkan koma
    const parts = line.trim().split(',');
    
    // Pastikan format valid (minimal memiliki IP, port, dan negara)
    if (parts.length < 3) {
      console.warn(`Melewati baris tidak valid: ${line}`);
      continue;
    }
    
    const ip = parts[0];
    const port = parts[1];
    const key = `${ip}:${port}`;
    
    // Simpan entri lengkap dengan kunci IP:port
    uniqueEntries.set(key, line.trim());
  }
  
  // Konversi Map kembali menjadi array dan gabungkan dengan baris baru
  const uniqueLines = [...uniqueEntries.values()].join('\n');
  
  // Tulis ke file ProxyList.txt
  fs.writeFileSync('ProxyList.txt', uniqueLines);
  
  console.log(`File yang difilter memiliki ${uniqueEntries.size} entri.`);
  console.log('Duplikat yang dihapus:', lines.length - uniqueEntries.size);
  
  // Buat objek untuk mengelompokkan proxy berdasarkan kode negara
  // Hanya menggunakan entri yang sudah dideduplikasi
  const countriesMap = {};
  
  // Proses entri yang sudah dideduplikasi untuk JSON
  for (const [ipPort, fullLine] of uniqueEntries.entries()) {
    const parts = fullLine.split(',');
    const country = parts[2];
    
    // Tambahkan ke pengelompokan negara
    if (!countriesMap[country]) {
      countriesMap[country] = [];
    }
    
    // Tambahkan IP:port ke array negara
    countriesMap[country].push(ipPort);
  }
  
  // Tulis ke file kvProxyList.json
  fs.writeFileSync('kvProxyList.json', JSON.stringify(countriesMap, null, 2));
  console.log('File kvProxyList.json dibuat dengan pengelompokan berdasarkan negara (tanpa duplikasi).');
  
  // Verifikasi tidak ada duplikat dalam file akhir berdasarkan IP:port
  const verifyData = fs.readFileSync('ProxyList.txt', 'utf8');
  const verifyLines = verifyData.trim().split('\n');
  
  // Buat set untuk verifikasi
  const verifySet = new Set();
  let hasDuplicates = false;
  
  for (const line of verifyLines) {
    const parts = line.split(',');
    const key = `${parts[0]}:${parts[1]}`;
    
    if (verifySet.has(key)) {
      hasDuplicates = true;
      break;
    }
    
    verifySet.add(key);
  }
  
  if (hasDuplicates) {
    console.error('Error: Duplikat masih ada dalam file yang difilter!');
    process.exit(1);
  } else {
    console.log('Verifikasi berhasil: Tidak ada duplikat IP:port dalam file yang difilter.');
  }
  
} catch (error) {
  console.error('Error memproses daftar proxy:', error);
  process.exit(1);
}
