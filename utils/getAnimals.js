DB = require('./db');
const Animal = require('./animal');
const { getAllAnimals } = require('./db');

DB.getAllAnimals((err, animals) => {
    if (err) {
        console.log('Error getting animals: ', err);
    } else {
        console.log(animals);
    }
});