//reduce text size with media queries for smaller screen sizes
//set the time in forecast to appropriate timezone


const currentTemperature = document.getElementById("current-temperature")
const weather = document.getElementById("weather")
const humidity = document.getElementById("humidity")
const feelsLike = document.getElementById("feels-like")
const windSpeed = document.getElementById("wind-speed")
const town = document.getElementById("town")
const dateElement = document.getElementById("date")
const timeElement = document.getElementById("time")
const townSearchButton = document.getElementById("town-search-button")
const townSearch = document.getElementById("town-search")
const errorDisplay = document.getElementById("error-displayer")
const loading = document.getElementById("loading")
const unitSwitcher = document.getElementById("unit-switcher")
const currentweatherIcon = document.getElementById("current-weather-icon")
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let currentWeather = null


let metric = {
  name: "metric",
  temperature: "°C",
  windSpeed: " m/s",
}

let imperial = {
  name: "imperial",
  temperature: "°F",
  windSpeed: " mph",
}

let units = metric
const openWeatherAppId = "762d23cb7577413f8fba8f728324cb17"
const geonamesUserName = "hrexandro"
let currentLocation = {
  lon: 18.5981,
  lat: 53.0137
}
let currentTown = "Toruń"
let dateInPlace = new Date()

townSearchButton.addEventListener("click",()=>{
  setCurrentTown(townSearch.value)
})

