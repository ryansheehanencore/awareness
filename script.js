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

console.log("Requesting microphone access...");
if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
  console.error("Speech recognition not supported in this browser.");
  return;
}
recognition.onstart = () => {
  console.log("Speech recognition service has started.");
};

recognition.onend = () => {
  console.log("Speech recognition service has ended.");
};

recognition.onresult = (event) => {
  console.log("Speech recognition result received.");
  let transcript = '';
  for (let i = event.resultIndex; i < event.results.length; ++i) {
    if (event.results[i].isFinal) {
      transcript = event.results[i][0].transcript;
    }
  }

  if (transcript) {
    console.log("Transcribed text: ", transcript);
    displayText(transcript);
  }
};

function displayText(text) {
  console.log("Displaying text: ", text);
  clearTimeout(fadeTimeout);
  textBox.style.opacity = '1'; // Ensure the text is visible
  textBox.textContent = formatText(text); // This should update the text in the HTML

  // Set a timeout to fade out the text after 500ms of inactivity
  fadeTimeout = setTimeout(() => {
    textBox.style.opacity = '0';
  }, 500); // Pause duration before fade
}


function displayText(text) {
  console.log("Displaying text: ", text); // Log the text to be displayed
  clearTimeout(fadeTimeout);
  textBox.style.opacity = '1'; // Ensure the text is visible
  textBox.textContent = formatText(text);

  fadeTimeout = setTimeout(() => {
    textBox.style.opacity = '0'; // Fade out
  }, 500); // Pause duration before fade
}
#transcription-text {
  font-size: 50px; /* Default font size */
  color: white; /* Ensure the color is white */
  border: 1px solid red; /* Temporary border to see if it's visible */
}
