const Animal = require('./animal');
const getAnimals = require('./getAnimals');

// showAnimals.js

// Import necessary modules

// Function to create a card for each animal
function createAnimalCard(animal) {
    const card = document.createElement('div');
    card.classList.add('animal-card');

    const name = document.createElement('h2');
    name.textContent = animal.name;
    card.appendChild(name);

    const species = document.createElement('p');
    species.textContent = `Species: ${animal.species}`;
    card.appendChild(species);


    // Add more information as needed

    return card;
}

// Function to display animals on the animals.ejs page
function displayAnimals() {
    const animalContainer = document.querySelector('.animal-container');

    // Retrieve animals from the database
    const animals = getAnimals();

    // Create a card for each animal and append it to the container
    animals.forEach((animal) => {
        const card = createAnimalCard(animal);
        animalContainer.appendChild(card);
    });
}

// Call the displayAnimals function when the page loads
window.addEventListener('load', displayAnimals);