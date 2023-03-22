//to do:
//add loading
//add error
//better font
//icons

const currentTemperature = document.getElementById("current-temperature")
const weather = document.getElementById("weather")
const humidity = document.getElementById("humidity")
const feelsLike = document.getElementById("feels-like")
const windSpeed = document.getElementById("wind-speed")
const town = document.getElementById('town')
const dateElement = document.getElementById('date')
const timeElement = document.getElementById('time')
const townSearchButton = document.getElementById('town-search-button')
const townSearch = document.getElementById('town-search')
const errorDisplay = document.getElementById("error-displayer")
const loading = document.getElementById('loading')
let currentWeather = null//not used yet
let units = "metric"
const openWeatherAppId = "762d23cb7577413f8fba8f728324cb17"
const geonamesUserName = 'hrexandro'
let currentLocation = {
  lon: 18.5981,
  lat: 53.0137
}
let currentTown = "Toruń"
let dateInPlace = new Date()

townSearchButton.addEventListener('click',()=>{
  setCurrentTown(townSearch.value)
  townSearch.value = ""
})

async function setCurrentTown (townToBeSet){
  try {
    let response = await fetch(`https://secure.geonames.org/searchJSON?q=${townToBeSet}&maxRows=1&username=${geonamesUserName}`)
    response.json().then(function (response){
      console.log(response)
      if (response.totalResultsCount === 0){
        errorDisplay.innerText = "Location not found. Try the format 'city', 'city, state' or 'city, country'."
      } else {
        loading.innerText = ""
        errorDisplay.innerText = ""
        currentLocation.lon = response.geonames[0].lng
        currentLocation.lat = response.geonames[0].lat
        currentTown = response.geonames[0].toponymName + (response.geonames[0].countryName ? `, ${response.geonames[0].countryName}` : "")
        displayUpdatedData()
      }
    })
  } catch (error) {
    console.log(error)
  }
}



async function getTime(){
  try {
    let response = await fetch(`https://secure.geonames.org/timezoneJSON?lat=${currentLocation.lat}&lng=${currentLocation.lon}&username=${geonamesUserName}`)
    return timeData = await response.json()
  } catch (error) {
      console.log(error)
  }

}

function updateTime(){//change time to am pm
  getTime().then((data)=>{
    dateInPlace = new Date(timeData.time)
    console.log(dateInPlace.getHours())
    setBackgroundAccordingToTime(dateInPlace.getHours())
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    dateElement.innerText = days[dateInPlace.getDay()] + ", " + dateInPlace.getDate() + " " + months[dateInPlace.getMonth()] + " " + dateInPlace.getFullYear()
    timeElement.innerText = dateInPlace.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
  })

}





function setBackgroundAccordingToTime(timeData){
  if (timeData >= 16 && timeData < 22){
    document.querySelector("html").setAttribute("id", "evening")
  } else if (timeData > 4 && timeData < 16){
    document.querySelector("html").setAttribute("id", "morning")
  } else {
    document.querySelector("html").setAttribute("id", "night")
  }
}



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
    
    displayWeatherParameter(currentTemperature, currentWeather.main.temp + "°C")
    displayWeatherParameter(weather, currentWeather.weather[0].main)
    displayWeatherParameter(humidity, currentWeather.main.humidity + "%")
    displayWeatherParameter(feelsLike, currentWeather.main.feels_like + "°C")
    displayWeatherParameter(windSpeed, currentWeather.wind.speed + " m/s")
  })
}

function displayUpdatedData (){
  displayWeather()
  updateTime()
  town.innerText = currentTown
}
setBackgroundAccordingToTime(5)
setCurrentTown(currentTown)


