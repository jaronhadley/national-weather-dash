// search city name link
var searchCity = $("#search-city");
// today link
var todayDate = $("#today-date");
// today temp link
var todayTemp = $("#today-temp");
// today wind link
var todayWind = $("#today-wind");
// today humidity link
var todayHumidity = $("#today-humidity");
// today UV link
var todayUV = $("#today-uv");
// today icon
var todayIcon = $("#today-icon");

// Forecast Card links
// day plus one link
var dayPlusOne = $("#dayPlusOne");
// day plus two link
var dayPlusTwo = $("#dayPlusTwo");
// day plus three link
var dayPlusThree = $("#dayPlusThree");
// day plus four link
var dayPlusFour = $("#dayPlusFour");
// day plus five link
var dayPlusFive = $("#dayPlusFive");

// forecast array
var forecastCards = [dayPlusOne, dayPlusTwo, dayPlusThree, dayPlusFour, dayPlusFive];

// uv formats
var uvFormats = ["one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen"]

//search city
function searchCity(city) {
    var latLon = searchCoordinates(city);
    // get weather
//https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
    var queryURL = "https://api.openweathermap.org/data/2.5/onecall?" + latLon + "&exclude=minutely,hourly,alerts&appid=b2434684140d619ef976e1e54725b70d"
}

function searchCoordinates(city){
//get city coordinates
//http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
    var queryURL = "http://api.openweathermap.org/geo/1.0/direct?q="+city+"&limit=1&appid=b2434684140d619ef976e1e54725b70d"
    fetch(queryURL)
        .then((res) => res.json())
        .then( function (coorData) {
            console.log(coorData);
            fetch("https://api.openweathermap.org/data/2.5/onecall?lat="+coorData[0].lat+"&lon="+coorData[0].lon+"&exclude=minutely,hourly,alerts&units=imperial&appid=b2434684140d619ef976e1e54725b70d")
                .then ((response) => response.json())
                .then(function (weatherData){
                    console.log(weatherData.current);
                    renderToday(weatherData.current,coorData[0].name,coorData[0].state,coorData[0].country);
                    console.log(moment.unix(weatherData.current.dt).format("M/D/YYYY"))
                    renderForecast(weatherData.daily);
                    console.log(weatherData.daily);
                })
        })
    }
// fill out results
function renderToday(data,city,state,country){
    // location
    searchCity.text(city+" "+state+", "+country);
    // icon
    todayIcon.attr('src',"http://openweathermap.org/img/w/" + data.weather[0].icon + ".png")
    // date
    todayDate.text(moment.unix(data.dt).format("M/D/YYYY"));
    // temp
    todayTemp.text(data.temp);
    // wind
    todayWind.text(data.wind_speed);
    // humidity
    todayHumidity.text(data.humidity);
    // UV Index
    // remove previous formatting
    uvFormats.forEach(className => {
        todayUV.removeClass(className)
    })
    // add new formatting
    if(data.uvi<1){
        todayUV.addClass("zero");
    } else if (data.uvi<2){
        todayUV.addClass("one");
    } else if (data.uvi<3){
        todayUV.addClass("two");
    } else if (data.uvi<4){
        todayUV.addClass("three");
    } else if (data.uvi<5){
        todayUV.addClass("four");
    } else if (data.uvi<6){
        todayUV.addClass("five");
    } else if (data.uvi<7){
        todayUV.addClass("six");
    } else if (data.uvi<8){
        todayUV.addClass("seven");
    } else if (data.uvi<9){
        todayUV.addClass("eight");
    } else if (data.uvi<10){
        todayUV.addClass("nine");
    } else if (data.uvi<11){
        todayUV.addClass("ten");
    } else if (data.uvi<12){
        todayUV.addClass("eleven");
    } else if (data.uvi<13){
        todayUV.addClass("twelve");
    } else if (data.uvi<14){
        todayUV.addClass("thirteen");
    } else {
        todayUV.addClass("fourteen");
    }
    // update text
    todayUV.text(data.uvi);
}
function renderForecast(data){
    var cnt =1;
    forecastCards.forEach(card => {
        var dayData = data[cnt];
        card.children().each(function(){
            if($(this).hasClass("card-title")){
                $(this).text(moment.unix(dayData.dt).format("M/D/YYYY"));
            } else if ($(this).hasClass("forecast-temp")){
                $(this).text("Temp: " + dayData.temp.day);
            }
            else if ($(this).hasClass("forecast-wind")){
                $(this).text("Wind: " + dayData.wind_speed);
            }
            else if ($(this).hasClass("forecast-humidity")){
                $(this).text("Humidity: " + dayData.humidity);
            }
            else if ($(this).hasClass("forecast-icon")){
                $(this).attr('src',"http://openweathermap.org/img/w/" + dayData.weather[0].icon + ".png");
            }
        })
        cnt++;
    })
}
// save search

// load prev searches
// add prev seach class
//card m-3 bg-secondary text-white text-center
//<div class="card-body">city name</div>


// search event listener
// prev-search event listener

// default search - Atlanta
searchCoordinates("Logan");

