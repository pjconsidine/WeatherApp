// Email obfuscator script 2.1 by Tim Williams, University of Arizona. Random encryption key feature by Andrew Moulden, Site Engineering Ltd. This code is freeware provided these four comment lines remain intact. A wizard to generate this code is at http://www.jottings.com/obfuscator/

$(function emailObscurer(){
  var coded = "grZr.1BDiwFwDr@QCAwO.1BC"
  var key = "ob0EjLADW4RsJpuMlxXhTN7vBIdVm5etc32i9gqKOH6Ganz8kfFYCSrZ1PUwyQ"
  var shift = coded.length
  var link = ""
  for (var i = 0; i < coded.length; i++) {
    if (key.indexOf(coded.charAt(i)) == -1) {
      var ltr = coded.charAt(i)
      link += (ltr)
    } else {
      var ltr = (key.indexOf(coded.charAt(i)) - shift + key.length) % key.length
      link += (key.charAt(ltr))
    }
  }
  $("#email").html("<a href='mailto:" + link + "'>Email</a>")
});

var url, lat, lon, city, state;

$(document).ready(function() {
  $.ajax({
    type: 'GET',
    url: 'http://ip-api.com/json',
    async: true,
    contentType: 'application/json',
    dataType: 'jsonp',
    success: function(results) {
      var data = results;
      lat = data.lat;
      lon = data.lon;
      city = data.city;
      state = data.region;
      url = "https://api.forecast.io/forecast/795262f49355bceab3dbfbe52121e3b6/" + lat + "," + lon;
      return url;
    },
    error: function(error) {
      $("#result-text").html(error.code);
    },
  });
})

$('#submit').click(function() {
  $.ajax({
    type: 'GET',
    url: url,
    async: true,
    contentType: "application/json",
    dataType: 'jsonp', 
    success: function(results) {
      var data = results;
      ProcessEntries(data);
    }
  });
});

var conditions = {
  "clear-day":"//www.weather.gov/images/nws/newicons/skc.png",
  "clear-night":"//www.weather.gov/images/nws/newicons/nskc.png",
  "rain":"//www.weather.gov/images/nws/newicons/shra.png", 
  "snow":"//www.weather.gov/images/nws/newicons/sn.png", 
  "sleet":"//www.weather.gov/images/nws/newicons/ip.png",
  "wind":"//www.weather.gov/images/nws/newicons/wind_sct.png", 
  "fog":"//www.weather.gov/images/nws/newicons/fg.png", 
  "cloudy":"//www.weather.gov/images/nws/newicons/ovc.png", 
  "partly-cloudy-day":"//www.weather.gov/images/nws/newicons/bkn.png",
  "partly-cloudy-night":"//www.weather.gov/images/nws/newicons/nbkn.png"
};

function ProcessEntries(data) {
  var scale = $('input[name="scale"]:checked').val();
  var selection = $('input[name="weather"]:checked').val();

  $("#city").html("Showing conditions for " + city + ", " + state);

  Handlebars.registerHelper("formatDateTime", function(time) {
    var timestampValue = parseInt((time), 10);
    var dt = new Date(timestampValue * 1000);
    var hours = (dt.getHours() + 24) % 12 || 12;
    var meridien = function() {
      if (dt.getHours() > 12) {
        return "PM";
      } else {
        return "AM";
      }
    }
    return (dt.getMonth() + 1) + '/' + dt.getDate() + '/' + dt.getFullYear() + ", " + hours + ":" + String("0" + dt.getMinutes()).slice(-2) + " " + meridien();
  });
  Handlebars.registerHelper("formatTemp", function(temp) {
    var tempF = Math.round(temp * 10) / 10;
    var tempC = Math.round((temp - 32) * (5 / 9) * 10) / 10;
    if (scale === "C") {
      return tempC + "&deg;C";
    } else {
      return tempF + "&deg;F"
    }
  });
  Handlebars.registerHelper("imageHandler", function(icon){
    var x = conditions[icon];
    return '<img src="' + x + '" />';
  });

  var source1 = $("#currentTemplate").html();
  var template1 = Handlebars.compile(source1);

  var source2 = $("#forecastTemplate").html();
  var template2 = Handlebars.compile(source2);

  if (selection === "currently") {
    return $("#result-text").html(template1(data.currently));
  } else if (selection === "daily") {
    return $("#result-text").html(template2(data.daily));
  } else {
    return $("#result-text").html("<strong>Choose the weather you wish to see.</strong>");
  }
}