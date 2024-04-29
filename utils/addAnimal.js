const Animal = require('./animal');
const DB = require('./db');

const c = new Animal("Viola", "A soft curious mini zebra", "Water Zebra", "/images/waterZebra.jpg");
DB.insertAnimal(c, (err, animal) => {  
    if (err) {
        console.log('Error adding animal: ', err);
    } else {
        console.log('Animal added');
    }
});