// Händelselyssnare för inputfältet
document.getElementById("cityInput").addEventListener("input", function() {
    var city = this.value;
    if (city.trim() === "") {
        // Om inputfältet är tomt, dölj tidzon, karta och väder
        hideTimeZone();
        hideMap();
        hideWeather();
    }
});

// Funktion för att dölja tidzoninformation
function hideTimeZone() {
    document.getElementById("timezone-info").innerText = "";
}

// Funktion för att dölja kartan
function hideMap() {
    var mapContainer = document.getElementById('map');
    mapContainer.innerHTML = '';
}

// Funktion för att dölja väderinformation
function hideWeather() {
    document.getElementById("weather-info").innerHTML = "";
}

// Funktion för att hämta tidszon för en stad från TimezoneDB API
function getTimezone() {
    var city = document.getElementById("cityInput").value;

    // Om inputfältet är tomt, avsluta funktionen
    if (city.trim() === "") {
        hideTimeZone(); // Dölj tidzoninformationen
        return;
    }

    // Rensa tidigare tidszoninformation
    document.getElementById("timezone-info").innerText = "";

    // Hämta värdet från textinmatningsfältet för staden
    var city = document.getElementById("cityInput").value;

    // Om användaren inte har angett något, meddela detta och avsluta funktionen
    if (!city) {
        document.getElementById("timezone-info").innerText = "Ange en stad!";
        return;
    }

    // Använd Mapbox Geocoding API för att hämta geografiska koordinater för den angivna staden
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(city)}.json?access_token=pk.eyJ1IjoibWVsaWthem4iLCJhIjoiY2x3ejNoZjM1MDNqeTJrcXowdW84OThocCJ9.4JFGd3qQyCN5MeKUbF2AeA`)
        .then(response => response.json())
        .then(data => {
            // Kontrollera om Geocoding API returnerade några resultat
            if (data.features.length === 0) {
                alert(`Timezone hittades inte för "${city}", försök igen.`);
                return;
            }

            // Extrahera latitud och longitud från resultatet
            var latitude = data.features[0].center[1];
            var longitude = data.features[0].center[0];

            // Anropa TimezoneDB API med de extraherade koordinaterna för att hämta tidszoninformation
            fetch(`https://api.timezonedb.com/v2.1/get-time-zone?key=VL57EK3RPBMQ&format=json&by=position&lat=${latitude}&lng=${longitude}`)
                .then(response => response.json())
                .then(data => {
                    // Om inga resultat hittades för staden
                    if (data.status === "FAILED") {
                        document.getElementById("timezone-info").innerText = `Tidszon för ${city} kunde inte hittas! Kontrollera inmatningen och försök igen.`;
                        return;
                    }

                    // Extrahera tidszonens ID och namn
                    var timeZoneId = data.zoneName;
                    var timeZoneName = data.abbreviation;

                    // Visa tidszoninformationen för den angivna staden på webbsidan
                    document.getElementById("timezone-info").innerText = `Tidszon för ${city}: ${timeZoneName} (${timeZoneId})`;
                })
                .catch(error => {
                    // Hantera eventuella fel vid hämtning av tidszoninformation

                    document.getElementById("timezone-info").innerText = `Ett fel uppstod vid hämtning av tidszon för ${city}`;
                });
        })
        .catch(error => {
            // Hantera eventuella fel vid hämtning av geokodningsdata

            document.getElementById("timezone-info").innerText = `Ett fel uppstod vid hämtning av geokodningsdata för ${city}`;
        });
}

// Funktion för att visa platsen för den sökta staden på en karta
function showCityOnMap() {
    var city = document.getElementById("cityInput").value;

    // Om inputfältet är tomt, avsluta funktionen
    if (city.trim() === "") {
        hideMap(); // Dölj kartan
        return;
    }
    // Rensa tidigare kartinformation
    var mapContainer = document.getElementById('map');
    mapContainer.innerHTML = ''; // Ta bort allt innehåll från kartans container

    var city = document.getElementById("cityInput").value;
    
    // Om användaren inte har angett något, avsluta funktionen
    if (!city) {
        document.getElementById("map").innerText = "Ange en stad!";
        return;
    }

    // Använd Mapbox Geocoding API för att hämta geografiska koordinater för den angivna staden
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(city)}.json?access_token=pk.eyJ1IjoibWVsaWthem4iLCJhIjoiY2x3ejNoZjM1MDNqeTJrcXowdW84OThocCJ9.4JFGd3qQyCN5MeKUbF2AeA`)
        .then(response => response.json())
        .then(data => {
            if (data.features.length === 0) {

                // Visa ett alertmeddelande om staden inte hittades
                alert(`Staden "${city}" hittades inte. Kontrollera staden och försök igen.`);
                return;
            }

            // Extrahera latitud och longitud från resultatet
            var latitude = data.features[0].center[1];
            var longitude = data.features[0].center[0];

            // Visa platsen på en karta
            showMap(latitude, longitude);
        });
}


// Funktion för att visa platsen på en karta
function showMap(latitude, longitude) {
    // Skapa en karta med Mapbox Maps API och centrera den på den angivna platsen
    mapboxgl.accessToken = 'pk.eyJ1IjoibWVsaWthem4iLCJhIjoiY2x3ejNoZjM1MDNqeTJrcXowdW84OThocCJ9.4JFGd3qQyCN5MeKUbF2AeA';
    var map = new mapboxgl.Map({
        container: 'map', 
        style: 'mapbox://styles/mapbox/streets-v11', 
        center: [longitude, latitude], // Koordinaterna för den angivna platsen
        zoom: 10 // Zoomnivå för kartan
    });
}

// Funktion för att hämta väderinformation för en stad
function getWeather() {
    var city = document.getElementById("cityInput").value;

    // Om inputfältet är tomt, avsluta funktionen
    if (city.trim() === "") {
        hideWeather(); // Dölj väderinformationen
        return;
    }
    // Rensa tidigare väderinformation
    document.getElementById("weather-info").innerHTML = "";

    var city = document.getElementById("cityInput").value;
    var apiKey = "cd57e09d6d65c8196f784c17892e4f50";
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            var weatherInfo = document.getElementById("weather-info");
            if (data.cod === 200) {
                var temperature = Math.round(data.main.temp - 273.15);
                var weatherDescription = data.weather[0].description;
                var windSpeed = data.wind.speed;
                var humidity = data.main.humidity;
                weatherInfo.innerHTML = "<p><strong>Väder till " + city + ":</strong> " + weatherDescription + "</p>" +
                                        "<p><strong>Temperatur:</strong> " + temperature + "°C</p>" +
                                        "<p><strong>Vindhastighet:</strong> " + windSpeed + " m/s</p>" +
                                        "<p><strong>Fuktighet:</strong> " + humidity + "%</p>";
            } else {
                alert(`Ingen väderinformation hittades för "${city}", försök igen.`);
            }
        })

}