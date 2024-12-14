// Player Randomizer Logic
let players = [];
let categories = []; // Default categories
let randomizationInterval;

// BroadcastChannel for communication
const channel = new BroadcastChannel('timer_channel');

// Listen for updates from controls.html
channel.onmessage = (event) => {
  const { action, data } = event.data;

  if (action === 'updatePlayers') {
    players = data;
    renderPlayerBoxes();
  } else if (action === 'updateCategories') {
    categories = data;
    renderCategoryBoxes();
  }

  if (action === 'startPlayerRandomizer') {
    randomize("player-box", players);
    console.log("Player Randomizer started.");
  } else if (action === 'startCategoryRandomizer') {
    randomize("category-box", categories);
    console.log("Category Randomizer started.");
  }
};

// Render Player Boxes
function renderPlayerBoxes() {
  const container = document.getElementById("randomizerContainer");
  container.innerHTML = "";

  players.forEach((player, index) => {
    const box = document.createElement("div");
    box.classList.add("player-box");
    box.id = `playerBox${index + 1}`;
    box.textContent = player;
    container.appendChild(box);
  });
}

// Render Category Boxes
function renderCategoryBoxes() {
  const container = document.getElementById("categoryContainer");
  container.innerHTML = "";

  categories.forEach((category, index) => {
    const box = document.createElement("div");
    box.classList.add("category-box");
    box.id = `categoryBox${index + 1}`;
    box.textContent = category;
    container.appendChild(box);
  });
}

// Randomizer Logic (Shared)
function randomize(boxClass, items) {
  const boxes = document.querySelectorAll(`.${boxClass}`);
  const tickSound = document.getElementById("tickSound");
  const celebrationSound = document.getElementById("celebrationSound");

  if (boxes.length === 0) {
    alert("No items to randomize!");
    return;
  }

  let lastHighlightedIndex = -1;
  randomizationInterval = setInterval(() => {
    if (lastHighlightedIndex >= 0) {
      boxes[lastHighlightedIndex].classList.remove("highlight");
    }

    const randomIndex = Math.floor(Math.random() * boxes.length);
    boxes[randomIndex].classList.add("highlight");
    lastHighlightedIndex = randomIndex;

    tickSound.currentTime = 0;
    tickSound.play();
  }, 100);

  setTimeout(() => {
    clearInterval(randomizationInterval);

    boxes.forEach((box) => box.classList.remove("highlight"));
    const finalIndex = Math.floor(Math.random() * boxes.length);
    boxes[finalIndex].classList.add("highlight");

    celebrationSound.play();
    console.log(`Selected ${boxClass === "player-box" ? "Player" : "Category"}: ${boxes[finalIndex].textContent}`);
  }, 5000);
}

// Initial Rendering
renderPlayerBoxes();
renderCategoryBoxes();


// // Render Player Boxes
// function renderPlayerBoxes() {
//   const container = document.getElementById("randomizerContainer");
//   container.innerHTML = "";

//   players.forEach((player, index) => {
//     const box = document.createElement("div");
//     box.classList.add("player-box");
//     box.id = `playerBox${index + 1}`;
//     box.textContent = player;
//     container.appendChild(box);
//   });
// }

// // Add/Remove Players
// function addPlayer() {
//   const newPlayerInput = document.getElementById("newPlayerName");
//   const newPlayerName = newPlayerInput.value.trim().toUpperCase();

//   if (newPlayerName) {
//     players.push(newPlayerName);
//     newPlayerInput.value = "";
//     renderPlayerBoxes();
//   } else {
//     alert("Please enter a valid player name.");
//   }
// }

// function removePlayer() {
//   if (players.length > 0) {
//     players.pop();
//     renderPlayerBoxes();
//   } else {
//     alert("No players left to remove.");
//   }
// }

// // Start Player Randomizer
// function startPlayerRandomizer() {
//   randomize("player-box", players);
// }

// // Render Category Boxes
// function renderCategoryBoxes() {
//   const container = document.getElementById("categoryContainer");
//   container.innerHTML = "";

//   categories.forEach((category, index) => {
//     const box = document.createElement("div");
//     box.classList.add("category-box");
//     box.id = `categoryBox${index + 1}`;
//     box.textContent = category;
//     container.appendChild(box);
//   });
// }

// // Add/Remove Categories
// function addCategory() {
//   const newCategoryInput = document.getElementById("newCategoryName");
//   const newCategoryName = newCategoryInput.value.trim().toUpperCase();

//   if (newCategoryName) {
//     categories.push(newCategoryName);
//     newCategoryInput.value = "";
//     renderCategoryBoxes();
//   } else {
//     alert("Please enter a valid category name.");
//   }
// }

// function removeCategory() {
//   if (categories.length > 0) {
//     categories.pop();
//     renderCategoryBoxes();
//   } else {
//     alert("No categories left to remove.");
//   }
// }

// // Start Category Randomizer
// function startCategoryRandomizer() {
//   randomize("category-box", categories);
// }

// // Randomization Logic (Shared)
// function randomize(boxClass, items) {
//   const boxes = document.querySelectorAll(`.${boxClass}`);
//   const tickSound = document.getElementById("tickSound");
//   const celebrationSound = document.getElementById("celebrationSound");

//   if (boxes.length === 0) {
//     alert("No items to randomize!");
//     return;
//   }

//   let lastHighlightedIndex = -1;
//   randomizationInterval = setInterval(() => {
//     if (lastHighlightedIndex >= 0) {
//       boxes[lastHighlightedIndex].classList.remove("highlight");
//     }

//     const randomIndex = Math.floor(Math.random() * boxes.length);
//     boxes[randomIndex].classList.add("highlight");
//     lastHighlightedIndex = randomIndex;

//     tickSound.currentTime = 0;
//     tickSound.play();
//   }, 100);

//   setTimeout(() => {
//     clearInterval(randomizationInterval);

//     boxes.forEach((box) => box.classList.remove("highlight"));
//     const finalIndex = Math.floor(Math.random() * boxes.length);
//     boxes[finalIndex].classList.add("highlight");

//     celebrationSound.play();
//     console.log(`Selected ${boxClass === "player-box" ? "Player" : "Category"}: ${boxes[finalIndex].textContent}`);
//   }, 5000);
// }

// // Initial Rendering
// renderPlayerBoxes();
// renderCategoryBoxes();
