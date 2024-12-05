// BroadcastChannel for communication
const channel = new BroadcastChannel('timer_channel');

// Track the current image and its answer
let currentImage = null;
let currentAnswer = null;


// Listen for updates from the controls page
channel.onmessage = (event) => {
  const { timerId, value, action, imageSrc ,answer} = event.data;

  // Update the timer display
  if (action === "update") {
    const displayElement = document.getElementById(`display${timerId}`);
    displayElement.textContent = value;
  }

  if (action === "showImage") {
    const imageElement = document.getElementById("randomImage");

    // Update the displayed image and track the answer
    imageElement.src = imageSrc;
    imageElement.style.display = "block";
    currentImage = imageSrc;
    currentAnswer = answer;

    // Hide the answer box when a new image is displayed
    const answerBox = document.getElementById("answerBox");
    answerBox.style.display = "none";
    document.getElementById("answerText").textContent = "";
  }

  if (action === "hideImage") {
    const imageElement = document.getElementById("randomImage");
    const answerElement = document.getElementById("answerBox");

    // Hide the image and answer
    imageElement.style.display = "none";
    imageElement.src = ""; // Clear the image source

    const answerBox = document.getElementById("answerBox");

    answerBox.style.display = "none";
    document.getElementById("answerText").textContent = "";

     currentImage = null; // Reset the current image and answer tracker
     currentAnswer = null;
  }

  if (action === "showAnswer") {
    const answerBox = document.getElementById("answerBox");
    const answerText = document.getElementById("answerText");

    // Display the answer box and update the text
    answerBox.style.display = "block";
    answerText.textContent = currentAnswer || "No answer available";
  }

  if (action === "turnRed") {
    const timerElement = document.getElementById(`display${timerId}`);
    const imageElement = document.getElementById("randomImage");

    // Change the timer's background color to red
    timerElement.style.backgroundColor = "red";
    // Reset the color after 3 seconds
    setTimeout(() => {
      timerElement.style.backgroundColor = ""; // Reset to default

    }, 3000);

  }

  if (action === "updateCountdown") {
    const countdownElement = document.getElementById("countdownDisplay");
    countdownElement.textContent = value; // Update the countdown display
    countdownElement.style.display = "block";

        // Hide the animated image when countdown starts
    const animatedImage = document.getElementById("animatedImage");
    animatedImage.classList.add("hidden");
    console.log(`Countdown updated: ${value}`);
  }

  if (action === "countdownComplete") {
    const countdownElement = document.getElementById("countdownDisplay");
    countdownElement.style.display = "none"; // Hide the countdown display
    console.log("Countdown complete.");
  }
}





