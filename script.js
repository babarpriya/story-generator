document.getElementById('storyForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  // Get form values
  const genre = document.getElementById('genre').value;
  const setting = document.getElementById('setting').value;
  const character = document.getElementById('character').value;
  const traits = Array.from(document.getElementById('traits').selectedOptions).map(option => option.value);
  const theme = document.getElementById('theme').value;
  const length = document.getElementById('length').value;

  // Get the output element
  const storyOutput = document.getElementById('storyOutput');

  // Show loading state
  storyOutput.innerText = "Generating story...";
  storyOutput.style.opacity = 0.7; // Fade the text slightly
  storyOutput.style.transition = 'opacity 0.3s';

  // Disable the button to prevent multiple submissions
  const generateBtn = document.querySelector('.generate-btn');
  generateBtn.disabled = true;
  generateBtn.innerText = 'Generating...';

  try {
    // Send data to the backend
    const response = await fetch('http://localhost:3000/api/generate-story', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ genre, setting, character, traits, theme, length })
    });

    const data = await response.json();

    // Display the generated story
    if (data.story) {
      storyOutput.innerText = data.story;
    } else {
      storyOutput.innerText = 'No story received.';
    }

  } catch (error) {
    console.error(error);
    storyOutput.innerText = 'Error generating story. Please try again.';
  } finally {
    // Re-enable the button and reset its text
    generateBtn.disabled = false;
    generateBtn.innerText = 'Generate Story';

    // Restore the opacity of the output text
    storyOutput.style.opacity = 1;
  }
});

