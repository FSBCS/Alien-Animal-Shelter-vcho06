const bcrypt = require('bcrypt');
const saltRounds = 10;

/**
 * Represents a user in the alien animal shelter system.
 */
class User {
    
    /**
     * Represents a User object. Do not create new users directly. Use the createNewUser method instead.
     * @constructor
     * @param {string} username - The username of the user.
     * @param {string} email - The email address of the user.
     * @param {string} firstName - The first name of the user.
     * @param {string} lastName - The last name of the user.
     * @param {Array} favorites - An array of favorite items for the user.
     * @param {string} password - The password of the user.
     * @param {Array} roles - An array of roles assigned to the user.
     */
    constructor(username, email, firstName, lastName, favorites, password, roles) {
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.favorites = favorites;
        this.password = password;
        this.roles = roles;
        this.profilePicture = null;
        this.id = null;
    }

    /**
     * Creates a new user object with the provided information.
     *
     * @param {string} username - The username of the user.
     * @param {string} email - The email address of the user.
     * @param {string} firstName - The first name of the user.
     * @param {string} lastName - The last name of the user.
     * @param {string} password - The password of the user.
     * @returns {User} The newly created user object.
     */
    static createNewUser(username, email, firstName, lastName, password) {
        let hashedPassword = bcrypt.hashSync(password, saltRounds);
        return new User(username, email, firstName, lastName, [], hashedPassword, ['user']);
    }

    /**
     * Loads a user object from a database record.
     *
     * @param {Object} record - The database record containing user information.
     * @returns {User} The loaded User object.
     */
    static loadUserFromDBRecord(record) {
        const usr = new User(record.username, record.email, record.firstName, record.lastName, record.favorites, record.password, record.roles);
        usr.id = record.id;
        return usr;
    }

    /**
     * Adds an animal ID to the user's favorites list.
     * @param {string} animalId - The ID of the animal to add to favorites.
     */
    addFavorite(animalId) {
        this.favorites.push(animalId);
    }

    /**
     * Removes an animal from the user's favorites list.
     * @param {string} animalId - The ID of the animal to be removed.
     */
    removeFavorite(animalId) {
        const index = this.favorites.indexOf(animalId);
        if (index > -1) {
            this.favorites.splice(index, 1);
        }
    }

    /**
     * Checks if the user has a specific role.
     * @param {string} role - The role to check.
     * @returns {boolean} - Returns true if the user has the specified role, otherwise false.
     */
    hasRole(role) {
        return this.roles.includes(role);
    }

    /**
     * Checks if the user is an admin.
     * @returns {boolean} True if the user is an admin, false otherwise.
     */
    isAdmin() {
        return this.hasRole('admin');
    }

    verifyPassword(password) {
        return bcrypt.compareSync(password, this.password);
    }
}

module.exports = User;