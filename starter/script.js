
const weatherAPIURL = "https://api.openweathermap.org"
const weatherAPIKey = "dc6abd70048280b4a4f99b71b3881fe0"
let searchHistory = []


let searchInput = $("#search-input");
let searchForm = $("#search-form");
let searchHistoryContainer = $("#history")

function renderSearchHistory() {

    searchHistoryContainer.html("")

    for (let i = 0; i < searchHistory.length; i++) {
        let btn = $("<button>");
        btn.attr("type", "button")
        btn.addClass(" history-btn btn-history")

        btn.attr("data-search", searchHistory[i])
        btn.text(searchHistory[i])
        searchHistoryContainer.append(btn)

    }
}

function appendSearchHistory(search) {

    if (searchHistory.indexOf(search) !== -1) {
        return
    }
    searchHistory.push(search)

    localStorage.setItem("search-history", JSON.stringify(searchHistory))
    renderSearchHistory()
}

function fetchWeather(location) {

    let latitude = location.lat;
    let longitude = location.lon;
    let city = location.name;

    let queryWeatherURL = `${weatherAPIURL}/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${weatherAPIKey}`;
    console.log(queryWeatherURL);

    console.log("hello")
    $.ajax({
        url: queryWeatherURL,
        method: "GET"

    }).then(function (response) {
        renderCurrentWeather(city, response.list[0])
    })
}

function fetchCoord(search) {
    let queryURL = `${weatherAPIURL}/geo/1.0/direct?q=${search}&limit=5&appid=${weatherAPIKey}`;
    console.log(queryURL)
    fetch(queryURL, { method: "GET" }).then(function (data) {
        return data.json()
    }).then(function (response) {
        if (!response[0]) {
            alert("location not found")
        } else {
            appendSearchHistory(search)
            fetchWeather(response[0])
        }
    })
}

function initializeHistory() {
    let storedHistory = localStorage.getItem("search-history")

    if (storedHistory) {
        searchHistory = JSON.parse(storedHistory)
    }

    renderSearchHistory()
}


function submitSearchForm(event) {

    event.preventDefault();
    let search = searchInput.val().trim();

    fetchCoord(search)
    searchInput.val("");

}

initializeHistory()
searchForm.on("submit", submitSearchForm)





