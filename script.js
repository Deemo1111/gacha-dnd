let participants = [];
let predeterminedWinner1 = null; // Pemenang yang sudah ditentukan 1
let predeterminedWinner2 = null; // Pemenang yang sudah ditentukan 2

document.getElementById('fileInput').addEventListener('change', handleFile);
document.getElementById('startButton').addEventListener('click', startDraw);
document.querySelector('h1').addEventListener('click', () => {
    // Memunculkan keyboard saat judul diklik
    const input = document.createElement('input');
    input.style.position = 'absolute';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.focus();
    input.addEventListener('blur', () => {
        document.body.removeChild(input);
    });
});

function handleFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        participants = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }).flat();
    };
    
    reader.readAsArrayBuffer(file);
}

function setWinner1() {
    if (participants.length > 0) {
        predeterminedWinner1 = participants[0]; // Pemenang pertama (indeks 0)
        console.log(`Pemenang 1 yang sudah ditentukan: ${predeterminedWinner1}`);
    }
}

function setWinner2() {
    if (participants.length > 4) {
        predeterminedWinner2 = participants[4]; // Pemenang kedua (indeks 4)
        console.log(`Pemenang 2 yang sudah ditentukan: ${predeterminedWinner2}`);
    }
}

function startDraw() {
    const resultDiv = document.getElementById('result');
    const randomIndex = Math.floor(Math.random() * participants.length);
    const winner = predeterminedWinner1 || predeterminedWinner2 || participants[randomIndex];
    
    resultDiv.textContent = `Pemenangnya adalah: ${winner}`;
    
    // Reset pemenang setelah undian
    predeterminedWinner1 = null;
    predeterminedWinner2 = null;
}

// Menangkap event keydown untuk mengatur pemenang
document.addEventListener('keydown', (event) => {
    if (event.key === 'p') { // Tombol 'p' untuk mengatur pemenang pertama
        setWinner1();
    }
    if (event.key === 'o') { // Tombol 'o' untuk mengatur pemenang kedua
        setWinner2();
    }
});
