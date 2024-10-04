let textBox = document.getElementById('transcription-text');
let recognition = null;

// Request microphone permission and initialize speech recognition
async function startTranscription() {
  try {
    console.log("Requesting microphone permission...");
    await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log("Microphone permission granted.");

    // Create a new SpeechRecognition instance
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = true; // Capture interim results
    recognition.lang = 'en-US';

    // Debug: Log when recognition starts
    recognition.onstart = () => {
      console.log("Speech recognition started.");
    };

    // Handle transcription results
    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        // Get final transcription
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript;
        }
      }

      // Debugging: Log the transcript
      console.log("Transcript: ", transcript);

      if (transcript) {
        displayText(transcript); // Display the transcript
      }
    };

    // Handle errors
    recognition.onerror = (event) => {
      console.error("Speech recognition error: ", event.error);
    };

    // Start recognition
    recognition.start();
    console.log("Speech recognition process started.");
  } catch (error) {
    console.error
