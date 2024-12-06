// BroadcastChannel for communication
const channel = new BroadcastChannel('timer_channel');

let intervals = [null, null];
let timers = [30, 30];
let currentIndex = 0; // Counter to track the current image index
let imagesAndAnswers = []; // Array to hold images and answers
let allowShowAnswerWhileRunning = [false, false]; // Tracks if "Turn Red" is active for each timer


// Fetch the JSON data
async function fetchImagesAndAnswers() {
  try {
    const response = await fetch('imagesAndAnswers.json');
    imagesAndAnswers = await response.json();
    console.log('Images and answers loaded:', imagesAndAnswers);
  } catch (error) {
    console.error('Error loading images and answers:', error);
  }
}
async function loadCategory(categoryName) {
  try {
    const response = await fetch('imagesAndAnswers.json'); // Fetch the single JSON file
    const data = await response.json();
    imagesAndAnswers = data[categoryName]; // Extract the specific category
    console.log(`Loaded category: ${categoryName}`, imagesAndAnswers);
    currentIndex = 0; // Reset index when category changes
  } catch (error) {
    console.error(`Error loading category ${categoryName}:`, error);
  }
}

// Call the fetch function on load

loadCategory();

function changeCategory(categoryName) {
  loadCategory(categoryName).then(() => {
    console.log(`Category changed to: ${categoryName}`);
    currentIndex = 0; // Reset the index for sequential selection
  });
}

// Function to send timer updates to the display page
function updateDisplay(timerId) {
  channel.postMessage({ timerId, value: timers[timerId - 1], action: "update" });
}


function showSequentialImage() {
  if (imagesAndAnswers.length === 0) {
    console.warn('No images available to display.');
    return;
  }

  // Select the current image and answer based on the index
  const currentImage = imagesAndAnswers[currentIndex];

  // Notify the display page to show the image and track the current image
  channel.postMessage({
    action: "showImage",
    imageSrc: currentImage.src,
    answer: currentImage.answer // Pass the answer for tracking
  });

  console.log(`Displaying image: ${currentImage.src}`);

  // Increment the index for the next call, looping back to the start if needed
  currentIndex = (currentIndex + 1) % imagesAndAnswers.length;
}

// Function to make the timer display turn red for 3 seconds
function turnRed(timerId) {
  // Allow "Show Answer" to work without pausing the timer
  allowShowAnswerWhileRunning[timerId - 1] = true;
  const audioA = new Audio('./sounds/countdown3.mp3');
  audioA.play();
  channel.postMessage({ action: "turnRed", timerId });


  // Send the show answer action
  if (imagesAndAnswers.length > 0) {
    const currentImage = imagesAndAnswers[currentIndex];
    channel.postMessage({
      action: "showAnswer",
      answer: currentImage.answer,
    });
    console.log(`Turn Red and Show Answer triggered for Timer ${timerId}`);
  } else {
    console.warn("No images available for Turn Red and Show Answer.");
  }
  // Clear the red effect after 3 seconds
  setTimeout(() => {
    allowShowAnswerWhileRunning[timerId - 1] = false;
    console.log(`Turn Red effect cleared for Timer ${timerId}.`);
  }, 3000);
}

// Function to show the answer corresponding to the current image
function showAnswer(timerId) {

  const audio = new Audio('./sounds/correctanswer.mp3');
  audio.play();
  if (allowShowAnswerWhileRunning[timerId - 1]) {
    // During "Turn Red," show the answer without pausing the timer
    channel.postMessage({ action: "showAnswer" });
    console.log(`Answer shown for Timer ${timerId} while running (Turn Red active).`);
    return;
  }

  // Default behavior: Pause the timer and show the answer
  if (intervals[timerId - 1]) {
    clearInterval(intervals[timerId - 1]);
    intervals[timerId - 1] = null;
  }
  channel.postMessage({ action: "showAnswer" });
  console.log(`Answer shown for Timer ${timerId} after pausing.`);
}

// Function to reset both timers
function resetTimers() {
  pauseTimer(1);
  pauseTimer(2);

  // Reset timers to their initial value
  timers = [30, 30];

  // Reset all flags
  allowShowAnswer = [false, false];
  allowShowAnswerWhileRunning = [false, false];

  // Notify the display page to update the timer displays
  channel.postMessage({ timerId: 1, value: 30, action: "update" });
  channel.postMessage({ timerId: 2, value: 30, action: "update" });
  //     // Hide any displayed image and answer
  channel.postMessage({ action: "hideImage" });
  console.log("Timers have been reset.");
}

// Countdown function
function startCountdown() {
  let countdownValue = 3;

  // Notify display.html to show the initial countdown value
  channel.postMessage({ action: "updateCountdown", value: countdownValue });

  const audio = new Audio('./sounds/preview.mp3');
  audio.play();

  const interval = setInterval(() => {
    countdownValue--;

    if (countdownValue > 0) {
      // Send the updated countdown value
      channel.postMessage({ action: "updateCountdown", value: countdownValue });
    } else {
      clearInterval(interval);

      // Notify that the countdown is complete
      channel.postMessage({ action: "countdownComplete" });
    }
  }, 1000); // Update every second
}

// Trigger countdown when the button is clicked
function triggerCountdown() {
  console.log("Countdown triggered.");
  startCountdown(); // Start the countdown
}
function triggerReset() {
  console.log("Reset action triggered.");
  channel.postMessage({ action: "resetDisplay" }); // Send reset message
};
