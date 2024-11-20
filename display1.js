// // BroadcastChannel for communication
// const channel = new BroadcastChannel('timer_channel');

// // Listen for updates from the controls page
// channel.onmessage = (event) => {
//   const { timerId, value, action , imageSrc} = event.data;

//   // Update the timer display
//   const displayElement = document.getElementById(`display${timerId}`);
//   displayElement.textContent = value;

//   // If the action is "subtract", change the background color to red briefly
//   if (action === "subtract") {
//     displayElement.style.backgroundColor = "red";
//     setTimeout(() => {
//       displayElement.style.backgroundColor = "#e0e0e0"; // Reset to original color
//     }, 3000); // Duration of the red background
//   }

//   if (action === "showImage") {
//     const imageElement = document.getElementById("randomImage");
//     imageElement.src = imageSrc;
//     imageElement.style.display = "block";
//   }
// };


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

  // Display the random image
  // if (action === "showImage") {
  //   const imageElement = document.getElementById("randomImage");
  //   imageElement.src = imageSrc;
  //   imageElement.style.display = "block";
  // }

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
    //const answerElement = document.getElementById("answerBox");

    // Hide the image and answer
    imageElement.style.display = "none";
    imageElement.src = ""; // Clear the image source
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
    answerText.textContent = currentAnswer;
  }


};



