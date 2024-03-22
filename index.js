const express = require('express'); 
const sqlite3 = require('sqlite3');
const ejs = require('ejs');
const User = require('./util/user');
const db = require('./util/db');
const session = require('express-session');
const app = express();
const port = 3000; // We'll run our server on port 3000

app.set('view engine', 'ejs'); // Tell Express to use EJS (templating engine)

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

app.get('/', (req, res) => {  //path = everything after '/'
    res.render('signin'); // Look for a 'home.ejs' file
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

app.get('/home', (req, res) => {
    res.render('home');
});

app.post('/signin', (req, res) => {
    const { username, password } = req.body;
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

app.post('/signup', (req, res) => {
    const { username, email, firstName, lastName, password } = req.body;
    const user = User.createNewUser(username, email, firstName, lastName, password);
    db.insertUser(user);
    res.redirect('/signin');
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});