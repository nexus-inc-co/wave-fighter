const characters = [
  {
    name: "Warrior",
    health: 100,
    strength: 80,
    ability: "Shield Block",
    image: "../Fotos/characater_cards/testcard.png",
  },
  {
    name: "Mage",
    health: 60,
    strength: 50,
    ability: "Fireball",
    image: "../Fotos/characater_cards/testcard2.png",
  },
  {
    name: "Rogue",
    health: 70,
    strength: 90,
    ability: "Stealth Attack",
    image: "../Fotos/characater_cards/testcard3.png",
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
            <p><strong>Ability:</strong> ${character.ability}</p>
            <button id="upgrade">Upgrade</button>
        `;
}

document.getElementById("upgrade").addEventListener("click", () => {
  const character = characters[currentIndex];
  character.health += 10;
  character.strength += 5;
  alert(
    `${character.name} upgraded!\nHealth: ${character.health}\nStrength: ${character.strength}`
  );
  updateCharacter();
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
