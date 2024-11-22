// BroadcastChannel for communication
const channel = new BroadcastChannel('timer_channel');

let intervals = [null, null];
let timers = [60, 60];
let imagesAndAnswers = []; // Array to hold images and answers

// // Array of image paths and their corresponding answers
// const imagesAndAnswers = [
//   { src: "./images/hiking3.jpg", answer: "Answer 1 for Image 1" },
//   { src: "./images/iceland.jpg", answer: "Answer 2 for Image 2" },
//   { src: "./images/northern1.jpeg", answer: "Answer 3 for Image 3" },
//   { src: "./images/image4.jpg", answer: "Answer 4 for Image 4" },
//   { src: "./images/image5.jpg", answer: "Answer 5 for Image 5" }
// ];

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

// Call the fetch function on load
fetchImagesAndAnswers();

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

  // Show a random image when the timer starts
  showRandomImage();
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
  channel.postMessage({ action: "turnRed", timerId });

  console.log(`Timer ${timerId} turning red for 3 seconds.`);
}

// Updated Function to Show a Random Image
function showRandomImage() {

  if (imagesAndAnswers.length === 0) {
    console.warn('No images available to display.');
    return;
  }
  const randomIndex = Math.floor(Math.random() * imagesAndAnswers.length);
  const randomImage = imagesAndAnswers[randomIndex];

  // Notify the display page to show the image and track the current image
  channel.postMessage({
    action: "showImage",
    imageSrc: randomImage.src,
    answer: randomImage.answer // Pass the answer for tracking
  });

  console.log(`Showing image: ${randomImage.src}`);
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



