
/**
 * @file Database Utility Script
 * @description This script provides utility functions for interacting with the database.
 * @module db
 */

const sqlite3 = require('sqlite3').verbose();

// Create a new database connection
const db = new sqlite3.Database('data.sqlite');

const User = require('./user');
const Animal = require('./animal');

db.serialize(() => {
    // Create the Users table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        email TEXT NOT NULL,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        profilePicture TEXT
    )`);

    // Create the Roles table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS Roles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    )`);

    // Create the UserRoles table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS UserRoles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        roleId INTEGER NOT NULL,
        FOREIGN KEY (userId) REFERENCES Users(id),
        FOREIGN KEY (roleId) REFERENCES Roles(id)
    )`);

    // Create the Animals table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS Animals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        species TEXT NOT NULL,
        photoLocation TEXT
    )`);

    //Ensure all animal columns are present.
    const columnsToCheck = [
        { name: 'species', type: 'TEXT NOT NULL' },
        { name: 'description', type: 'TEXT NOT NULL' },
        { name: 'photoLocation', type: 'TEXT' },
    ];

    db.all(`PRAGMA table_info(Animals)`, (err, rows) => {
        if (err) {
            console.error(err);
            return;
        }

        const existingColumnNames = rows.map(row => row.name);

        columnsToCheck.forEach(column => {
            const hasColumn = existingColumnNames.includes(column.name);
            if (!hasColumn) {
                db.run(`ALTER TABLE Animals ADD COLUMN ${column.name} ${column.type}`);
            }
        });
    });
});


/**
 * Inserts a new user into the database.
 * @param {Object} user - The user object containing the user's information. Should be an instance of {@link User}.
 * @param {function} [callback] - The callback function to be called after the user has been inserted.
 * @default (err) => { console.log(err) }
 * @param {Error} callback.err - An error object if an error occurred during the insertion process, null otherwise.
 */
function insertUser(user, callback=(err)=>{console.log(err)}) {
    const { username, password, email, firstName, lastName, profilePicture, roles } = user;
    db.run(`INSERT INTO Users (username, password, email, firstName, lastName, profilePicture)
                    VALUES (?, ?, ?, ?, ?, ?)`,
                    [username, password, email, firstName, lastName, profilePicture], function(err) {
        if (err) {
            callback(err);
        } else {
            const userId = this.lastID;
            if (roles && roles.length > 0) {
                roles.forEach(roleId => {
                    db.run(`INSERT INTO UserRoles (userId, roleId)
                                    VALUES (?, ?)`,
                                    [userId, roleId], function(err) {
                        if (err) {
                            callback(err);
                        } else {
                            callback(null);
                        }
                    });
                });
            }
        }
    });
}

/**
 * Updates a user in the database.
 * @param {Object} user - The user object containing the updated user information.
 * @param {Function} [callback] - The callback function to be called after the user is updated. It takes an error parameter.
 */
function updateUser(user, callback = (err) => { if (err) console.error(err); }) {
    const { username, password, email, firstName, lastName, profilePicture, roles } = user;
    db.run(`UPDATE Users SET username = ?, password = ?, email = ?, firstName = ?, lastName = ?, profilePicture = ?
                    WHERE id = ?`,
                    [username, password, email, firstName, lastName, profilePicture, user.id], function(err) {
        if (err) {
            callback(err);
        } else {
            db.run(`DELETE FROM UserRoles WHERE userId = ?`, [user.id], function(err) {
                if (err) {
                    callback(err);
                } else {
                    if (roles && roles.length > 0) {
                        roles.forEach(roleId => {
                            db.run(`INSERT INTO UserRoles (userId, roleId)
                                            VALUES (?, ?)`,
                                            [user.id, roleId], function(err) {
                                if (err) {
                                    callback(err);
                                } else {
                                    callback(null);
                                }
                            });
                        });
                    }
                }
            });
        }
    });
}

/**
 * Inserts an animal into the database.
 * @param {Object} animal - The animal object to be inserted.
 * @param {string} animal.name - The name of the animal.
 * @param {string} animal.description - The description of the animal.
 * @param {string} animal.profilePhotoURI- The location of the animal's photo.
 */
function insertAnimal(animal) {
    const { name, description, profilePhotoURI } = animal;
    db.run(`INSERT INTO Animals (name, description, photoLocation)
                    VALUES (?, ?, ?)`,
                    [name, description, profilePhotoURI]);
}

/**
 * Retrieves a user from the database by their ID.
 * @param {number} id - The ID of the user to retrieve.
 * @param {function} callback - The callback function to be called with the retrieved user.
 * @param {Error} callback.err - An error object if an error occurred during the retrieval process, null otherwise.
 * @param {Object} callback.row - The retrieved user object from the database.
 */
