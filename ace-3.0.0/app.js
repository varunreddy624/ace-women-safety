var express = require('express');
var map = require('./controllers/map');
var cors = require('cors');

var app = express();


app.use('/assets',express.static('./public/assets'));
app.use(cors({
  'allowedHeaders': ['sessionId', 'Content-Type'],
  'exposedHeaders': ['sessionId'],
  'Access-Control-Allow-Origin': 'https://localhost:3000',
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false
}));
app.set('view engine','ejs');

map(app);


app.listen(3000);
console.log("you are listening to port 3000");
