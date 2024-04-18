/**
 * Represents an animal in the shelter.
 * @class
 */
class Animal {
    /**
     * Represents an animal in the shelter.
     * @constructor
     * @param {string} name - The name of the animal.
     * @param {string} description - The description of the animal.
     * @param {string} species - The species of the animal.
     * @param {string} profilePhotoUri - The URI of the animal's profile photo.
     */
    constructor(name, description, species, profilePhotoUri) {
        this.name = name;
        this.description = description;
        this.species = species;
        this.profilePhotoUri = profilePhotoUri;
        this.id = null;
    }

    /**
     * Creates an Animal object from a database row.
     * @param {Object} row - The database row containing the animal information.
     * @returns {Animal} - The created Animal object.
     */
    static loadFromDbRow(row) {
        const animal = new Animal(row.name, row.description, row.species, row.photoLocation);
        animal.id = row.id;
        return animal;
    }
}

module.exports = Animal;