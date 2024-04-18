const Animal = require('./animal');
const DB = require('./db');

const a = new Animal("Fluffy", "A rare martian beaver", "Space Beaver", "/images/fluffy.jpg");
DB.insertAnimal(a, (err, animal) => {  
    if (err) {
        console.log('Error adding animal: ', err);
    } else {
        console.log('Animal added');
    }
});