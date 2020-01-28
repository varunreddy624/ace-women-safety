$(document).ready(function(){
    $('form').on('submit', function(){
        var src = $('#src');
        var dest = $('#dest');
        var s = src.val().replace(/\s/g,"");
        var d = dest.val().replace(/\s/g,"");
        var a = {src:s,dest:d};
        //var uri = `https://maps.googleapis.com/maps/api/directions/json?origin=${s}&destination=${d}&alternatives=true&key=AIzaSyDUA7HInId-aYWjxMz_U1MjeyCTPDlV_5I`;
        $.ajax({
          type: 'POST',
          url: '/route',
          data: a,
          success: function(data){
            alert('success');
            window.location="http://localhost:3000/polyline";
          },
          error: function(){
            alert('failure');
          }
        });
        return false;
    });
  });
