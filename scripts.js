let censoredWords = [];
let highlightedWords = [];
let importantNames = [];

let censoredColor = 'black';
let highlightedColor = 'red';
let importantNamesColor = 'blue';

let fontSize = 16;
let fadeRate = 500;
let isMuted = false;
let isNewSentence = true;
let fadeOutTimeout;

const transcript = document.getElementById('transcript');
const menu = document.getElementById('menu');

// Function to convert text to sentence case
const toSentenceCase = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Function to fade out text after a delay
const fadeOutText = () => {
    transcript.style.opacity = 0;
};

// Function to highlight words based on multiple categories
const highlightMultipleWords = (text) => {
    // Highlight censored words
    if (censoredWords.length > 0) {
        const censoredPattern = censoredWords.map(word => `\\b${word}\\b`).join('|');
        const censoredRegex = new RegExp(censoredPattern, 'gi');
        text = text.replace(censoredRegex, (matched) => `<span style="color: ${censoredColor};">${matched}</span>`);
    }

    // Highlight highlighted words
    if (highlightedWords.length > 0) {
        const highlightedPattern = highlightedWords.map(word => `\\b${word}\\b`).join('|');
        const highlightedRegex = new RegExp(highlightedPattern, 'gi');
        text = text.replace(highlightedRegex, (matched) => `<span style="color: ${highlightedColor};">${matched}</span>`);
    }

    // Highlight important names
    if (importantNames.length > 0) {
        const importantPattern = importantNames.map(word => `\\b${word}\\b`).join('|');
        const importantRegex = new RegExp(importantPattern, 'gi');
        text = text.replace(importantRegex, (matched) => `<span style="color: ${importantNamesColor};">${matched}</span>`);
    }

    return text;
};

// Handle transcription and apply formatting
const handleTranscription = (event) => {
    if (!isMuted) {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            let transcriptText = event.results[i][0].transcript.trim();

            if (event.results[i].isFinal) {
                if (isNewSentence) {
                    transcriptText = toSentenceCase(transcriptText);
                }
                finalTranscript += transcriptText + '. ';
                isNewSentence = true;
            } else {
                interimTranscript += transcriptText + ' ';
                isNewSentence = false;
            }
        }

        let formattedText = finalTranscript + interimTranscript;
        formattedText = highlightMultipleWords(formattedText); // Use updated function
        transcript.innerHTML = formattedText;
        transcript.style.fontSize = `${fontSize}px`;
        transcript.style.opacity = 1;
        clearTimeout(fadeOutTimeout);
        fadeOutTimeout = setTimeout(fadeOutText, fadeRate);
    }
};

// Listen for the 'w' key to bring up the menu for setting flagged words and colors
window.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === 'w') {
        const menuChoice = prompt("Choose a category to modify: \n1: Censored Words \n2: Highlighted Words \n3: Important Names");

        if (menuChoice === '1') {
            const words = prompt("Enter censored words (comma-separated):");
            if (words) censoredWords = words.split(',').map(word => word.trim());
            const color = prompt("Enter a color for censored words (name or hex):", censoredColor);
            if (color) censoredColor = color.trim();
        } else if (menuChoice === '2') {
            const words = prompt("Enter highlighted words (comma-separated):");
            if (words) highlightedWords = words.split(',').map(word => word.trim());
            const color = prompt("Enter a color for highlighted words (name or hex):", highlightedColor);
            if (color) highlightedColor = color.trim();
        } else if (menuChoice === '3') {
            const words = prompt("Enter important names (comma-separated):");
            if (words) importantNames = words.split(',').map(word => word.trim());
            const color = prompt("Enter a color for important names (name or hex):", importantNamesColor);
            if (color) importantNamesColor = color.trim();
        }

        // Save in localStorage for persistence
        localStorage.setItem('censoredWords', JSON.stringify(censoredWords));
        localStorage.setItem('highlightedWords', JSON.stringify(highlightedWords));
        localStorage.setItem('importantNames', JSON.stringify(importantNames));
        localStorage.setItem('censoredColor', censoredColor);
        localStorage.setItem('highlightedColor', highlightedColor);
        localStorage.setItem('importantNamesColor', importantNamesColor);

        // Update menu display
        updateMenu();
    }
});

// Retrieve stored data for persistence
const storedCensoredWords = localStorage.getItem('censoredWords');
const storedHighlightedWords = localStorage.getItem('highlightedWords');
const storedImportantNames = localStorage.getItem('importantNames');
const storedCensoredColor = localStorage.getItem('censoredColor');
const storedHighlightedColor = localStorage.getItem('highlightedColor');
const storedImportantNamesColor = localStorage.getItem('importantNamesColor');

if (storedCensoredWords) censoredWords = JSON.parse(storedCensoredWords);
if (storedHighlightedWords) highlightedWords = JSON.parse(storedHighlightedWords);
if (storedImportantNames) importantNames = JSON.parse(storedImportantNames);

if (storedCensoredColor) censoredColor = storedCensoredColor;
if (storedHighlightedColor) highlightedColor = storedHighlightedColor;
if (storedImportantNamesColor) importantNamesColor = storedImportantNamesColor;

// Update menu display with current settings
const updateMenu = () => {
    menu.innerHTML = `Font Size: ${fontSize}px | Fade Rate: ${fadeRate}ms <br> Censored Color: ${censoredColor}, Highlighted Color: ${highlightedColor}, Important Names Color: ${importantNamesColor}`;
    menu.classList.add('visible');
    setTimeout(() => menu.classList.remove('visible'), 2000);
};

// Increase/decrease font size and fade rate with arrow keys
window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
        fontSize += 1;
    } else if (event.key === 'ArrowDown') {
        fontSize -= 1;
    } else if (event.key === 'ArrowLeft') {
        fadeRate += 100;
    } else if (event.key === 'ArrowRight') {
        fadeRate -= 100;
    }
    updateMenu();
});
