let highlightColor = 'red'; // Default highlight color

window.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === 'b') {
        const colorInput = prompt("Enter a color name or hex code for the highlights (e.g., 'red', '#ff0000'):");
        if (colorInput) {
            highlightColor = colorInput.trim();
            localStorage.setItem('highlightColor', highlightColor);
        }
    }
});

let highlightedWords = [];

const highlightWords = (text) => {
    if (highlightedWords.length === 0) return text;
    const pattern = highlightedWords.map(word => `\\b${word}\\b`).join('|');
    const regex = new RegExp(pattern, 'gi');
    return text.replace(regex, (matched) => `<span style="color: ${highlightColor};">${matched}</span>`);
};

window.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === 'c') {
        const input = prompt("Enter a list of words to highlight (comma separated):");
        if (input) {
            highlightedWords = input.split(',').map(word => word.trim());
            localStorage.setItem('highlightedWords', JSON.stringify(highlightedWords));
        }
    }
});

const storedWords = localStorage.getItem('highlightedWords');
const storedColor = localStorage.getItem('highlightColor');

if (storedWords) {
    highlightedWords = JSON.parse(storedWords);
}

if (storedColor) {
    highlightColor = storedColor;
}

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        if (isMuted) {
            toggleTranscription();
        }
    }
});

let isMuted = true;
let transcript = document.getElementById('transcription');
let message = document.getElementById('message');
let menu = document.getElementById('menu');
let fontSize = 50;
let fadeRate = 1500;
let touchStartX = 0;
let touchStartY = 0;

const updateMenu = () => {
    menu.innerHTML = `Up/Down Font Size: ${fontSize} | Left/Right Fade Rate: ${fadeRate}ms`;
    menu.classList.add('visible');
    setTimeout(() => menu.classList.remove('visible'), 1000);
};

const fadeOutText = () => {
    transcript.style.transition = `opacity ${fadeRate}ms`;
    transcript.style.opacity = 0;
};

let isNewSentence = true;

const isQuestion = (str) => {
    const questionWords = ['what', 'why', 'how', 'where', 'when', 'who', 'which', 'can'];
    const lowerStr = str.toLowerCase();
    return questionWords.some(word => lowerStr.startsWith(word));
};

const toSentenceCase = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const formatText = (text) => {
    let sentences = text.split('. ').filter(Boolean);
    let formattedText = sentences.map(sentence => {
        sentence = toSentenceCase(sentence.trim());
        if (isQuestion(sentence)) {
            return sentence + '?';
        }
        return sentence + '.';
    });

    let paragraphLength = 3;
    let paragraphs = [];
    for (let i = 0; i < formattedText.length; i += paragraphLength) {
        paragraphs.push(formattedText.slice(i, i + paragraphLength).join(' '));
    }

    return paragraphs.join('\n\n');
};

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

        let formattedText = formatText(finalTranscript + interimTranscript);
        formattedText = highlightWords(formattedText);
        transcript.innerHTML = formattedText;
        transcript.style.fontSize = `${fontSize}px`;
        transcript.style.opacity = 1;
        clearTimeout(fadeOutTimeout);
        fadeOutTimeout = setTimeout(fadeOutText, 500);
    }
};

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = true;
recognition.interimResults = true;
recognition.onresult = handleTranscription;

recognition.onerror = (event) => {
    console.error('Error occurred in recognition: ', event.error);
};

recognition.onend = () => {
    console.warn('Speech recognition service disconnected. Attempting to restart...');
    setTimeout(() => {
        if (!isMuted) {
            recognition.start();
            console.log('Speech recognition restarted.');
        }
    }, 1000);
};

let fadeOutTimeout;

const toggleTranscription = () => {
    isMuted = !isMuted;
    if (!isMuted) {
        recognition.start();
        transcript.innerHTML = 'Listening...';
        message.style.opacity = 0;
    } else {
        recognition.stop();
        transcript.innerHTML = '';
        message.innerHTML = "Press 'M' to start transcription";
        message.style.opacity = 1;
    }
};

document.getElementById('start-transcription').addEventListener('click', toggleTranscription);

window.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === 'm') {
        toggleTranscription();
    }

    if (event.key === 'ArrowUp') {
        fontSize += 2;
        updateMenu();
    }

    if (event.key === 'ArrowDown') {
        fontSize = Math.max(10, fontSize - 2);
        updateMenu();
    }

    if (event.key === 'ArrowRight') {
        fadeRate += 100;
        updateMenu();
    }

    if (event.key === 'ArrowLeft') {
        fadeRate = Math.max(500, fadeRate - 100);
        updateMenu();
    }
});

window.addEventListener('touchstart', (event) => {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
});

window.addEventListener('touchmove', (event) => {
    const touchEndX = event.touches[0].clientX;
    const touchEndY = event.touches[0].clientY;
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    if (Math.abs(diffY) > Math.abs(diffX)) {
        if (diffY < 0) {
            fontSize += 2;
        } else {
            fontSize -= 2;
        }
        updateMenu();
    }

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0) {
            fadeRate = Math.max(500, fadeRate - 100);
        } else {
            fadeRate += 100;
        }
        updateMenu();
    }
});

updateMenu();
