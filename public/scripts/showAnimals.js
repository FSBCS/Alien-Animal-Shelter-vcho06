function loadCards(data) {
    const baseCard = document.getElementById('base-card');
    data.forEach(animal => {
        const card = baseCard.cloneNode(true);
        card.id = "animal-" + animal.id;
        card.querySelector('.card-title').textContent = animal.name;
        card.querySelector('.card-img-top').src = animal.photoLocation;
        card.querySelector('.animal-species').textContent = animal.species;
        card.querySelector('.animal-description').textContent = animal.description;
        card.classList.remove("d-none");
        baseCard.parentNode.appendChild(card);
    });
}

fetch('/api/animals')
    .then(response => response.json())
    .then(data => loadCards(data))
    .catch(error => console.error(error));