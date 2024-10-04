let fontSize = 50; // Default font size
let fadeDuration = 500; // Default fade duration in ms
let fadeTimeout; // Timeout to manage fade delay
let textBox = document.getElementById('transcription-text');
let recognition = null;

// Debugging: Log that the script has loaded
console.log("Script loaded and ready to run.");

// Request microphone permission and initialize speech recognition
async function startTranscription() {
  try {
    console.log("Requesting microphone permission...");
    await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log("Microphone permission granted.");
    
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          transcript = event.results[i][0].transcript;
          console.log("Transcription: ", transcript); // Debugging: Log the transcription
        }
      }

      if (transcript) {
        displayText(transcript);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error: ", event.error);
    };

    recognition.start();
    console.log("Speech recognition started.");
  } catch (error) {
    console.error("Microphone access denied or unavailable", error);
  }
}

// Display the transcribed text and manage fade logic
function displayText(text) {
  clearTimeout(fadeTimeout);
  textBox.style.opacity = '1'; // Ensure the text is visible
  textBox.textContent = formatText(text);

  // Set a timeout to fade out the text after 500ms of inactivity
  fadeTimeout = setTimeout(() => {
    textBox.style.transition = `opacity ${fadeDuration}ms`;
    textBox.style.opacity = '0';
  }, 500); // Pause duration before fade
}

// Helper function to format text with proper sentence casing
function formatText(text) {
  return text.charAt(0).toUpperCase() + text.slice(1) + '.';
}

// Handle font size and fade duration adjustments via arrow keys
document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowUp':
      fontSize += 5;
      textBox.style.fontSize = `${fontSize}px`;
      break;
    case 'ArrowDown':
      fontSize -= 5;
      if (fontSize < 20) fontSize = 20; // Set a minimum font size
      textBox.style.fontSize = `${fontSize}px`;
      break;
    case 'ArrowLeft':
      fadeDuration += 100;
      break;
    case 'ArrowRight':
      fadeDuration -= 100;
      if (fadeDuration < 100) fadeDuration = 100; // Set a minimum fade duration
      break;
    default:
      break;
  }
});

// Initialize transcription on page load
window.onload = () => {
  console.log("Page loaded, initializing transcription...");
  startTranscription();
};
