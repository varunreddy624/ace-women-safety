var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var axios = require('axios');
var await=require('asyncawait/await');
var async=require('asyncawait/async');

var NodeGeocoder = require('node-geocoder');
var options = {
  provider: 'google',

  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: 'AIzaSyDUA7HInId-aYWjxMz_U1MjeyCTPDlV_5I', // for Mapquest, OpenCage, Google Premier
  formatter: null         // 'gpx', 'string', ...
};

var geocoder = NodeGeocoder(options);


mongoose.connect("mongodb+srv://test:test1234@todo-qqfes.mongodb.net/test?retryWrites=true&w=majority",{ useUnifiedTopology: true, useNewUrlParser: true });

var crimeschema = new mongoose.Schema({
  lat: Number,
  lng: Number,
  cr: String,
  desc:String,
});

var cs = mongoose.model('cs',crimeschema);

var urlencodedParser = bodyparser.urlencoded({extended: false});

var a;

module.exports=async function(app){
  app.get('/',function(req,res){
    cs.find({},function(err,data){
      if(err) throw err;
      else
      {
        var d = data.filter(x => x.cr!='');
        res.render('map',{ p:d});
      }
    });
  });


  app.get('/route',function(req,res){
    res.render('route');
  });

  app.get('/polyline',function(req,res){
    cs.find({},function(err,data){
      if(err) throw err;
      else
        res.render('polyline',{ p:data,d:a});
    });
  });

  app.post('/route',urlencodedParser,async(req,res) => {
      var googleMapsClient = require('@google/maps').createClient({
          key: 'AIzaSyDUA7HInId-aYWjxMz_U1MjeyCTPDlV_5I'
      });
      var src = req.body.src;
      var dest = req.body.dest;

      googleMapsClient.directions({
            origin: src,
            destination: dest,
            alternatives:true,
          },function(err, response) {
            a=[];
            /*response.json.routes.forEach((l, i) => {
              console.log(i);
              console.log('\n');
                l.legs[0].steps.forEach((m, j) => {
                    geocoder.reverse({lat:m.end_location["lat"],lon:m.end_location["lng"]}, function(err, res) {
                      var cr= (Math.floor(Math.random() *11 ) + i*10).toString();
                      var f = {lat:m.end_location["lat"],lng:m.end_location["lng"],cr:cr,desc:res[0].extra.neighborhood};
                      console.log(f);
                      var newcs = cs(f).save();
                  });
                });
            });*/
            var dist=[];
            cs.find({},function(err,m){
              response.json.routes.forEach( function(l) {
                  var s=0;
                  l.legs[0].steps.forEach(function(n)  {
                     var arr = m.filter(e => (e.lat === n.end_location["lat"] && e.lng === n.end_location["lng"]));
                  s=s+parseInt(arr[0].cr);
            });
            dist.push(s);
          });
          var min=99999,ind;
          console.log(dist);
          for(var i=0;i<dist.length;i++)
          {
            if(dist[i]<min)
            {
              min=dist[i];
              ind=i;
            }
          }
            var c = response.json.routes[ind].legs[0].steps;
                    a.push({lat:c[0].start_location["lat"],lng:c[0].start_location["lng"]});
                    for(var i=0;i<c.length;i++)
                        a.push({lat:c[i].end_location["lat"],lng:c[i].end_location["lng"]});
                    console.log(a);
          });
            res.json({d:""});
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
