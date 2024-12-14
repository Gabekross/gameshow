// BroadcastChannel for communication
const channel = new BroadcastChannel('timer_channel');

// BroadcastChannel for communication
// const channel = new BroadcastChannel('randomizer_channel');
let playersA = [];
let categories = [];

let intervals = [null, null];
let timers = [30, 30];
let currentIndex = 0; // Counter to track the current image index
let imagesAndAnswers = []; // Array to hold images and answers
let allowShowAnswerWhileRunning = [false, false]; // Tracks if "Turn Red" is active for each timer

const players = [
  { name: "Taiwo", img: "./images/Taiwo.jpg" },
  { name: "Shalom", img: "./images/shalom.JPG" },
  { name: "John", img: "./images/john.jpg" },
  { name: "Kenny", img: "./images/kenny.jpg" },
  { name: "Oreoluwa", img: "./images/oreoluwa.jpg" },
  { name: "Grace", img: "./images/Grace.jpg" },
  { name: "Jed", img: "./images/Jed.jpg" },
  { name: "Tishe", img: "./images/Tishe.jpg" },
];


// Populate dropdowns
const player1Select = document.getElementById("player1Select");
const player2Select = document.getElementById("player2Select");

players.forEach((player, index) => {
  const option1 = document.createElement("option");
  option1.value = index;
  option1.textContent = player.name;

  const option2 = option1.cloneNode(true);

  player1Select.appendChild(option1);
  player2Select.appendChild(option2);
});


// Add/Remove Players
function addPlayer() {
  const newPlayerInput = document.getElementById("newPlayerName");
  const newPlayerName = newPlayerInput.value.trim().toUpperCase();

  if (newPlayerName) {
    playersA.push(newPlayerName);
    newPlayerInput.value = "";
    channel.postMessage({ action: 'updatePlayers', data: playersA });
  } else {
    alert("Please enter a valid player name.");
  }
}

function removePlayer() {
  if (playersA.length > 0) {
    playersA.pop();
    channel.postMessage({ action: 'updatePlayers', data: playersA });
  } else {
    alert("No players left to remove.");
  }
}

// Add/Remove Categories
function addCategory() {
  const newCategoryInput = document.getElementById("newCategoryName");
  const newCategoryName = newCategoryInput.value.trim().toUpperCase();

  if (newCategoryName) {
    categories.push(newCategoryName);
    newCategoryInput.value = "";
    channel.postMessage({ action: 'updateCategories', data: categories });
  } else {
    alert("Please enter a valid category name.");
  }
}

function removeCategory() {
  if (categories.length > 0) {
    categories.pop();
    channel.postMessage({ action: 'updateCategories', data: categories });
  } else {
    alert("No categories left to remove.");
  }
}

// Function to start player randomization
function startPlayerRandomizer() {
  channel.postMessage({ action: 'startPlayerRandomizer' });
  console.log("Player Randomizer started from controls.");
}

// Function to start category randomization
function startCategoryRandomizer() {
  channel.postMessage({ action: 'startCategoryRandomizer' });
  console.log("Category Randomizer started from controls.");
}

function triggerPlayerVsModal() {
  const player1Index = player1Select.value;
  const player2Index = player2Select.value;

  if (player1Index === player2Index) {
    alert("Please select different players.");
    return;
  }

  const player1 = players[player1Index];
  const player2 = players[player2Index];

  channel.postMessage({
    action: "showPlayerVs",
    player1,
    player2,
  });
}
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


function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// async function loadCategory(categoryName) {
//   try {
//     const response = await fetch('imagesAndAnswers.json'); // Fetch the single JSON file
//     const data = await response.json();
//     imagesAndAnswers = data[categoryName]; // Extract the specific category
    
//     currentIndex = 0; // Reset index when category changes
//   } catch (error) {
//     console.error(`Error loading category ${categoryName}:`, error);
//   }
// }

async function loadCategory(categoryName) {
  try {
    const response = await fetch('imagesAndAnswers.json'); // Fetch the JSON data
    const data = await response.json();
    const category = data[categoryName]; // Extract the specific category

    if (category) {
      imagesAndAnswers = shuffleArray([...category]); // Shuffle and store the category contents
      console.log(`Loaded and shuffled category: ${categoryName}`, imagesAndAnswers);

      currentIndex = 0; // Reset index when category changes
    } else {
      console.error(`Category ${categoryName} not found.`);
      imagesAndAnswers = []; // Clear imagesAndAnswers if category is invalid
    }
  } catch (error) {
    console.error(`Error loading category ${categoryName}:`, error);
    imagesAndAnswers = []; // Clear imagesAndAnswers in case of error
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

function resetApp() {
  console.log("Resetting the app to its default state...");
  
  // Send reset action to display.html
  channel.postMessage({ action: "resetApp" });

  location.reload(); // Refresh controls.html
}

function startTimer(timerId) {
  const otherTimerId = timerId === 1 ? 2 : 1;

  // Pause the other timer if it's running
pauseTimer(otherTimerId);

  if (!intervals[timerId - 1]) {
    intervals[timerId - 1] = setInterval(() => {
      if (timers[timerId - 1] > 0) {
        timers[timerId - 1]--;
        updateDisplay(timerId);
         // Trigger flashing effect when timer reaches 5
        if (timers[timerId - 1] === 5) {
          channel.postMessage({ action: "flashTimer", timerId, start: true });
      }
      } else {
        clearInterval(intervals[timerId - 1]);
        intervals[timerId - 1] = null;

        channel.postMessage({ action: "flashTimer", timerId, start: false });
      }
    }, 1000);
  }

  setTimeout(() => {
        // Get the current image and answer (before incrementing index in showSequentialImage)
  if (imagesAndAnswers.length > 0) {
    const currentImage = imagesAndAnswers[currentIndex];
    const answerBoxId = timerId === 1 ? "player1Answer" : "player2Answer";
    const answerBox = document.getElementById(answerBoxId);
  
      // Update the answer box in controls.html
     answerBox.textContent = `Answer: ${currentImage.answer.toUpperCase()}`;
  } else {
      console.warn("No images available to display.");
  }
  // Show the current image and answer
  showSequentialImage();
  },1000);
}

// Function to pause a timer
function pauseTimer(timerId) {
  clearInterval(intervals[timerId - 1]);
  intervals[timerId - 1] = null;
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
    answer: currentImage.answer.toUpperCase(), // Pass the answer for tracking
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

function playSound(audio) {
  audio.currentTime = 0; // Reset playback to the start
  audio.play().catch((error) => {
    console.error("Audio playback failed:", error);
  });
}

// Countdown function
function startCountdown() {
  const audioS = new Audio('./sounds/preview.mp3');
  audioS.play();
  channel.postMessage({ action: "closeModal" });
  let countdownValue = 3;
  // Notify display.html to show the initial countdown value
  channel.postMessage({ action: "updateCountdown", value: countdownValue });
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
}

function playBuzzer() {
  const audio = new Audio('./sounds/buzzer.mp3');
  audio.play();
}

const audioGame = new Audio('./sounds/gameMusic.mp3');
function playSound() {
      audioGame.volume = 0.9; // Set volume to 50%
      audioGame.play();
}
function stopSound() {
      audioGame.pause();
      audioGame.currentTime = 0;
}

// Function to adjust the volume
function setVolume(level) {
  if (level >= 0 && level <= 1) {
    audioGame.volume = level;
    console.log(`Volume set to ${level * 100}%`);
  } else {
    console.error("Volume level must be between 0.0 and 1.0");
  }
}





