var express = require('express');
var map = require('./controllers/map');
var app = express();

app.use('/assets',express.static('./public/assets'));
app.set('view engine','ejs');

map(app);


app.listen(3000);
console.log("you are listening to port 3000");
