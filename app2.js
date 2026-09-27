let dataKamus2 = [];
let isIndoKeJawa = true;

// 1. Memuat dictionary2.json
fetch('dictionary2.json')
    .then(response => response.json())
    .then(data => {
        dataKamus2 = data;
        buatTombolAbjad();
    })
    .catch(error => console.error('Gagal memuat data:', error));

// 2. Mengubah Arah Terjemahan
function ubahMode() {
    isIndoKeJawa = !isIndoKeJawa;
    const btnToggle = document.getElementById('btnToggle');
    const inputCari = document.getElementById('inputCari');
    
    if (isIndoKeJawa) {
        btnToggle.innerText = "Mode: Indonesia ➔ Jawa";
        inputCari.placeholder = "Ketik kata bahasa Indonesia...";
    } else {
        btnToggle.innerText = "Mode: Jawa ➔ Indonesia";
        inputCari.placeholder = "Ketik kata bahasa Jawa (Ngoko/Krama)...";
    }
    document.getElementById('hasilPencarian').innerHTML = '<p class="info-text">Silakan mulai pencarian.</p>';
    document.getElementById('inputCari').value = "";
}

// 3. Membuat Tombol Abjad
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

// 4. Logika Pencarian Abjad (Mendeteksi huruf pertama)
function cariBerdasarkanAbjad(huruf) {
    const hasil = dataKamus2.filter(item => {
        if (isIndoKeJawa) {
            return item.indonesia && item.indonesia.toLowerCase().startsWith(huruf);
        } else {
            // Pencarian abjad Jawa difokuskan pada kata Ngoko
            return item.ngoko && item.ngoko.toLowerCase().startsWith(huruf);
        }
    });
    tampilkanData(hasil);
}

// 5. Logika Pencarian Teks Bebas
function cariKata() {
    const teksBebas = document.getElementById('inputCari').value.toLowerCase().trim();
    if (!teksBebas) return;

    const hasil = dataKamus2.filter(item => {
        if (isIndoKeJawa) {
            return item.indonesia && item.indonesia.toLowerCase().includes(teksBebas);
        } else {
            // Jika mode Jawa -> Indo, cari kecocokan di ketiga tingkatan
            const adaDiNgoko = item.ngoko && item.ngoko.toLowerCase().includes(teksBebas);
            const adaDiKrama = item.kramaalus && item.kramaalus.toLowerCase().includes(teksBebas);
            const adaDiInggil = item.kramainggil && item.kramainggil.toLowerCase().includes(teksBebas);
            return adaDiNgoko || adaDiKrama || adaDiInggil;
        }
    });
    tampilkanData(hasil);
}

// 6. Merender Hasil Tiga Tingkatan
function tampilkanData(dataHasil) {
    const wadahHasil = document.getElementById('hasilPencarian');
    wadahHasil.innerHTML = "";

    if (dataHasil.length === 0) {
        wadahHasil.innerHTML = `<p class="info-text">Kata tidak ditemukan.</p>`;
        return;
    }

    const batasRender = 100;
    const dataDitampilkan = dataHasil.slice(0, batasRender);
    wadahHasil.innerHTML = `<p class="info-text">Menemukan ${dataHasil.length} kata yang cocok.</p>`;

    dataDitampilkan.forEach(item => {
        const div = document.createElement('div');
        div.className = 'result-item';
        
        if (isIndoKeJawa) {
            div.innerHTML = `
                <div class="word">${item.indonesia}</div>
                <div class="meaning">
                    <div style="margin-bottom:4px;"><span class="badge bg-ngoko">Ngoko</span> ${item.ngoko}</div>
                    <div style="margin-bottom:4px;"><span class="badge bg-krama">Krama Alus</span> ${item.kramaalus}</div>
                    <div><span class="badge bg-inggil">Krama Inggil</span> ${item.kramainggil}</div>
                </div>`;
        } else {
            // Jika mode Jawa -> Indo, tampilkan apa yang mereka cari, lalu terjemahannya
            div.innerHTML = `
                <div class="word">${item.indonesia}</div>
                <div class="meaning">
                    <span style="color:#555;">Ditemukan dari:</span><br>
                    <span class="badge bg-ngoko">Ngoko</span> ${item.ngoko} | 
                    <span class="badge bg-krama">Krama</span> ${item.kramaalus} | 
                    <span class="badge bg-inggil">Inggil</span> ${item.kramainggil}
                </div>`;
        }
        wadahHasil.appendChild(div);
    });

    if (dataHasil.length > batasRender) {
        wadahHasil.innerHTML += `<p class="info-text">...dan ${dataHasil.length - batasRender} hasil lainnya disembunyikan.</p>`;
    }
}
