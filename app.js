// Variabel global untuk menampung data kamus
let dataKamus = [];

// Langkah A: Mengambil data JSON saat web pertama kali dimuat
fetch('dictionary.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Gagal mengambil data kamus');
        }
        return response.json(); // Mengubah respon menjadi format yang bisa dibaca JS
    })
    .then(data => {
        dataKamus = data; // Menyimpan data ke variabel global
        console.log("Kamus berhasil dimuat:", dataKamus.length, "kata");
    })
    .catch(error => console.error('Error:', error));

// Langkah B: Fungsi untuk mencari kata ketika tombol diklik
function cariKata() {
    const kataDicari = document.getElementById('inputCari').value.toLowerCase();
    const wadahHasil = document.getElementById('hasilPencarian');
    
    wadahHasil.innerHTML = ""; // Bersihkan hasil sebelumnya

    if (kataDicari === "") {
        wadahHasil.innerHTML = "<p>Silakan masukkan kata terlebih dahulu.</p>";
        return;
    }

    // Mencari kata yang cocok persis (atau mengandung kata) di kolom "Indonesia"
    const hasil = dataKamus.filter(item => 
        item.Indonesia.toLowerCase().includes(kataDicari)
    );

    // Menampilkan hasil ke layar
    if (hasil.length > 0) {
        hasil.forEach(item => {
            const paragraf = document.createElement('p');
            paragraf.innerHTML = `<strong>${item.Indonesia}</strong>: ${item.Javanese}`;
            wadahHasil.appendChild(paragraf);
        });
    } else {
        wadahHasil.innerHTML = "<p>Kata tidak ditemukan.</p>";
    }
}
