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