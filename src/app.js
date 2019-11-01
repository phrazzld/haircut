// haircut/src/app.js

const express = require('express');
const app = express();
require('dotenv').config();
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

// Always wear a helmet
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());

// Set up our views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// Set up our static files
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.render('home', {
    title: 'Haircut',
  });
});

module.exports = app;
