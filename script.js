const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
const currentTheme = localStorage.getItem('theme');

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
  
    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
        document.body.classList.add('dark-mode');
    }
}

function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        document.body.classList.add('dark-mode');
    }
    else {        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        document.body.classList.remove('dark-mode');
    }    
}

toggleSwitch.addEventListener('change', switchTheme, false);

let questions = [];
let originalQuestions = [];
let predeterminedQuestion = null;
let usePredeterminedQuestion = false;
let isDrawing = false;

document.getElementById('fileInput').addEventListener('change', handleFile);
document.getElementById('startButton').addEventListener('click', startDraw);

document.querySelector('h1').addEventListener('click', () => {
    setQuestionByIndex(1); // Trigger pemenang 1
});

document.querySelector('.logo').addEventListener('click', () => {
    setQuestionByIndex(2); // Trigger pemenang 2
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'p') setQuestionByIndex(0);
    if (event.key === 'o') setQuestionByIndex(2);
});

function handleFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        originalQuestions = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }).flat().filter(name => name);
        questions = [...originalQuestions];
        displayQuestionsInNameDisplay();
    };

    reader.readAsArrayBuffer(file);
}

function displayQuestionsInNameDisplay() {
    const nameDisplay = document.getElementById('nameDisplay');
    if (questions.length > 0) {
        nameDisplay.textContent = "Siap untuk mengundi pertanyaan berikutnya.";
    } else if (originalQuestions.length > 0 && questions.length === 0) {
        nameDisplay.textContent = "Semua pertanyaan telah diundi! Tekan reset untuk memulai lagi.";
    } else {
        nameDisplay.textContent = "Unggah file Excel berisi pertanyaan untuk memulai.";
    }
}

function setQuestionByIndex(index) {
    if (questions.length > index) {
        predeterminedQuestion = questions[index];
        usePredeterminedQuestion = true;
        console.log(`Pertanyaan ditentukan: ${predeterminedQuestion}`);
    }
}

function resetDraw() {
    questions = [...originalQuestions];
    displayQuestionsInNameDisplay();
    console.log("Daftar pertanyaan telah direset.");
}

document.getElementById('resetButton').addEventListener('click', resetDraw);

function startDraw() {
    if (isDrawing || questions.length === 0) return;

    isDrawing = true;
    const nameDisplay = document.getElementById('nameDisplay');
    const winnerIndicator = document.getElementById('winnerIndicator');

    const questionIndex = usePredeterminedQuestion
        ? questions.indexOf(predeterminedQuestion)
        : Math.floor(Math.random() * questions.length);

    const finalQuestion = questions[questionIndex];

    let currentIndex = 0;
    const interval = setInterval(() => {
        nameDisplay.textContent = questions[currentIndex];
        currentIndex = (currentIndex + 1) % questions.length;
    }, 200);

    setTimeout(() => {
        clearInterval(interval);
        nameDisplay.textContent = `"${finalQuestion}"`;

        // Hapus pertanyaan yang sudah terpilih
        questions.splice(questionIndex, 1);

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

        if (winnerIndicator) {
            winnerIndicator.style.opacity = 1;
            setTimeout(() => {
                winnerIndicator.style.opacity = 0;
            }, 2000);
        }

        // Jalankan confetti saat pemenang diumumkan
        launchConfetti();

        // Reset agar undian berikutnya kembali acak
        predeterminedQuestion = null;
        usePredeterminedQuestion = false;
        isDrawing = false;
    }, 5000);
}

function launchConfetti() {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { 
        startVelocity: 40,  // kecepatan awal lebih tinggi
        spread: 360, 
        ticks: 60, 
        zIndex: 1000,
        scalar: 2,       // ukuran partikel 1.5x lebih besar dari default
        gravity: 0.6       // gravitasi sedikit dikurangi agar partikel melayang lebih lama
    };
    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }
    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
            clearInterval(interval);
            return;
        }
        const particleCount = 50 * (timeLeft / duration);
        // Confetti dari kiri atas
        confetti(Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0, 0.3), y: Math.random() - 0.2 }
        }));
        // Confetti dari kanan atas
        confetti(Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.7, 1), y: Math.random() - 0.2 }
        }));
    }, 250);
}