async function setCurrentTown (townToBeSet){
  try {
    let response = await fetch(`https://secure.geonames.org/searchJSON?q=${townToBeSet}&maxRows=1&username=${geonamesUserName}`)
    response.json().then(function (response){
      if (response.totalResultsCount === 0){
        errorDisplay.innerText = 'Location not found. Try the format "city", "city, state" or "city, country".'
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

unitSwitcher.addEventListener("click",()=>{
  if (units.name === "metric"){
    units = imperial
    unitSwitcher.innerText = "Change to metric units"
  } else {
    units = metric
    unitSwitcher.innerText = "Change to Imperial units"
  }

  displayUpdatedData()
})



async function getTime(){
  try {
    let response = await fetch(`https://secure.geonames.org/timezoneJSON?lat=${currentLocation.lat}&lng=${currentLocation.lon}&username=${geonamesUserName}`)
    return timeData = await response.json()
  } catch (error) {
      console.log(error)
  }

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


async function getCurrentWeather(){
  try {
    let response = await fetch (`https://api.openweathermap.org/data/2.5/weather?lat=${currentLocation.lat}&lon=${currentLocation.lon}&appid=${openWeatherAppId}&units=${units.name}`)
    return weatherData = await response.json()
  } catch (error) {
      console.log(error)
  }

}

async function getDailyForecast(){
  try {
    let response = await fetch (`https://api.openweathermap.org/data/2.5/forecast?lat=${currentLocation.lat}&lon=${currentLocation.lon}&cnt=20&appid=${openWeatherAppId}&units=${units.name}`)
    return weatherData = await response.json()
  } catch (error) {
      console.log(error)
  }

}


async function displayWeather(){
  getTime().then(()=>{
    if (timeData.time){
      dateInPlace = new Date(timeData.time)
    } else {
      dateInPlace = new Date()
    }
    setBackgroundAccordingToTime(dateInPlace.getHours())
    dateElement.innerText = days[dateInPlace.getDay()] + ", " + dateInPlace.getDate() + " " + months[dateInPlace.getMonth()] + " " + dateInPlace.getFullYear()
    timeElement.innerText = dateInPlace.toLocaleString("en-US", { hour: "numeric", minute: "numeric", hour12: true })
  })
  .then(//ensure time has been fetched and set
    getDailyForecast().then((data) => {
      console.log(dateInPlace)
      //dateInPlace.setTime(date.getTime() + hours * 60 * 60 * 1000);
      //dateInPlace.getTime()
      for (let i = 1, d = 2; i < 10; i++, d+=2){
        let dayDiv = document.getElementById(i)
        let weekDay = dayDiv.getElementsByClassName("day-of-week")[0]
  
  
        let forecastDate = new Date()
        console.log(forecastDate)
        forecastDate.setTime(dateInPlace.getTime() + d * 3 * 60 * 60 * 1000)//add correct time increments to the forecasts based on the current time in locale
        console.log(forecastDate)
        weekDay.innerText = days[forecastDate.getDay()]
        let forecastTime = dayDiv.getElementsByClassName("time")[0]
        //console.log(forecastTime)
        forecastTime.innerText = forecastDate.toLocaleString("en-US", { hour: "numeric", minute: "numeric", hour12: true })
  
        let maxTemp = dayDiv.getElementsByClassName("max-temp")[0]
        maxTemp.innerText = data.list[d].main.temp_max + units.temperature
    
        // let minTemp = dayDiv.getElementsByClassName("min-temp")[0]
        // minTemp.innerText = data.list[d].main.temp_min + units.temperature
    
        determineWeatherIcon(dayDiv.getElementsByClassName("path-1")[0], dayDiv.getElementsByClassName("path-2")[0], data.list[d].weather[0].id)
      }
  
  
      console.log('daily forecast')
      console.log(data)
      console.log(data.list[0].main.temp_max)
      console.log(data.list[0].main.temp_min)
      console.log(data.list[0].weather[0].description.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()))
    })

  )


  getCurrentWeather().then((data) => {
    currentWeather = data
    displayWeatherParameter(currentTemperature, currentWeather.main.temp + units.temperature)
    displayWeatherParameter(weather, currentWeather.weather[0].description.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()))
    displayWeatherParameter(humidity, currentWeather.main.humidity + "%")
    displayWeatherParameter(feelsLike, currentWeather.main.feels_like + units.temperature)
    displayWeatherParameter(windSpeed, currentWeather.wind.speed + units.windSpeed)

    determineWeatherIcon(document.getElementById("p1"), document.getElementById("p2"), currentWeather.weather[0].id)
  })
}

function determineWeatherIcon(svgFirstPath, svgSecondPath, weatherId) {
  svgFirstPath.setAttribute("d", "")
  svgSecondPath.setAttribute("d", "")

  if (weatherId > 800){//clouds
    svgFirstPath.setAttribute("d", "M16 7.5a2.5 2.5 0 0 1-1.456 2.272 3.513 3.513 0 0 0-.65-.824 1.5 1.5 0 0 0-.789-2.896.5.5 0 0 1-.627-.421 3 3 0 0 0-5.22-1.625 5.587 5.587 0 0 0-1.276.088 4.002 4.002 0 0 1 7.392.91A2.5 2.5 0 0 1 16 7.5z")
    svgSecondPath.setAttribute("d", "M7 5a4.5 4.5 0 0 1 4.473 4h.027a2.5 2.5 0 0 1 0 5H3a3 3 0 0 1-.247-5.99A4.502 4.502 0 0 1 7 5zm3.5 4.5a3.5 3.5 0 0 0-6.89-.873.5.5 0 0 1-.51.375A2 2 0 1 0 3 13h8.5a1.5 1.5 0 1 0-.376-2.953.5.5 0 0 1-.624-.492V9.5z")
  } else if (weatherId === 800){
    svgFirstPath.setAttribute("d", "M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z")
  } else if (weatherId > 700){
    svgFirstPath.setAttribute("d", "M8.5 4a4.002 4.002 0 0 0-3.8 2.745.5.5 0 1 1-.949-.313 5.002 5.002 0 0 1 9.654.595A3 3 0 0 1 13 13H.5a.5.5 0 0 1 0-1H13a2 2 0 0 0 .001-4h-.026a.5.5 0 0 1-.5-.445A4 4 0 0 0 8.5 4zM0 8.5A.5.5 0 0 1 .5 8h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z")
  } else if (weatherId >= 600){
    svgFirstPath.setAttribute("d", "M13.405 4.277a5.001 5.001 0 0 0-9.499-1.004A3.5 3.5 0 1 0 3.5 10.25H13a3 3 0 0 0 .405-5.973zM8.5 1.25a4 4 0 0 1 3.976 3.555.5.5 0 0 0 .5.445H13a2 2 0 0 1-.001 4H3.5a2.5 2.5 0 1 1 .605-4.926.5.5 0 0 0 .596-.329A4.002 4.002 0 0 1 8.5 1.25zM2.625 11.5a.25.25 0 0 1 .25.25v.57l.501-.287a.25.25 0 0 1 .248.434l-.495.283.495.283a.25.25 0 0 1-.248.434l-.501-.286v.569a.25.25 0 1 1-.5 0v-.57l-.501.287a.25.25 0 0 1-.248-.434l.495-.283-.495-.283a.25.25 0 0 1 .248-.434l.501.286v-.569a.25.25 0 0 1 .25-.25zm2.75 2a.25.25 0 0 1 .25.25v.57l.501-.287a.25.25 0 0 1 .248.434l-.495.283.495.283a.25.25 0 0 1-.248.434l-.501-.286v.569a.25.25 0 1 1-.5 0v-.57l-.501.287a.25.25 0 0 1-.248-.434l.495-.283-.495-.283a.25.25 0 0 1 .248-.434l.501.286v-.569a.25.25 0 0 1 .25-.25zm5.5 0a.25.25 0 0 1 .25.25v.57l.501-.287a.25.25 0 0 1 .248.434l-.495.283.495.283a.25.25 0 0 1-.248.434l-.501-.286v.569a.25.25 0 1 1-.5 0v-.57l-.501.287a.25.25 0 0 1-.248-.434l.495-.283-.495-.283a.25.25 0 0 1 .248-.434l.501.286v-.569a.25.25 0 0 1 .25-.25zm-2.75-2a.25.25 0 0 1 .25.25v.57l.501-.287a.25.25 0 0 1 .248.434l-.495.283.495.283a.25.25 0 0 1-.248.434l-.501-.286v.569a.25.25 0 1 1-.5 0v-.57l-.501.287a.25.25 0 0 1-.248-.434l.495-.283-.495-.283a.25.25 0 0 1 .248-.434l.501.286v-.569a.25.25 0 0 1 .25-.25zm5.5 0a.25.25 0 0 1 .25.25v.57l.501-.287a.25.25 0 0 1 .248.434l-.495.283.495.283a.25.25 0 0 1-.248.434l-.501-.286v.569a.25.25 0 1 1-.5 0v-.57l-.501.287a.25.25 0 0 1-.248-.434l.495-.283-.495-.283a.25.25 0 0 1 .248-.434l.501.286v-.569a.25.25 0 0 1 .25-.25z")
  } else if (weatherId >= 500){
    svgFirstPath.setAttribute("d", "M4.176 11.032a.5.5 0 0 1 .292.643l-1.5 4a.5.5 0 1 1-.936-.35l1.5-4a.5.5 0 0 1 .644-.293zm3 0a.5.5 0 0 1 .292.643l-1.5 4a.5.5 0 1 1-.936-.35l1.5-4a.5.5 0 0 1 .644-.293zm3 0a.5.5 0 0 1 .292.643l-1.5 4a.5.5 0 1 1-.936-.35l1.5-4a.5.5 0 0 1 .644-.293zm3 0a.5.5 0 0 1 .292.643l-1.5 4a.5.5 0 0 1-.936-.35l1.5-4a.5.5 0 0 1 .644-.293zm.229-7.005a5.001 5.001 0 0 0-9.499-1.004A3.5 3.5 0 1 0 3.5 10H13a3 3 0 0 0 .405-5.973zM8.5 1a4 4 0 0 1 3.976 3.555.5.5 0 0 0 .5.445H13a2 2 0 0 1 0 4H3.5a2.5 2.5 0 1 1 .605-4.926.5.5 0 0 0 .596-.329A4.002 4.002 0 0 1 8.5 1z")
  } else if (weatherId >= 300){
    svgFirstPath.setAttribute("d", "M4.158 12.025a.5.5 0 0 1 .316.633l-.5 1.5a.5.5 0 0 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.317zm6 0a.5.5 0 0 1 .316.633l-.5 1.5a.5.5 0 0 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.317zm-3.5 1.5a.5.5 0 0 1 .316.633l-.5 1.5a.5.5 0 0 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.317zm6 0a.5.5 0 0 1 .316.633l-.5 1.5a.5.5 0 1 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.317zm.747-8.498a5.001 5.001 0 0 0-9.499-1.004A3.5 3.5 0 1 0 3.5 11H13a3 3 0 0 0 .405-5.973zM8.5 2a4 4 0 0 1 3.976 3.555.5.5 0 0 0 .5.445H13a2 2 0 0 1 0 4H3.5a2.5 2.5 0 1 1 .605-4.926.5.5 0 0 0 .596-.329A4.002 4.002 0 0 1 8.5 2z")
  } else if (weatherId >= 200){
    svgFirstPath.setAttribute("d", "M2.658 11.026a.5.5 0 0 1 .316.632l-.5 1.5a.5.5 0 1 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.316zm9.5 0a.5.5 0 0 1 .316.632l-.5 1.5a.5.5 0 1 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.316zm-7.5 1.5a.5.5 0 0 1 .316.632l-.5 1.5a.5.5 0 1 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.316zm9.5 0a.5.5 0 0 1 .316.632l-.5 1.5a.5.5 0 1 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.316zm-.753-8.499a5.001 5.001 0 0 0-9.499-1.004A3.5 3.5 0 1 0 3.5 10H13a3 3 0 0 0 .405-5.973zM8.5 1a4 4 0 0 1 3.976 3.555.5.5 0 0 0 .5.445H13a2 2 0 0 1 0 4H3.5a2.5 2.5 0 1 1 .605-4.926.5.5 0 0 0 .596-.329A4.002 4.002 0 0 1 8.5 1zM7.053 11.276A.5.5 0 0 1 7.5 11h1a.5.5 0 0 1 .474.658l-.28.842H9.5a.5.5 0 0 1 .39.812l-2 2.5a.5.5 0 0 1-.875-.433L7.36 14H6.5a.5.5 0 0 1-.447-.724l1-2z")
  }

}


function displayUpdatedData (){
  townSearch.value = ""

  displayWeather()
  town.innerText = currentTown
}

document.addEventListener('keydown',(event)=>{
  if(event.key === "Enter") {
    setCurrentTown(townSearch.value)
  }
})

setBackgroundAccordingToTime(5)
setCurrentTown(currentTown)


