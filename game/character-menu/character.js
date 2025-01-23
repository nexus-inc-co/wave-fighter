const characters = [
  {
    name: "warrior",
    health: 100,
    strength: 80,
    speed: 100,
    ability: "Warrior Boost",
    image: "../Fotos/characater_cards/testcard.png",
    coins: 100, // Begin met 100 coins
  },
  {
    name: "tank",
    health: 150,
    strength: 90,
    speed: 70,
    ability: "Blast",
    image: "../Fotos/characater_cards/testcard2.png",
    coins: 100, // Begin met 100 coins
  },
  {
    name: "assassin",
    health: 80,
    strength: 80,
    speed: 120,
    ability: "Critical Strike",
    image: "../Fotos/characater_cards/testcard3.png",
    coins: 100, // Begin met 100 coins
  },
];

let currentIndex = 0;

const characterDisplay = document.getElementById("character-display");
const characterImage = document.getElementById("character-image");
const skillsDisplay = document.getElementById("skills-display");

function updateCharacter() {
  const character = characters[currentIndex];
  characterImage.src = character.image;
  characterImage.alt = character.name;
  skillsDisplay.innerHTML = `
    <p><strong>Name:</strong> ${character.name}</p>
    <p><strong>Health:</strong> ${character.health}</p>
    <p><strong>Strength:</strong> ${character.strength}</p>
    <p><strong>Speed:</strong> ${character.speed}</p>
    <p><strong>Ability:</strong> ${character.ability}</p>
    <p><strong>Coins:</strong> ${character.coins}</p>  <!-- Weergave van coins -->
    <button id="upgrade">Upgrade Health (Cost: 10 Coins)</button>
  `;
}

document.getElementById("upgrade").addEventListener("click", () => {
  const character = characters[currentIndex];

  if (character.coins >= 10) {
    // Controleer of er genoeg coins zijn
    character.health += 10;
    character.coins -= 10; // Verminder coins
    alert(
      `${character.name} upgraded!\nHealth: ${character.health}\nCoins left: ${character.coins}`
    );
  } else {
    alert("Not enough coins to upgrade!");
  }

  updateCharacter(); // Bijwerken van de weergave
});

function navigate(direction) {
  if (direction === "prev") {
    currentIndex = (currentIndex - 1 + characters.length) % characters.length;
  } else if (direction === "next") {
    currentIndex = (currentIndex + 1) % characters.length;
  }
  updateCharacter();
}

updateCharacter();

document.getElementById("Select").addEventListener("click", () => {
  const character = characters[currentIndex]; // Get the currently displayed character
  alert(`You selected: ${character.name}`); // Notify the user of the selection

  // Send the selected character's name to script.js
  window.selectedCharacter = character.name; // Store the selected character globally
  // Store the selected character's name in localStorage
  localStorage.setItem("selectedCharacter", character.name);
});

// Initial coin value
let coins = localStorage.getItem("coins")
  ? parseInt(localStorage.getItem("coins"))
  : 0;

// Update the coin display
function updateCoinDisplay() {
  document.getElementById("coinDisplay").textContent = `Coins: ${coins}`;
}

// Save coins to localStorage
function saveCoinsToLocalStorage() {
  localStorage.setItem("coins", coins);
}

// Event: Add Coins
document.getElementById("addCoins").addEventListener("click", () => {
  coins += 10; // Add 10 coins
  updateCoinDisplay();
  saveCoinsToLocalStorage();
});

// Event: Upgrade (costs 50 coins)
document.getElementById("upgrade").addEventListener("click", () => {
  if (coins >= 50) {
    coins -= 50; // Deduct 50 coins for upgrade
    updateCoinDisplay();
    saveCoinsToLocalStorage();
    alert("Upgrade successful! 50 coins deducted.");
  } else {
    alert("Not enough coins for an upgrade!");
  }
});

// Initialize the coin menu on page load
window.onload = function () {
  updateCoinDisplay();
};
