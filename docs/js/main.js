"use strict";

function hideTimeZone() {
  document.getElementById("timezone-info").innerText = "";
}
function hideMap() {
  document.getElementById("map").innerHTML = "";
}
function hideWeather() {
  document.getElementById("weather-info").innerHTML = "";
}
function getTimezone() {
  var e;
  "" !== (e = document.getElementById("cityInput").value).trim() ? (document.getElementById("timezone-info").innerText = "", (e = document.getElementById("cityInput").value) ? fetch("https://api.mapbox.com/geocoding/v5/mapbox.places/".concat(encodeURIComponent(e), ".json?access_token=pk.eyJ1IjoibWVsaWthem4iLCJhIjoiY2x3ejNoZjM1MDNqeTJrcXowdW84OThocCJ9.4JFGd3qQyCN5MeKUbF2AeA")).then(function (e) {
    return e.json();
  }).then(function (t) {
    if (0 !== t.features.length) {
      var n = t.features[0].center[1],
        o = t.features[0].center[0];
      fetch("https://api.timezonedb.com/v2.1/get-time-zone?key=VL57EK3RPBMQ&format=json&by=position&lat=".concat(n, "&lng=").concat(o)).then(function (e) {
        return e.json();
      }).then(function (t) {
        if ("FAILED" !== t.status) {
          var n = t.zoneName,
            o = t.abbreviation;
          document.getElementById("timezone-info").innerText = "Tidszon f\xF6r ".concat(e, ": ").concat(o, " (").concat(n, ")");
        } else document.getElementById("timezone-info").innerText = "Tidszon f\xF6r ".concat(e, " kunde inte hittas! Kontrollera inmatningen och f\xF6rs\xF6k igen.");
      })["catch"](function (t) {
        document.getElementById("timezone-info").innerText = "Ett fel uppstod vid h\xE4mtning av tidszon f\xF6r ".concat(e);
      });
    } else alert("Timezone hittades inte f\xF6r \"".concat(e, "\", f\xF6rs\xF6k igen."));
  })["catch"](function (t) {
    document.getElementById("timezone-info").innerText = "Ett fel uppstod vid h\xE4mtning av geokodningsdata f\xF6r ".concat(e);
  }) : document.getElementById("timezone-info").innerText = "Ange en stad!") : hideTimeZone();
}
function showCityOnMap() {
  var e;
  "" !== (e = document.getElementById("cityInput").value).trim() ? (document.getElementById("map").innerHTML = "", (e = document.getElementById("cityInput").value) ? fetch("https://api.mapbox.com/geocoding/v5/mapbox.places/".concat(encodeURIComponent(e), ".json?access_token=pk.eyJ1IjoibWVsaWthem4iLCJhIjoiY2x3ejNoZjM1MDNqeTJrcXowdW84OThocCJ9.4JFGd3qQyCN5MeKUbF2AeA")).then(function (e) {
    return e.json();
  }).then(function (t) {
    0 !== t.features.length ? showMap(t.features[0].center[1], t.features[0].center[0]) : alert("Staden \"".concat(e, "\" hittades inte. Kontrollera staden och f\xF6rs\xF6k igen."));
  }) : document.getElementById("map").innerText = "Ange en stad!") : hideMap();
}
function showMap(e, t) {
  mapboxgl.accessToken = "pk.eyJ1IjoibWVsaWthem4iLCJhIjoiY2x3ejNoZjM1MDNqeTJrcXowdW84OThocCJ9.4JFGd3qQyCN5MeKUbF2AeA";
  new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [t, e],
    zoom: 10
  });
}
function getWeather() {
  if ("" !== (e = document.getElementById("cityInput").value).trim()) {
    document.getElementById("weather-info").innerHTML = "";
    var e = document.getElementById("cityInput").value;
    fetch("https://api.openweathermap.org/data/2.5/weather?q=".concat(e, "&appid=cd57e09d6d65c8196f784c17892e4f50")).then(function (e) {
      return e.json();
    }).then(function (t) {
      var n = document.getElementById("weather-info");
      if (200 === t.cod) {
        var o = Math.round(t.main.temp - 273.15),
          i = t.weather[0].description,
          a = t.wind.speed,
          d = t.main.humidity;
        n.innerHTML = "<p><strong>Väder till " + e + ":</strong> " + i + "</p><p><strong>Temperatur:</strong> " + o + "°C</p><p><strong>Vindhastighet:</strong> " + a + " m/s</p><p><strong>Fuktighet:</strong> " + d + "%</p>";
      } else alert("Ingen v\xE4derinformation hittades f\xF6r \"".concat(e, "\", f\xF6rs\xF6k igen."));
    });
  } else hideWeather();
}
document.getElementById("cityInput").addEventListener("input", function () {
  "" === this.value.trim() && (hideTimeZone(), hideMap(), hideWeather());
});