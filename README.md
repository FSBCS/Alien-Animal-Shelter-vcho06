# Alien Animal Shelter Project

In this project, you will use your knowledge of Express to create a basic web application for
a shelter for abandoned alien animals.

## Description
Your web application, although simple, will contain many of the features of a real-world web application. It will have a home page, a page to display all the animals in the shelter, a login page, an account profile, and dynamic content
that changes based upon the user. A full list of page and feature requirements is provided below. Additionally, you will
be given some helper code and more instruction as we continue to build the website.

### Page Requirements

The following pages must appear in your applicaiton:

1. Home Page - This page should contain a welcome message and a brief description of the shelter.
2. Animals Page - This page should display all the animals in the shelter. Each animal should have a name, a species, and a description. There should also be a button to mark the animal as a favorite.
3. Login Page - This page should contain a form with fields for a username and password. When the form is submitted, the user should be redirected to their account profile page.
4. Account Profile - This page should display the user's profile information. If the user is not logged in, they should be redirected to the login page.
5. Sign Up Page - This page should contain a form with fields for a username, password, first and last name, and email. When the form is submitted, the user should be redirected to their account profile page.
6. Add new animal - This page should contain a form with fields for a name, species, and description. When the form is submitted, the animal should be added to the animals page. This page should only be accessible to users with the role of admin.
7. Consistent Header and Footer - Each page (except when unnecessary) should contain a consistent nav bar and footer. You can use EJS partials to accomplish this.

### Feature Requirements

The following features must be included in your application:

1. User Authentication - Users should be able to log in and log out of the application. If a user is not logged in, they should not be able to access the account profile page.
2. User Authorization - The profile page should only be visible to the logged in user. When a user is logged in a session is opened that persists until they log out.
3. Dynamic Content - The content on the profile page should change based upon the user. Additionally, only logged in users should be able to mark animals as favorites. Favorites are remembered between sessions. When a user is logged in, the favorited animals should be marked as such on the animals page. For example, the favorite button could be a heart that turns red when the animal is favorited.
4. Varrying Roles - Users should have different roles. For example, a user with the role of admin should be able to add new animals to the shelter. A user with the role of user should not be able to add new animals but should be able to mark animals as favorites.

## Instructions

You should consider completing the development of this application in the following order:

1. Create the home page and the animals page skeleton. You do not need to include any animals yet. Also create the header and footer partials.
2. Create the login and sign up pages. Work to get user creation and login working. Once a user is correctly logged in, they should be redirected to their account profile page.
3. Add a check to ensure that usernames and user emails are unique. Do not create users that have the same username or email as an existing user.
4. Create the account profile page. This page should display the user's profile information. If the user is not logged in, they should be redirected to the login page.
5. Add functionality to the account profile page to change profile information.
6. Create the add new animal page. This page should only be accessible to users with the role of admin. Add some animals to the animals page.
7. On the animals page, display all of the animals in the database. Add a check to see if the user is logged in. If they are, display a button to mark the animal as a favorite and show which animals have already been favorited.

## Helper Code
This project contains helper code and documentation contained in the utils folder. This code will be updated as we continue to build the website.

### User class

The User class contains a simple framework for creating and managing user objects. The class is imported using

```javascript
const User = require('./utils/user');
```

The class has the following functionality:

- Create a new user object
- Verify the user's password
- Check if the user is an admin
- Add and remove animals from the user's favorites list

See below for a more complete description of each functionality.

#### Create a new user object
A user object is constructed by "factory" methods called `createNewUser()`. The correct invocation of this function is:

```javascript
const user = User.createNewUser(username, email, firstName, lastName, password);
```

Note that the password will be hashed by the user object. The password parameter should be passed as plaintext.

__important__ Do not use the `new` keyword to create a new user object. Always use the `createNewUser()` method.


#### Verify the user's password

Passwords stored in the user object are hashed using an opaque algorithm (i.e. you don't know how). To verify that a
given plaintext password matches the stored password, use the `verifyPassword()` method:

```javascript
if (user.verifyPassword(password)) {
    // Passwords match
} else {
    // Passwords do not match
}
```

#### Check if the user is an admin
Some users may be designated as administrators. To check if a user is an admin, use the `isAdmin()` method:

```javascript
if (user.isAdmin()) {
    // User is an admin
} else {
    // User is not an admin
}
```

### db Module

The db module contains functions for storing persistent data in an sqlite database. The module is imported using

```javascript
const db = require('./utils/db');
```

The module has the following functionality:

- Create the required database and tables
- Add a new user to the database
- Retrieve a user from the database
- Add an animal to the database
- Retrieve all animals from the database

See below for a more complete description of each functionality.

#### Create the required database and tables

The database and appropriate tables (if they do not exist) are created when the module is imported. The database is stored in a file called `data.db` in the root directory of the project. It is important not to delete, move, or modify this file.

```javascript
const db = require('./utils/db');
```

#### Add a new user to the database

To add a user to the database, use the `insertUser()` method. The method takes a user object and a callback function as arguments. The callback function is called with an error object if there is an error, or `null` if the user was successfully added to the database.

```javascript
db.insertUser(user, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('User added to database');
    }
});
```

#### Retrieve a user from the database

There are multiple ways to retrieve a user from the database. Most often you will want to get the user by username.
This is done with the `getUserByUsername()` method. The method takes a username and a callback function as arguments. The callback function is called with an error object and the user object if the user is found. If the user is not found, the user object will be `null`.

```javascript
db.getUserByUsername(username, (err, user) => {
    if (err) {
        console.log(err);
    } else {
        // Do something with the user object
    }
});
```

## Session Secrets
The helper code contains a short function to generate a session secret: `./utils/sessionSecret.js`. This function is used to generate a random string that can be used as a session secret. The function is imported using

```javascript
const sessionSecret = require('./utils/sessionSecret');
```

The function is called with no arguments and returns a random string that can be used as a session secret.

```javascript
const secret = sessionSecret();
```

### .env File
You should create a `.env` file in the root directory of your project. This file should contain the following variables:

```plaintext
SESSION_SECRET=your_session_secret
```

Replace `your_session_secret` with the output of the `sessionSecret()` function.

To read the session secret in your application, use the `dotenv` package:

```javascript
require('dotenv').config();
const sessionSecret = process.env.SESSION_SECRET;
```

