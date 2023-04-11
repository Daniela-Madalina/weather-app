// let apiKey = 'Q7G1wBcfFr6pwh6hAb9doUS3fUSnXPVh'
// key = oCYzFcc28SB4HfxWmRBCgIoAGh3CCOGl

const apiKey = "Q7G1wBcfFr6pwh6hAb9doUS3fUSnXPVh";

function success(pos) {
  var crd = pos.coords;
  const lat = crd.latitude;
  const lon = crd.longitude;
  

  displayCurrentData(lat, lon);
}

navigator.geolocation.getCurrentPosition(success);

async function currentCityKey(lat, lon) {
  const res = await fetch(
    `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${apiKey}&q=%20${lat}%2C${lon}`
  );

  if (!res.ok) {
    throw new Error("Bad response!");
  }
  const data = await res.json();
  // console.log(data.Key)
  return data;
}

async function getCityKey(cityName) {
    const res = await fetch(
      `https://dataservice.accuweather.com/locations/v1/cities/search?q=${cityName}&apikey=${apiKey}`
    );
  
    if (!res.ok) {
      throw new Error("Bad response!");
    }
    const data = await res.json();
    // console.log(data[0].Key);
    return data;
  }

async function currentWeather(cityKey) {
  const res = await fetch(
    `http://dataservice.accuweather.com/currentconditions/v1/${cityKey}?apikey=${apiKey}`
  );
  if (!res.ok) {
    throw new Error("Bad response!");
  }
  const data = await res.json();
  // console.log(data)
  return data;
}

async function currentHourly(cityKey) {
  const res = await fetch(
    `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${cityKey}?apikey=${apiKey}&metric=true`
  );
  if (!res.ok) {
    throw new Error("Bad response!");
  }
  const data = await res.json();
  // console.log(data)
  return data;
}

async function getForecast(cityKey) {
  const res = await fetch(
    `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${cityKey}?apikey=${apiKey}&metric=true`
  );
  if (!res.ok) {
    throw new Error("Bad response!");
  }
  const data = await res.json();
  // console.log(data)
  return data;
}

async function displayCurrentData(p1, p2) {
    let cityKey
    let cityName
    if(!p2){
        const cityData = await getCityKey(p1)
        cityKey = cityData[0].Key
        cityName = cityData[0].EnglishName
        console.log(cityData)
    }else{
        const cityData = await currentCityKey(p1, p2);
        cityKey = cityData.Key
        cityName = cityData.EnglishName
        console.log(cityData);
    }

  const weather = await currentWeather(cityKey);
  console.log(weather);

  const hourlyData = await currentHourly(cityKey);
  console.log(hourlyData);

  const forecastData = await getForecast(cityKey);
  console.log(forecastData);


  //CURRENT WEATHER DISPLAY
  document.querySelector(".current-weather").innerHTML = `
    <div class="current-weather-icon">
        <img src="img/${weather[0].WeatherIcon}-s.png" alt="" srcset="">
    </div>
    <p class="current-city">${cityName}</p>
    <div class="current-w-box">
        <p class="temp current-temp">${weather[0].Temperature.Metric
          .Value}&deg;</p>
        <p class="temp current-temp-description">${weather[0].WeatherText}</p>
    </div>`;

  //HOURLY DISPLAY
  let hourly = document.querySelector(".hourly");
  hourly.innerHTML = "";

  for (i = 0; i < hourlyData.length; i++) {
    let time = new Date(hourlyData[i].EpochDateTime * 1000);

    let h = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
    let m =
      time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();

    hourly.innerHTML += `
      <li class="center-xy">
          <p class="hour">${h}:${m}</p>
          <div class="icon-temp-wrapper">
              <div class="i-hourly-forecast hourly-icon">
                  <img src="img/${hourlyData[i]
                    .WeatherIcon}-s.png" alt="" srcset="">
              </div>
              <p class="hourly-temp">${hourlyData[i].Temperature.Value}&deg;</p>
          </div>
      </li>`;
  }

  // 5-DAY FORECAST DISPLAY
  let dailyForecast = forecastData.DailyForecasts;
  let daily = document.querySelector(".daily");
  daily.innerHTML = "";

  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  
  
  for (i = 0; i < dailyForecast.length; i++) {
      let d = new Date(dailyForecast[i].EpochDate * 1000);
      console.log(d)
      let day = weekday[d.getDay()];
    daily.innerHTML += `
      <li>
        <div class="forecast-box-left">
            <div class="icon-temp-wrapper">
                <div class="i-hourly-forecast i-forecast">
                    <img src="img/${dailyForecast[i].Day.Icon}-s.png" alt="" srcset="">
                </div>
                <p class="day">${day}</p>
                <p class="day-temp-description">${dailyForecast[i].Day
                  .IconPhrase}</p>
            </div>
        </div>
        <p class="day-temp">${dailyForecast[i].Temperature.Minimum
          .Value}&deg;/${dailyForecast[i].Temperature.Maximum.Value}&deg;</p>
    </li>`;
  }
}

let searchCity = document.querySelector("#city-title");

searchCity.addEventListener("keyup", function(e) {
  if (e.key === "Enter" || e.keyCode === 13) {
    // console.log (searchCity.value)
    displayCurrentData(searchCity.value);
    searchCity.value = ''
  }
});

// Theme Switch
let light = document.querySelector('#light')
let dark = document.querySelector('#dark')
let dim = document.querySelector('#dim')
let html = document.querySelector('html')

light.addEventListener('click', function(){
    html.className = 'light-theme'
})

dark.addEventListener('click', function(){
    html.className = 'dark-theme'
})

dim.addEventListener('click', function(){
    html.className = 'dim-theme'
})


