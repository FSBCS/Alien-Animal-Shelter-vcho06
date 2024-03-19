const express = require('express'); 
const app = express();
const port = 3000; // We'll run our server on port 3000

app.set('view engine', 'ejs'); // Tell Express to use EJS (templating engine)

app.get('/', (req, res) => {  //path = everything after '/'
    res.render('home'); // Look for a 'home.ejs' file
});

app.get('/animals', (req, res) => {
    res.render('animals');
});

app.get('/home', (req, res) => {
    res.render('home');
});



app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});