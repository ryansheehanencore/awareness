const transcriptionElement = document.getElementById('transcription');

// Function to start transcription
function startTranscription() {
  const recognition = new webkitSpeechRecognition();
  recognition.lang = 'en-US'; // Set language to English (US)

  recognition.onresult = (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript;
    transcriptionElement.textContent += transcript;
    // Implement logic for fading out old text and adjusting line breaks
  };

  recognition.onerror = (error) => {
    console.error('Speech recognition error:', error);
  };

  recognition.start();
}

// Event listener for "M" key press
document.addEventListener('keydown', (event) => {
  if (event.key === 'M') {
    startTranscription();
  }
});
