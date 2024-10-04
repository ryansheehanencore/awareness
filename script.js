console.log("Page script loaded.");

// Add a basic check if the page is loaded and event listeners are active.
window.onload = () => {
  console.log("Page is fully loaded.");

  // Check if the element is correctly identified
  let textBox = document.getElementById('transcription-text');
  if (textBox) {
    console.log("TextBox element found!");
  } else {
    console.error("TextBox element not found.");
  }

  // Set up basic key press detection for testing
  document.addEventListener('keydown', (event) => {
    console.log("Key pressed: " + event.key);
  });
};
