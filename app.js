// Variabel State
let dataKamus = [];
let isIndoKeJawa = true; // True: Indo->Jawa, False: Jawa->Indo

// 1. Inisialisasi Data & UI saat web dimuat
fetch('dictionary.json')
    .then(response => response.json())
    .then(data => {
        dataKamus = data;
        buatTombolAbjad();
    })
    .catch(error => console.error('Gagal memuat data:', error));

// 2. Fungsi Mengubah Arah Terjemahan
function ubahMode() {
    isIndoKeJawa = !isIndoKeJawa;
    const btnToggle = document.getElementById('btnToggle');
    const inputCari = document.getElementById('inputCari');
    
    if (isIndoKeJawa) {
        btnToggle.innerText = "Mode: Indonesia ➔ Jawa";
        inputCari.placeholder = "Ketik kata bahasa Indonesia...";
    } else {
        btnToggle.innerText = "Mode: Jawa ➔ Indonesia";
        inputCari.placeholder = "Ketik kata bahasa Jawa...";
    }
    
    // Reset hasil saat ganti mode
    document.getElementById('hasilPencarian').innerHTML = '<p class="info-text">Silakan mulai pencarian.</p>';
    document.getElementById('inputCari').value = "";
}

// 3. Fungsi Membuat Tombol A-Z secara Dinamis
function buatTombolAbjad() {
    const wadah = document.getElementById('wadahAbjad');
    const abjad = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    
    abjad.forEach(huruf => {
        const btn = document.createElement('button');
        btn.innerText = huruf;
        btn.onclick = () => cariBerdasarkanAbjad(huruf.toLowerCase());
        wadah.appendChild(btn);
    });
}

// 4. Logika Pencarian berdasarkan Tombol Abjad
function cariBerdasarkanAbjad(huruf) {
    const hasil = dataKamus.filter(item => {
        if (isIndoKeJawa) {
            // Karena di CSV ada kolom khusus 'Alphabet', kita gunakan itu untuk presisi
            return item.Alphabet && item.Alphabet.toLowerCase() === huruf;
        } else {
            // Untuk Jawa, kita cek huruf pertama dari kata tersebut
            return item.Javanese && item.Javanese.toLowerCase().startsWith(huruf);
        }
    });
    tampilkanData(hasil);
}

// 5. Logika Pencarian berdasarkan Teks Bebas
function cariKata() {
    const teksBebas = document.getElementById('inputCari').value.toLowerCase().trim();
    if (!teksBebas) return;

    const hasil = dataKamus.filter(item => {
        if (isIndoKeJawa) {
            return item.Indonesia && item.Indonesia.toLowerCase().includes(teksBebas);
        } else {
            return item.Javanese && item.Javanese.toLowerCase().includes(teksBebas);
        }
    });
    tampilkanData(hasil);
}

// 6. Fungsi Merender Hasil ke Layar
function tampilkanData(dataHasil) {
    const wadahHasil = document.getElementById('hasilPencarian');
    wadahHasil.innerHTML = ""; // Bersihkan kontainer

    if (dataHasil.length === 0) {
        wadahHasil.innerHTML = `<p class="info-text">Kata tidak ditemukan.</p>`;
        return;
    }

    // Limitasi performa rendering UI (hanya 100 maksimal)
    const batasRender = 100;
    const dataDitampilkan = dataHasil.slice(0, batasRender);
    
    // Informasi jumlah data
    wadahHasil.innerHTML = `<p class="info-text">Menemukan ${dataHasil.length} kata yang cocok.</p>`;

    dataDitampilkan.forEach(item => {
        const div = document.createElement('div');
        div.className = 'result-item';
        
        // Membalik urutan penempatan teks berdasarkan mode
        if (isIndoKeJawa) {
            div.innerHTML = `<div class="word">${item.Indonesia}</div><div class="meaning">${item.Javanese}</div>`;
        } else {
            div.innerHTML = `<div class="word">${item.Javanese}</div><div class="meaning">${item.Indonesia}</div>`;
        }
        wadahHasil.appendChild(div);
    });

    if (dataHasil.length > batasRender) {
        wadahHasil.innerHTML += `<p class="info-text">...dan ${dataHasil.length - batasRender} hasil lainnya disembunyikan agar aplikasi tetap ringan. Gunakan pencarian teks untuk hasil yang lebih spesifik.</p>`;
    }
}
