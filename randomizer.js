// Player Randomizer Logic
let players = ["Player 1", "Player 2", "Player 3", "Player 4"];
let categories = ["Category 1", "Category 2", "Category 3"]; // Default categories
let randomizationInterval;

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

// Add/Remove Players
function addPlayer() {
  const newPlayerInput = document.getElementById("newPlayerName");
  const newPlayerName = newPlayerInput.value.trim().toUpperCase();

  if (newPlayerName) {
    players.push(newPlayerName);
    newPlayerInput.value = "";
    renderPlayerBoxes();
  } else {
    alert("Please enter a valid player name.");
  }
}

function removePlayer() {
  if (players.length > 0) {
    players.pop();
    renderPlayerBoxes();
  } else {
    alert("No players left to remove.");
  }
}

// Start Player Randomizer
function startPlayerRandomizer() {
  randomize("player-box", players);
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

// Add/Remove Categories
function addCategory() {
  const newCategoryInput = document.getElementById("newCategoryName");
  const newCategoryName = newCategoryInput.value.trim().toUpperCase();

  if (newCategoryName) {
    categories.push(newCategoryName);
    newCategoryInput.value = "";
    renderCategoryBoxes();
  } else {
    alert("Please enter a valid category name.");
  }
}

function removeCategory() {
  if (categories.length > 0) {
    categories.pop();
    renderCategoryBoxes();
  } else {
    alert("No categories left to remove.");
  }
}

// Start Category Randomizer
function startCategoryRandomizer() {
  randomize("category-box", categories);
}

// Randomization Logic (Shared)
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
