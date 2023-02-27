fetch('https://cors-anywhere.herokuapp.com/api.openweathermap.org/data/2.5/weather?q=London&APPID=762d23cb7577413f8fba8f728324cb17')
  .then(function(response) {
    return console.log(response)
  })


  //use geocoding to get location https://openweathermap.org/api/geocoding-api
  //then using the longitude and latitude fetch the weather data

