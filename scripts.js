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
            if (words) censoredWords = words.split(',').ma
