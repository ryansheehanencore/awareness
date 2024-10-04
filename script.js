alert("Script loaded successfully");

window.onload = () => {
  console.log("Page loaded, starting transcription...");
  startTranscription();
};

async function startTranscription() {
  console.log("Requesting microphone access...");
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log("Microphone access granted.");
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          transcript = event.results[i][0].transcript;
        }
      }

      if (transcript) {
        console.log("Transcribed text: ", transcript); // Log the transcribed text
        displayText(transcript);
      }
    };

    recognition.start();
    console.log("Speech recognition started.");
  } catch (error) {
    console.error("Microphone access denied or unavailable", error);
  }
}
console.log("Script loaded successfully");
function displayText(text) {
  console.log("Displaying text: ", text); // Log the text to be displayed
  clearTimeout(fadeTimeout);
  textBox.style.opacity = '1'; // Ensure the text is visible
  textBox.textContent = formatText(text);

  fadeTimeout = setTimeout(() => {
    textBox.style.opacity = '0'; // Fade out
  }, 500); // Pause duration before fade
}
