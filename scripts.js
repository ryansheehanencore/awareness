let wordCategories = {
    'spicy': { words: [], color: 'red' },
    'important': { words: [], color: 'blue' },
    'names': { words: [], color: 'green' },
    'boop': { words: [], behavior: 'rainbow' },  // Added 'super' category
};

// Prompt to pick a category, enter words, and set color
///window.addEventListener('keydown', (event) => {
///    if (event.key.toLowerCase() === 'c') {
///        const category = prompt("Choose a category: 'spicy', 'important', or 'names'");
///        if (category && wordCategories[category]) {
///            const input = prompt("Enter a list of words to highlight (comma separated):");
///            if (input) {
///                wordCategories[category].words = input.split(',').map(word => word.trim());
///                const colorInput = prompt(`Enter a color for ${category} words (e.g., 'red', '#ff0000'):`);
///                if (colorInput) {
///                    wordCategories[category].color = colorInput.trim();
///                }
///                localStorage.setItem('wordCategories', JSON.stringify(wordCategories));
///            }
///        } else {
///            alert("Invalid category! Please choose from 'spicy', 'important', or 'names'.");
///        }
///    }
///});

window.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === 'c') {
        let category = prompt("Choose a category: 'spicy', 'important', 'names', or 'boop'").trim().toLowerCase(); 
        // Trim and convert to lowercase for comparison

        // Check if the category exists in wordCategories, using lowercase comparison
        if (category && Object.keys(wordCategories).map(cat => cat.toLowerCase()).includes(category)) {
            const input = prompt("Enter a list of words to highlight (comma separated):");
            if (input) {
                wordCategories[category].words = input.split(',').map(word => word.trim());

                // Skip the color input for 'super' since it has a special behavior
                if (category !== 'boop') {
                    const colorInput = prompt(`Enter a color for ${category} words (e.g., 'red', '#ff0000'):`);
                    if (colorInput) {
                        wordCategories[category].color = colorInput.trim();
                    }
                }

                localStorage.setItem('wordCategories', JSON.stringify(wordCategories));
            }
        } else {
            alert("Invalid category! Please choose from 'spicy', 'important', 'names', or 'boop'.");
        }
    }
});



const highlightWords = (text) => {
    let highlightedText = text;

    Object.keys(wordCategories).forEach(category => {
        const { words, color, behavior } = wordCategories[category];
        if (words.length === 0) return;

        const pattern = words.map(word => `\\b${word}\\b`).join('|');
        const regex = new RegExp(pattern, 'gi');

        if (category === 'boop') {
            // Special case for 'super' category with rainbow effect
            highlightedText = highlightedText.replace(regex, (matched) => 
                `<span class="exploding-text">${matched}</span>`
            );
        } else {
            // Default highlight behavior for other categories
            highlightedText = highlightedText.replace(regex, (matched) => 
                `<span style="color: ${color};">${matched}</span>`
            );
        }
    });

    return highlightedText;
};

///const highlightWords = (text) => {
///    let highlightedText = text;
///
///    Object.keys(wordCategories).forEach(category => {
 ///       const { words, color } = wordCategories[category];
    ///    if (words.length === 0) return;
    ///    const pattern = words.map(word => `\\b${word}\\b`).join('|');
    ///    const regex = new RegExp(pattern, 'gi');
    ///    highlightedText = highlightedText.replace(regex, (matched) => `<span style="color: ${color};">${matched}</span>`);
  ///  });
///
   /// return highlightedText;
///};

// Load stored categories from localStorage if available
const storedCategories = localStorage.getItem('wordCategories');
if (storedCategories) {
    wordCategories = JSON.parse(storedCategories);
}

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
        formattedText = highlightWords(formattedText); // Apply the highlights here
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
        message.innerHTML = "Press 'M' to toggle transcription";
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
