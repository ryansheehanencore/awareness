let transcriptionDiv = document.getElementById('transcription');
let promptDiv = document.getElementById('prompt');
let menuDiv = document.getElementById('menu');
let fontSizeDisplay = document.getElementById('fontSizeDisplay');
let fadeTimeDisplay = document.getElementById('fadeTimeDisplay');

let fontSize = 50;
let fadeOutTime = 500;
let pauseDuration = 300; // Pause time for sentence completion (adjustable)
let transcription = "";
let lineCount = 0;

// Update font size and fade time in the menu
function updateMenuDisplay() {
    fontSizeDisplay.innerText = fontSize;
    fadeTimeDisplay.innerText = fadeOutTime;
}

// Handle keyboard inputs for settings
function handleKeyInput(event) {
    switch (event.key) {
        case "ArrowUp":
            fontSize += 5;
            transcriptionDiv.style.fontSize = fontSize + "px";
            updateMenuDisplay();
            break;
        case "ArrowDown":
            if (fontSize > 10) fontSize -= 5;
            transcriptionDiv.style.fontSize = fontSize + "px";
            updateMenuDisplay();
            break;
        case "ArrowLeft":
            if (fadeOutTime > 100) fadeOutTime -= 100;
            updateMenuDisplay();
            break;
        case "ArrowRight":
            fadeOutTime += 100;
            updateMenuDisplay();
            break;
    }
}

// Start the transcription process
function startTranscription() {
    transcriptionDiv.classList.remove('hidden');
    menuDiv.classList.remove('hidden');
    promptDiv.classList.add('hidden');

    // Begin voice recognition
    let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
        let interimTranscription = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
            let transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                addText(transcript.trim());
            } else {
                interimTranscription += transcript;
            }
        }
    };

    recognition.start();
}

// Add the text to the screen and handle fade-out logic
function addText(text) {
    let newLine = document.createElement("div");
    newLine.innerText = text;
    newLine.style.opacity = 1;
    transcriptionDiv.appendChild(newLine);
    
    // Manage line count and fading out old lines
    lineCount++;
    if (lineCount > 3) {
        let firstLine = transcriptionDiv.firstChild;
        fadeOut(firstLine);
        lineCount--;
    }
}

// Fade out lines gradually
function fadeOut(element) {
    let opacity = 1;
    let fadeInterval = setInterval(() => {
        opacity -= 0.05;
        element.style.opacity = opacity;
        if (opacity <= 0) {
            clearInterval(fadeInterval);
            transcriptionDiv.removeChild(element);
        }
    }, fadeOutTime / 20); // Adjusting the fade time interval
}

// Key event listener
document.addEventListener('keydown', (event) => {
    if (event.key === "M" || event.key === "m") {
        startTranscription();
    } else {
        handleKeyInput(event);
    }
});
