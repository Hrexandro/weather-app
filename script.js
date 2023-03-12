//by location 'http://api.openweathermap.org/data/2.5/weather?q=Torun&openWeatherAppId=762d23cb7577413f8fba8f728324cb17&units=metric '
//by coordinates 'https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}'
//onecall
//Toruń
  //lon	18.5981
  //lat	53.0137
//units metric default imperial add picker
  //use geocoding to get location https://openweathermap.org/api/geocoding-api
  //then using the longitude and latitude fetch the weather data

let currentWeather = null//not used yet
let units = "metric"
const openWeatherAppId = "762d23cb7577413f8fba8f728324cb17"
const geonamesUserName = 'hrexandro'
let currentLocation = {
  lon: 18.5981,
  lat: 53.0137
}

// let currentLocation = {//NYC for test purposes
//   lon: -73.935242,
//   lat: 40.730610
// }
let day = new Date()
let time = day.getHours()//change it to timezone according to coordinates later


async function getTime(){
  try {
    let response = await fetch(`http://api.geonames.org/timezoneJSON?lat=${currentLocation.lat}&lng=${currentLocation.lon}&username=${geonamesUserName}`)
    return timeData = await response.json()
  } catch (error) {
      console.log(error)
  }

}

getTime().then((data)=>{
  let dateInPlace = new Date(timeData.time)
  console.log(dateInPlace.getHours())
  setBackgroundAccordingToTime(dateInPlace.getHours())
})




function setBackgroundAccordingToTime(timeData){
  if (timeData >= 16 && timeData < 22){
    document.querySelector("html").setAttribute("id", "evening")
  } else if (timeData > 4 && timeData < 16){
    document.querySelector("html").setAttribute("id", "morning")
  } else {
    document.querySelector("html").setAttribute("id", "night")
  }
}

setBackgroundAccordingToTime(time)




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
    let response = await fetch (`https://api.openweathermap.org/data/2.5/weather?lat=${currentLocation.lat}&lon=${currentLocation.lon}&appid=${openWeatherAppId}&units=metric`)
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


