const fs = require('fs');
const path = require('path');

// Konfigurasi
const INPUT_FILE = 'rawProxyList.txt';
const OUTPUT_FILE = 'ProxyList.txt';
const JSON_FILE = 'kvProxyList.json';

// Fungsi utama
async function main() {
  try {
    console.log('Memulai proses filter proxy...');
    console.log('Direktori kerja saat ini:', process.cwd());
    
    // Cek apakah file input ada
    if (!fs.existsSync(INPUT_FILE)) {
      console.error(`File input ${INPUT_FILE} tidak ditemukan!`);
      process.exit(1);
    }
    
    // Baca file asli
    console.log(`Membaca file ${INPUT_FILE}...`);
    const data = fs.readFileSync(INPUT_FILE, 'utf8');
    
    // Pisahkan file menjadi baris-baris
    const lines = data.trim().split('\n');
    console.log(`File asli memiliki ${lines.length} entri.`);
    
    // Buat Map untuk menyimpan entri unik berdasarkan IP:port
    const uniqueEntries = new Map();
    
    // Proses setiap baris untuk deduplikasi
    console.log('Memproses dan menghapus duplikat...');
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
    
    // Tulis ke file output
    console.log(`Menulis ke ${OUTPUT_FILE}...`);
    fs.writeFileSync(OUTPUT_FILE, uniqueLines);
    console.log(`File ${OUTPUT_FILE} berhasil dibuat.`);
    
    // Buat objek untuk mengelompokkan proxy berdasarkan kode negara
    console.log('Membuat pengelompokan berdasarkan negara...');
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
    
    // Tulis ke file JSON
    console.log(`Menulis ke ${JSON_FILE}...`);
    fs.writeFileSync(JSON_FILE, JSON.stringify(countriesMap, null, 2));
    console.log(`File ${JSON_FILE} berhasil dibuat.`);
    
    // Tampilkan statistik
    console.log(`File yang difilter memiliki ${uniqueEntries.size} entri.`);
    console.log('Duplikat yang dihapus:', lines.length - uniqueEntries.size);
    
    // Tampilkan statistik per negara
    console.log('\nStatistik per negara:');
    Object.keys(countriesMap).sort().forEach(country => {
      console.log(`${country}: ${countriesMap[country].length} proxy`);
    });
    
    console.log('\nProses selesai!');
    
  } catch (error) {
    console.error('Error tidak terduga:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Jalankan fungsi utama
main();
