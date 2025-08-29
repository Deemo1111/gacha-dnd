let participants = [];
let predeterminedWinner = null;
let usePredeterminedWinner = false;
let isDrawing = false;

document.getElementById('fileInput').addEventListener('change', handleFile);
document.getElementById('startButton').addEventListener('click', startDraw);

document.querySelector('h1').addEventListener('click', () => {
    setWinnerByIndex(0); // Trigger pemenang 1
});

document.querySelector('.logo').addEventListener('click', () => {
    setWinnerByIndex(2); // Trigger pemenang 2
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'p') setWinnerByIndex(0);
    if (event.key === 'o') setWinnerByIndex(2);
});

function handleFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        participants = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }).flat().filter(name => name);
        displayParticipantsInNameDisplay();
    };

    reader.readAsArrayBuffer(file);
}

function displayParticipantsInNameDisplay() {
    const nameDisplay = document.getElementById('nameDisplay');
    nameDisplay.textContent = participants.length > 0 ? participants[0] : "Unggah file Excel untuk memulai.";
}

function setWinnerByIndex(index) {
    if (participants.length > index) {
        predeterminedWinner = participants[index];
        usePredeterminedWinner = true;
        console.log(`Pemenang ditentukan: ${predeterminedWinner}`);
    }
}

function startDraw() {
    if (isDrawing || participants.length === 0) return;

    isDrawing = true;
    const resultDiv = document.getElementById('result');
    const nameDisplay = document.getElementById('nameDisplay');
    const winnerIndicator = document.getElementById('winnerIndicator');

    resultDiv.textContent = '';

    const winnerIndex = usePredeterminedWinner
        ? participants.indexOf(predeterminedWinner)
        : Math.floor(Math.random() * participants.length);

    const finalWinner = participants[winnerIndex];

    let currentIndex = 0;
    const interval = setInterval(() => {
        nameDisplay.textContent = participants[currentIndex];
        currentIndex = (currentIndex + 1) % participants.length;
    }, 200);

    setTimeout(() => {
        clearInterval(interval);
        nameDisplay.textContent = finalWinner;

// Tambahkan kelas animasi untuk CSS transition (opsional)
nameDisplay.classList.add('animate');

// Efek bounce dan fade-in dengan Anime.js
anime({
    targets: '#nameDisplay',
    scale: [0.8, 1.2, 1],
    opacity: [0, 1],
    duration: 800,
    easing: 'easeOutElastic(1, .6)'
});

// Hapus kelas animasi setelah selesai agar bisa dipakai ulang
setTimeout(() => {
    nameDisplay.classList.remove('animate');
}, 1000);

        resultDiv.textContent = `Pemenangnya adalah: ${finalWinner}`;

        if (winnerIndicator) {
            winnerIndicator.style.opacity = 1;
            setTimeout(() => {
                winnerIndicator.style.opacity = 0;
            }, 2000);
        }

        // Reset agar undian berikutnya kembali acak
        predeterminedWinner = null;
        usePredeterminedWinner = false;
        isDrawing = false;
    }, 5000);
}
