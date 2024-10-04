// Constants
const FADE_IN_DURATION = 125;
const FADE_OUT_DURATION = 1000;
const PAUSE_DURATION = 500;
const MENU_DURATION = 1000;
const FONT_SIZE_STEP = 2;
const FADE_RATE_STEP = 50;

// Variables
let isMuted = true;
let transcriptionElement = document.getElementById('transcription');
let speechRecognition = new webkitSpeechRecognition();
let currentPhrase = '';
let fadeTimeout;
let menuTimeout;
let fontSize = 24;
let fadeRate = FADE_OUT_DURATION;

// Functions
function startSpeechRecognition() {
    speechRecognition.start();
}

function stopSpeechRecognition() {
    speechRecognition.stop();
}

function handleSpeechEvent(event) {
    if (event.type === 'result') {
        const transcript = event.results[event.results.length - 1][0].transcript;
        currentPhrase += transcript;
        transcriptionElement.textContent = currentPhrase;
        clearTimeout(fadeTimeout);
        fadeTimeout = setTimeout(() => {
            transcriptionElement.style.opacity = 0;
            setTimeout(() => {
                transcriptionElement.textContent = '';
                currentPhrase = '';
            }, FADE_OUT_DURATION);
        }, PAUSE_DURATION);
    }
}

function handleKeyPress(event) {
    if (event.key === 'M') {
        isMuted = !isMuted;
        if (!isMuted) {
            startSpeechRecognition();
        } else {
            stopSpeechRecognition();
        }
    } else if (event.key === 'ArrowUp') {
        fontSize += FONT_SIZE_STEP;
        transcriptionElement.style.fontSize = fontSize + 'px';
        showMenu();
    } else if (event.key === 'ArrowDown') {
        fontSize -= FONT_SIZE_STEP;
        transcriptionElement.style.fontSize = fontSize + 'px';
        showMenu();
    } else if (event.key === 'ArrowLeft') {
        fadeRate -= FADE_RATE_STEP;
        showMenu();
    } else if (event.key === 'ArrowRight') {
        fadeRate += FADE_RATE_STEP;
        showMenu();
    }
}

function showMenu() {
    const menu = document.createElement('div');
    menu.textContent = `Up/Down Font Size: ${fontSize}  Left/Right Fade Rate: ${fadeRate}`;
    menu.style.position = 'absolute';
    menu.style.top = '0';
    menu.style.left = '0';
    menu.style.backgroundColor = 'black';
    menu.style.color = 'white';
    document.body.appendChild(menu);
    clearTimeout(menuTimeout);
    menuTimeout = setTimeout(() => {
        menu.remove();
    }, MENU_DURATION);
}

// Event listeners
speechRecognition.onresult = handleSpeechEvent;
window.addEventListener('keypress', handleKeyPress);

// Initial microphone permission request
if ('webkitSpeechRecognition' in window) {
    startSpeechRecognition();
} else {
    console.log('Web Speech API is not supported.');
}
