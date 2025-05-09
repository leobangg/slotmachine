const handleButton = document.getElementById('handle');
const reels = document.querySelectorAll('.reel');
const message = document.getElementById('message');
const slotMachine = document.querySelector('.slot-machine');
const creditDisplay = document.getElementById('credits');

// Sound elements
const slotSound = document.getElementById('slot-sound');
const coinSound = document.getElementById('coin-sound');

// Landing screen logic
const landing = document.getElementById('landing');
const startBtn = document.getElementById('start-button');

startBtn.addEventListener('click', () => {
    landing.style.display = 'none';
});

// Slot images
const images = ['./imgs/seven.png', './imgs/cherry.png', './imgs/lemon.png'];

let confettiInterval;
let credits = 5;

// Update credit display
function updateCredits() {
    creditDisplay.textContent = `CREDITS: ${credits}`;

    if (credits < 0) {
        creditDisplay.classList.add('in-debt');
        creditDisplay.textContent += ' 💀 DEBT';
    } else {
        creditDisplay.classList.remove('in-debt');
    }
}

// Set default reel images
function InitializeReels() {
    reels.forEach(reel => {
        reel.innerHTML = `<img src="${images[0]}" alt="default">`;
    });
}

// Reel spinning logic
function spinReel(reel, duration) {
    let index = Math.floor(Math.random() * images.length);

    return new Promise(resolve => {
        let startTime = Date.now();
        const interval = 100;

        const spin = setInterval(() => {
            index = (index + 1) % images.length;
            reel.innerHTML = `<img src="${images[index]}" alt="${images[index]}">`;

            if (Date.now() - startTime >= duration) {
                clearInterval(spin);
                resolve(images[index]);
            }
        }, interval);
    });
}

// Confetti FX
function startConfetti() {
    confettiInterval = setInterval(() => {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        document.body.appendChild(confetti);

        setTimeout(() => {
            confetti.remove();
        }, 1500);
    }, 200);
}

function stopConfetti() {
    clearInterval(confettiInterval);
}

// Game logic
async function startGame() {
    credits -= 1;
    updateCredits();

    // Play coin sound (button press) and slot music
    coinSound.currentTime = 0;
    coinSound.play();

    slotSound.currentTime = 0;
    slotSound.play();

    message.textContent = '';
    handleButton.disabled = true;
    slotMachine.classList.remove('win', 'loss');
    stopConfetti();
    InitializeReels();

    const results = await Promise.all([
        spinReel(reels[0], 2000),
        spinReel(reels[1], 3000),
        spinReel(reels[2], 4000),
    ]);

    slotSound.pause();
    slotSound.currentTime = 0;

    if (results[0] === results[1] && results[1] === results[2]) {
        message.textContent = 'YOU WIN!';
        slotMachine.classList.add('win');
        startConfetti();
        credits += 5;
    } else {
        message.textContent = 'TRY AGAIN';
        slotMachine.classList.add('loss');
    }

    updateCredits();
    handleButton.disabled = false;
}

// Init
updateCredits();
InitializeReels();
handleButton.addEventListener('click', startGame);
