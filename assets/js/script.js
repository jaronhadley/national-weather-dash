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

// search button link
var searchBtn = $("#search-btn");

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

// past searches link
var pastSearches = $("#past-searches");
// forecast array
var forecastCards = [dayPlusOne, dayPlusTwo, dayPlusThree, dayPlusFour, dayPlusFive];

// uv formats
var uvFormats = ["one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen"]

function searchCoordinates(city){
//get city coordinates
    var queryURL = "https://api.openweathermap.org/geo/1.0/direct?q="+city+"&limit=1&appid=b2434684140d619ef976e1e54725b70d"
    fetch(queryURL)
        .then((res) => res.json())
        .then( function (coorData) {
            fetch("https://api.openweathermap.org/data/2.5/onecall?lat="+coorData[0].lat+"&lon="+coorData[0].lon+"&exclude=minutely,hourly,alerts&units=imperial&appid=b2434684140d619ef976e1e54725b70d")
                .then ((response) => response.json())
                .then(function (weatherData){
                    renderToday(weatherData.current,coorData[0].name,coorData[0].state,coorData[0].country);
                    renderForecast(weatherData.daily);
                })
        })
    renderSearches();
    }

// fill out results
function renderToday(data,city,state,country){
    // location
    if(!state){ // if state is null
        searchCity.text(city+", "+country); 
    } else {
        searchCity.text(city+" "+state+", "+country);
    }
    // icon
    todayIcon.attr('src',"https://openweathermap.org/img/w/" + data.weather[0].icon + ".png")
    // date
    todayDate.text(moment.unix(data.dt).format("M/D/YYYY"));
    // temp
    todayTemp.text(data.temp+" \u00B0F");
    // wind
    todayWind.text(data.wind_speed +" MPH");
    // humidity
    todayHumidity.text(data.humidity+"%");
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
                $(this).text("Temp: " + dayData.temp.day +" \u00B0F");
            }
            else if ($(this).hasClass("forecast-wind")){
                $(this).text("Wind: " + dayData.wind_speed + " MPH");
            }
            else if ($(this).hasClass("forecast-humidity")){
                $(this).text("Humidity: " + dayData.humidity + "%");
            }
            else if ($(this).hasClass("forecast-icon")){
                $(this).attr('src',"https://openweathermap.org/img/w/" + dayData.weather[0].icon + ".png");
            }
        })
        cnt++;
    })
}
// save search in local storage
function saveSearch(searchValue){
    var storedSearches = localStorage.getItem('searches');
    if(storedSearches){
        localStorage.setItem('searches',storedSearches+";"+searchValue);
    } else {
        localStorage.setItem('searches',searchValue);
    }
}

// load prev searches
function renderSearches(){
    // clear previously listed searches
    $(".past-search").remove();
    var storedSearches = localStorage.getItem('searches');
    if(storedSearches){
        var storedSearch = storedSearches.split(";");
        storedSearch = [...new Set(storedSearch)]; 
        cnt=0;
        for(i=storedSearch.length-1;i>=0;i--){
            cnt++;
            // only display last 10 searches
            if(cnt<10){
                var search = $("<div>")
                                    .addClass("card m-3 bg-secondary text-white text-center past-search")
                                    .data('search',storedSearch[i])
                                    .append($("<div>")
                                        .addClass("card-body")
                                        .text(storedSearch[i]));
                pastSearches.append(search);
            }
        }
        // add listener
        $(".past-search").on('click',searchPast);
    }
}

// past searches event handler
function searchPast(event){
    if($(this).data('search')){
        searchCoordinates($(this).data('search'))
    }
}

// search form event handler
function handleSearchFormSubmit(event) {
    event.preventDefault();

    var searchInputVal = document.querySelector('#search-input').value;

    if (!searchInputVal) {
        console.error('You need a search input value!');
        return;
    }
    saveSearch(searchInputVal);
    searchCoordinates(searchInputVal);
}
  
// default search - Atlanta
searchCoordinates("Atlanta");
$("#search-form").on('submit',handleSearchFormSubmit)

