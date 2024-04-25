const Animal = require('./animal');
const DB = require('./db');

const b = new Animal("Squish", "A squishy turtle alien", "Sea Squish", "/images/turtleSquish.jpg");
DB.insertAnimal(b, (err, animal) => {  
    if (err) {
        console.log('Error adding animal: ', err);
    } else {
        console.log('Animal added');
    }
});