function getUserById(id, callback) {
    db.get(`SELECT Users.*, Roles.name AS roleName FROM Users
            LEFT JOIN UserRoles ON Users.id = UserRoles.userId
            LEFT JOIN Roles ON UserRoles.roleId = Roles.id
            WHERE Users.id = ?`, [id], (err, row) => {
        if (err) {
            callback(err);
        } else {
            const usr = User.loadUserFromDBRecord(row);
            callback(null, usr);
        }
    });
}

/**
 * Retrieves a user from the database by their username.
 * @param {string} username - The username of the user to retrieve.
 * @param {function} callback - The callback function to be called with the retrieved user or an error.
 * @param {Error} callback.err - An error object if an error occurred during the retrieval process, null otherwise.
 * @param {Object} callback.usr - The retrieved user object from the database.
 */
function getUserByUsername(username, callback) {
    db.get(`SELECT Users.*, Roles.name AS roleName FROM Users
            LEFT JOIN UserRoles ON Users.id = UserRoles.userId
            LEFT JOIN Roles ON UserRoles.roleId = Roles.id
            WHERE Users.username = ?`, [username], (err, row) => {
        if (err) {
            callback(err);
        } else {
            const usr = User.loadUserFromDBRecord(row);
            callback(null, usr);
        }
    });
}

/**
 * Retrieves a user from the database by their username.
 * @param {string} username - The username of the user to retrieve.
 * @returns {Promise<User>} A promise that resolves with the user object if found, or rejects with an error if not found.
 */
async function asyncGetUserByUsername(username) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT Users.*, Roles.name AS roleName FROM Users
                LEFT JOIN UserRoles ON Users.id = UserRoles.userId
                LEFT JOIN Roles ON UserRoles.roleId = Roles.id
                WHERE Users.username = ?`, [username], (err, row) => {
            if (err) {
                reject(err);
            } else {
                const usr = User.loadUserFromDBRecord(row);
                resolve(usr);
            }
        });
    });
}

/**
 * Retrieves a user from the database by their email.
 * @param {string} email - The email of the user to retrieve.
 * @param {function} callback - The callback function to be called with the retrieved user.
 * @param {Error} callback.err - An error object if an error occurred during the retrieval process, null otherwise.
 * @param {Object} callback.usr - The retrieved db record as a User object.
 */
function getUserByEmail(email, callback) {
    db.get(`SELECT Users.*, Roles.name AS roleName FROM Users
            LEFT JOIN UserRoles ON Users.id = UserRoles.userId
            LEFT JOIN Roles ON UserRoles.roleId = Roles.id
            WHERE Users.email = ?`, [email], (err, row) => {
        if (err) {
            callback(err);
        } else {
            const usr = User.loadUserFromDBRecord(row);
            callback(null, usr);
        }
    });
}

/**
 * Retrieves a user from the database based on their email.
 * @param {string} email - The email of the user to retrieve.
 * @returns {Promise<User>} A promise that resolves with the user object if found, or rejects with an error if not found.
 */
async function asyncGetUserByEmail(email) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT Users.*, Roles.name AS roleName FROM Users
                LEFT JOIN UserRoles ON Users.id = UserRoles.userId
                LEFT JOIN Roles ON UserRoles.roleId = Roles.id
                WHERE Users.email = ?`, [email], (err, row) => {
            if (err) {
                reject(err);
            } else {
                const usr = User.loadUserFromDBRecord(row);
                resolve(usr);
            }
        });
    });
}

/**
 * Retrieves an animal from the database by its ID.
 * @param {number} id - The ID of the animal to retrieve.
 * @param {function} callback - The callback function to invoke when the operation is complete.
 *                             The callback should accept two parameters: error and result.
 *                             If an error occurred, the error parameter will be populated.
 *                             If the operation was successful, the result parameter will contain the retrieved animal.
 */
function getAnimalById(id, callback) {
    db.get(`SELECT * FROM Animals WHERE id = ?`, [id], (err, row) => {
        if (err) {
            callback(err);
        } else {
            const animal = new Animal(row.name, row.description, row.species, row.photoLocation);
            callback(null, row);
        }
    });
}

// Export the database connection and helper functions
module.exports = {
    db,
    insertUser,
    insertAnimal,
    getUserById,
    getAnimalById,
    getUserByUsername,
    asyncGetUserByUsername,
    getUserByEmail,
    asyncGetUserByEmail,
    updateUser
};