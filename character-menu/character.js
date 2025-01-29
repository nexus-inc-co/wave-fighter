const config = {
  debugMode: false, // Zet dit op true om debug-informatie in de console te zien
  baseUpgradeCost: 10, // Startkosten voor een upgrade
  upgradeIncrement: 112, // Hoeveel de kosten per upgrade stijgen
  healthIncreasePerUpgrade: 10, // Toename in health per upgrade
  strengthIncreasePerUpgrade: 2, // Toename in strength per upgrade
};


const characters = [
  {
    name: "warrior",
    health: 100,
    strength: 80,
    speed: 100,
    ability: "Warrior Boost",
    image: "../Fotos/characater_cards/warrior3.png",
    upgradeLevel: 0, // Begin met level 0 upgrade
  },
  {
    name: "tank",
    health: 150,
    strength: 90,
    speed: 70,
    ability: "Blast",
    image: "../Fotos/characater_cards/tank3.png",
    upgradeLevel: 0, // Begin met level 0 upgrade
  },
  {
    name: "assassin",
    health: 80,
    strength: 80,
    speed: 120,
    ability: "Critical Strike",
    image: "../Fotos/characater_cards/assassin3.png",
    upgradeLevel: 0, // Begin met level 0 upgrade
  },
];

let currentIndex = 0;
let coins = localStorage.getItem("coins") ? parseInt(localStorage.getItem("coins")) : 0;

// Laad opgeslagen gegevens voor upgrades
characters.forEach(character => {
  const savedUpgradeLevel = localStorage.getItem(`upgradeLevel_${character.name}`);
  if (savedUpgradeLevel !== null) {
    character.upgradeLevel = parseInt(savedUpgradeLevel);
  }

  const savedHealth = localStorage.getItem(`health_${character.name}`);
  if (savedHealth !== null) {
    character.health = parseInt(savedHealth);
  }

  const savedStrength = localStorage.getItem(`strength_${character.name}`);
  if (savedStrength !== null) {
    character.strength = parseInt(savedStrength);
  }

  const savedSpeed = localStorage.getItem(`speed_${character.name}`);
  if (savedSpeed !== null) {
    character.speed = parseInt(savedSpeed);
  }
});

function logDebug(message) {
  if (config.debugMode) {
    console.log("[DEBUG]", message);
  }
}

const characterImage = document.getElementById("character-image");
const skillsDisplay = document.getElementById("skills-display");

let selectedCharacter = localStorage.getItem("selectedCharacter");

// Bepaal de kosten van een upgrade
function getUpgradeCost(character) {
  return config.baseUpgradeCost + character.upgradeLevel * config.upgradeIncrement;
}

// Werk de eigenschappen van het karakter bij
function updateCharacter() {
  const character = characters[currentIndex];
  const upgradeCost = getUpgradeCost(character);
  document.getElementById("character-image").src = character.image;
  document.getElementById("skills-display").innerHTML = `
    <p><strong>Name:</strong> ${character.name}</p>
    <p><strong>Health:</strong> ${character.health + character.upgradeLevel * config.healthIncreasePerUpgrade}</p>
    <p><strong>Strength:</strong> ${character.strength + character.upgradeLevel * config.strengthIncreasePerUpgrade}</p>
    <p><strong>Speed:</strong> ${character.speed}</p>
    <p><strong>Upgrade Level:</strong> ${character.upgradeLevel}</p>
    <button class="upgrade-btn">Upgrade (Cost: ${upgradeCost} Coins)</button>
  `;
  document.querySelector(".upgrade-btn").addEventListener("click", () => upgradeHealth(character));
  logDebug(`Character updated: ${character.name}`);
}

// Upgrade eigenschappen zoals health en strength
function upgradeHealth(character) {
  const upgradeCost = getUpgradeCost(character);
  if (coins >= upgradeCost) {
    coins -= upgradeCost;
    character.upgradeLevel++;
    character.health += config.healthIncreasePerUpgrade;
    character.strength += config.strengthIncreasePerUpgrade; // Strength neemt toe bij een upgrade

    // Opslaan in localStorage
    localStorage.setItem("coins", coins);
    localStorage.setItem(`upgradeLevel_${character.name}`, character.upgradeLevel);
    localStorage.setItem(`health_${character.name}`, character.health);
    localStorage.setItem(`strength_${character.name}`, character.strength);


    showNotification(`Upgrade Successful! Level ${character.upgradeLevel}`, "success");
    updateCharacter();
    updateCoinDisplay(); // Werk het scherm bij
  } else {
    showNotification("Not enough coins!", "error");
  }
}

function navigate(direction) {
  if (direction === "prev") {
    currentIndex = (currentIndex - 1 + characters.length) % characters.length;
  } else if (direction === "next") {
    currentIndex = (currentIndex + 1) % characters.length;
  }
  updateCharacter();
}

function formatCoins(number) {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1).replace(".0", "") + "M";
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1).replace(".0", "") + "K";
  } else {
    return number.toString();
  }
}

function updateCoinDisplay() {
  document.getElementById("coinDisplay").innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      <img src="../Fotos/icon/coins-pixel.png" style="width: 32px; height: 32px; z-index: 5;">
      <span>${formatCoins(coins)}</span>
    </div>
  `;
}

function showNotification(message, type) {
  const notification = document.createElement("div");
  notification.classList.add("notification");

  if (type === "success") {
    notification.style.color = "#0ad406";
  } else if (type === "error") {
    notification.style.color = "red";
  }

  notification.innerHTML = `
    <i class="far ${type === "success" ? "fa-check-circle" : "fa-times-circle"} color"></i> &nbsp;
    <span>${message}</span>
  `;

  document.getElementById("notificationContainer").appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOut 0.5s forwards";
    setTimeout(() => {
      notification.remove();
    }, 500);
  }, 3000);
}

document.getElementById("Select").addEventListener("click", () => {
  const character = characters[currentIndex];
  localStorage.setItem("selectedCharacter", character.name); 
  selectedCharacter = character.name; 
  showNotification(`You selected: ${character.name}`, "success"); 
});

window.onload = function () {
  if (selectedCharacter) {
    currentIndex = characters.findIndex(character => character.name === selectedCharacter);
  }
  updateCoinDisplay();
  updateCharacter();
  logDebug("Page loaded and character initialized");
};

document.getElementById("prev").addEventListener("click", () => navigate("prev"));
document.getElementById("next").addEventListener("click", () => navigate("next"));


