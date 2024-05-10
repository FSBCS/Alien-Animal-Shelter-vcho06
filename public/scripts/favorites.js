function toggleFavorite(animalId) {
    const button = document.querySelector(`button[data-animal-id="${animalId}"]`);
    fetch('/api/favorites', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ animalId }),
    })
    .then(response => response.json())
    .then(data => {
        if (button.classList.contains('btn-primary')) {
            button.classList.remove('btn-primary');
            button.classList.add('btn-danger');
        } else {
            button.classList.remove('btn-danger');
            button.classList.add('btn-primary');
        }
    })
    .catch((error) => {  
        console.error('Error:', error);
    });
}

