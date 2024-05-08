function toggleFavorite(animalId) {
    fetch('/api/favorites', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ animalId }),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch((error) => {  
        console.error('Error:', error);
    });
}

