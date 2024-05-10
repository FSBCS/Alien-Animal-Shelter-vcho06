require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser'); 
const sqlite3 = require('sqlite3');
const ejs = require('ejs'); 
const User = require('./utils/user');
const db = require('./utils/db');
const session = require('express-session');
const app = express();
const port = 3000; // We'll run our server on port 3000

app.set('view engine', 'ejs'); // Tell Express to use EJS (templating engine)
app.use(express.json());

app.use(express.static('public'));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV == 'production'}
}));

app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(bodyParser.json()); // Used to parse JSON bodies

app.get('/', (req, res) => {  //path = everything after '/'
    res.render('home'); // Look for a 'home.ejs' file
});

app.get('/signup', (req, res) => {
    if (req.session.user) {
        res.redirect('/home');
    } else {
        res.render('signup');
    }
});


app.get('/signin', (req, res) => {
    if (req.session.user) {
        res.redirect('/home');
    } else {
        res.render('signin');
    }
});

app.get('/animals', (req, res) => {
    res.render('animals');
});

app.get('/profile', (req, res) => {
    if (!req.session.user) {
        res.redirect('/signin');
    } else {
        const user = req.session.user;
        res.render('profile', { user: user});
    }  
});


app.put('/profile', requireLogin, (req, res) => {
    const { username, firstName, lastName, email } = req.body;
    let user = User.fromJSON(req.session.user);
    user.username = username;
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    db.updateUser(user);
    req.session.user = user;
    res.status(200).send('Profile updated');
});

app.get('/home', (req, res) => {
    res.render('home');
});

app.post('/signup', (req, res) => {
    const { username, email, firstName, lastName, password } = req.body;

    const usernameExists = db.getUserByUsername(username);
    const emailExists = db.getUserByEmail(email);

    if (usernameExists || emailExists) {
       return res.status(400).send('Username or Email already exists');
    }

    const user = User.createNewUser(username, email, firstName, lastName, password);
    db.insertUser(user);
    console.log('User created: ', user);
    res.redirect('/signin');
});

app.post('/signin', (req, res) => {
    const { username, password } = req.body;
    console.log('Username: ', username);
    db.getUserByUsername(username, callback);

    function callback(err, user) {
        if (err) {
            res.send('Error: ' + err);
            res.redirect('/signin');
        } else {
            if (user) {
                if (user.verifyPassword(password)) {
                    req.session.user = user;
                    
                    res.redirect('/home');
                } else {
                    res.redirect('/signin');
                }
            } else {
                res.redirect('/signin');
            }
        }
    }
});

function requireLogin(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/signin');
    }
}

app.get('/api/animals', (req, res) => {
    db.getAllAnimals((err, animals) => {
        if (err) {
            res.status(500).send('Error getting animals');
        } else {
            res.send(animals);
        }
    });
});

app.post('/api/favorites', requireLogin, (req, res) => {
    const { animalId } = req.body;
    const user = User.fromJSON(req.session.user);

    if (user.favorites.includes(animalId)) {
        user.removeFavorite(animalId);
    } else {
        user.addFavorite(animalId);
    }
    req.session.user = user;
    db.updateUser(user);
    res.status(200).json({ message: 'Favorite updated' });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});