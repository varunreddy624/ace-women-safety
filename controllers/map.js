var bodyparser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect("mongodb+srv://test:test1234@todo-qqfes.mongodb.net/test?retryWrites=true&w=majority",{ useUnifiedTopology: true, useNewUrlParser: true });

var crimeschema = new mongoose.Schema({
  lat: Number,
  lng: Number,
  cr: String,
});

var cs = mongoose.model('cs',crimeschema);

var urlencodedParser = bodyparser.urlencoded({extended: false});

module.exports=function(app){
  app.get('/',function(req,res){
    cs.find({},function(err,data){
      if(err) throw err;
      else
      {
        var a = JSON.stringify(data);
        res.render('map',{p:a});
      }
    });
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
