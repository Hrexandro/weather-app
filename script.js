//by location 'http://api.openweathermap.org/data/2.5/weather?q=Torun&APPID=762d23cb7577413f8fba8f728324cb17&units=metric '
//by coordinates 'http://api.openweathermap.org/data/2.5/weather?q=Torun&APPID=762d23cb7577413f8fba8f728324cb17&units=metric'
//onecall
//Toruń
  //lon	18.5981
  //lat	53.0137
//units metric default imperial add picker
  //use geocoding to get location https://openweathermap.org/api/geocoding-api
  //then using the longitude and latitude fetch the weather data

  //Photo by Rafael Cerqueira: https://www.pexels.com/photo/blue-and-white-sky-with-stars-4737484/
let currentWeather = null//not used yet
let units = "metric"
const AppId = "762d23cb7577413f8fba8f728324cb17"
let currentLocation = {
  lon: 18.5981,
  lat: 53.0137
}

const currentTemperature = document.getElementById("current-temperature")
const weather = document.getElementById("weather")
const humidity = document.getElementById("humidity")
const feelsLike = document.getElementById("feels-like")
const windSpeed = document.getElementById("wind-speed")


function displayWeatherParameter (variable, value) {
  variable.innerText = value
  
}


async function getWeather(){
  try {
    let response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=Torun&APPID=${AppId}&units=${units}`)
    return weatherData = await response.json()
  } catch (error) {
      console.log(error)
  }

}

function displayWeather(){
  getWeather().then((data) => {
    console.log(data)
    currentWeather = data
    
    displayWeatherParameter(currentTemperature, currentWeather.main.temp)
    displayWeatherParameter(weather, currentWeather.weather[0].main)
    displayWeatherParameter(humidity, currentWeather.main.humidity)
    displayWeatherParameter(feelsLike, currentWeather.main.feels_like)
    displayWeatherParameter(windSpeed, currentWeather.wind.speed)
  })
}

displayWeather()


