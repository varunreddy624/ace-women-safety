$(document).ready(function(){
    $('form').on('submit', function(){
        var nl = $('#nl');
        var city = $('#city');
        var x = nl.val().replace(/\s/g,"+");
        var ss = x+"+"+city.val();
        var cr = $('#cr');
        var uri = `https://maps.googleapis.com/maps/api/geocode/json?address=${ss}&key=AIzaSyDUA7HInId-aYWjxMz_U1MjeyCTPDlV_5I`;
        $.ajax({
          type: 'POST',
          url: uri,
          success: function(data){
            var d = data.results[0].geometry.location;
            d.cr=cr.val();
            insertdb(d);
          },
          error: function(){
            alert('failure');
          }
        });
        return false;
    });
    function insertdb(d)
    {
      $.ajax({
        type: 'POST',
        url: '/insertdb',
        data: d,
        success: function(data){
          window.location="http://localhost:3000/"
        },
        error: function(){
          alert('failure');
        }
      });
      return false;
    }
  });
