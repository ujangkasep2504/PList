const fs = require('fs');

try {
  // Hapus file yang sudah ada jika ada
  if (fs.existsSync('ProxyList.txt')) {
    console.log('Menghapus file ProxyList.txt yang sudah ada...');
    fs.unlinkSync('ProxyList.txt');
  }
  
  // Baca file asli
  const data = fs.readFileSync('rawProxyList.txt', 'utf8');
  
  // Pisahkan file menjadi baris-baris
  const lines = data.trim().split('\n');
  
  console.log(`File asli memiliki ${lines.length} entri.`);
  
  // Buat Map untuk menyimpan entri unik berdasarkan IP:port
  const uniqueEntries = new Map();
  
  // Proses setiap baris
  for (const line of lines) {
    // Lewati baris kosong
    if (line.trim() === '') continue;
    
    // Pisahkan data berdasarkan koma
    const parts = line.trim().split(',');
    
    // Pastikan format valid (minimal memiliki IP dan port)
    if (parts.length < 2) {
      console.warn(`Melewati baris tidak valid: ${line}`);
      continue;
    }
    
    const ip = parts[0];
    const port = parts[1];
    const key = `${ip}:${port}`;
    
    // Simpan entri lengkap dengan kunci IP:port
    // Jika IP:port sudah ada, entri baru akan menimpa yang lama
    uniqueEntries.set(key, line.trim());
  }
  
  // Konversi Map kembali menjadi array dan gabungkan dengan baris baru
  const uniqueLines = [...uniqueEntries.values()].join('\n');
  
  // Tulis ke file baru
  fs.writeFileSync('ProxyList.txt', uniqueLines);
  
  console.log(`File yang difilter memiliki ${uniqueEntries.size} entri.`);
  console.log('Duplikat yang dihapus:', lines.length - uniqueEntries.size);
  
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
