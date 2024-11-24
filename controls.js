// BroadcastChannel for communication
const channel = new BroadcastChannel('timer_channel');

let intervals = [null, null];
let timers = [60, 60];
let currentIndex = 0; // Counter to track the current image index
let imagesAndAnswers = []; // Array to hold images and answers

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

// Function to start a timer and show a random image
function startTimer(timerId) {
  const otherTimerId = timerId === 1 ? 2 : 1;

  // Pause the other timer if it's running
  pauseTimer(otherTimerId);

  if (!intervals[timerId - 1]) {
    intervals[timerId - 1] = setInterval(() => {
      if (timers[timerId - 1] > 0) {
        timers[timerId - 1]--;
        updateDisplay(timerId);
      } else {
        clearInterval(intervals[timerId - 1]);
        intervals[timerId - 1] = null;
      }
    }, 1000);
  }

  // Show a image when the timer starts
  showSequentialImage();
}


// Function to pause a timer
function pauseTimer(timerId) {
  clearInterval(intervals[timerId - 1]);
  intervals[timerId - 1] = null;
}

// Function to reset both timers
function resetTimers() {
  // Pause both timers
  pauseTimer(1);
  pauseTimer(2);

  // Reset timers to their initial value
  timers = [60, 60];

  // Notify the display page to update the timer displays
  channel.postMessage({ timerId: 1, value: 60, action: "update" });
  channel.postMessage({ timerId: 2, value: 60, action: "update" });
    // Hide any displayed image and answer
  channel.postMessage({ action: "hideImage" });

  console.log("Timers have been reset.");
}

// Function to make the timer display turn red for 3 seconds
function turnRed(timerId) {
  // Notify the display to turn the timer red
  const audio = new Audio('./sounds/countdown3.mp3');
  audio.play();
  channel.postMessage({ action: "turnRed", timerId });

  console.log(`Timer ${timerId} turning red for 3 seconds.`);
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

// Function to show the answer corresponding to the current image
function showAnswer(timerId) {

    // Pause the timer
  if (intervals[timerId - 1]) {
    clearInterval(intervals[timerId - 1]);
    intervals[timerId - 1] = null;
  }
  // Notify the display page to show the answer
  channel.postMessage({ action: "showAnswer" });

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





