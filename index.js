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
    user.updateProfile(username, firstName, lastName, email);
    db.updateUser(user);
    res.status(200).send('Profile updated');
});

app.get('/home', (req, res) => {
    res.render('home');
});

app.post('/signup', (req, res) => {
    const { username, email, firstName, lastName, password } = req.body;
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



app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});