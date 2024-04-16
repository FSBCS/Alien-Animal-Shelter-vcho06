/**
 * Updates the user profile with the provided information.
 *
 * @param {string} route - The route to send the update request to.
 * @param {string} firstName - The user's first name.
 * @param {string} lastName - The user's last name.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<Response>} - A Promise that resolves to the response of the update request.
 */
function updateProfile(route, username, firstName, lastName, email) {
    const data = {
        username: username,
        firstName: firstName, 
        lastName: lastName,
        email: email,
    };

    return fetch(route, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}