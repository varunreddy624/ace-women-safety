var bodyparser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect("mongodb+srv://test:test1234@myfirst1-dwd5r.mongodb.net/test?retryWrites=true&w=majority",{ useUnifiedTopology: true, useNewUrlParser: true });

var crimeschema = new mongoose.Schema({
  lat: Number,
  lng: Number,
  cr: String,
});

var cs = mongoose.model('cs',crimeschema);

var urlencodedParser = bodyparser.urlencoded({extended: false});

var a=[];

module.exports=function(app){
  app.get('/',function(req,res){
    cs.find({},function(err,data){
      if(err) throw err;
      else
        res.render('map',{ p:data});
    });
  });


  app.get('/route',function(req,res){
    res.render('route');
  });

  app.get('/polyline',function(req,res){
    cs.find({},function(err,data){
      if(err) throw err;
      else
      {
        res.render('polyline',{ p:data,d:a});
      }
    });
  });

  app.post('/route',urlencodedParser,function(req,res){
      var googleMapsClient = require('@google/maps').createClient({
          key: 'AIzaSyDUA7HInId-aYWjxMz_U1MjeyCTPDlV_5I'
      });
      var src = req.body.src;
      var dest = req.body.dest;
      googleMapsClient.directions({
          origin: src,
          destination: dest,
          mode: req.mode,
        },function(err, response) {
            var c = response.json.routes[0].legs[0].steps;
            for(var i=0;i<c.length;i++)
                a.push({lat:c[i].end_location["lat"],lng:c[i].end_location["lng"]});
            res.json(response);
          });
        res.end();
    });
      app.get('/cr',function(req,res){
            res.render('cr');
        });
    app.post('/insertdb',urlencodedParser,function(req,res){
      var newcs = cs(req.body).save(function(err,data){
            if(err)
              res.status(403);
            else
              res.json(data);
        });
    });
  }
