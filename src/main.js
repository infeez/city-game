var cityNameField;
var map;
var gameLabel;

$(document).ready(function () {
    cityNameField = $('#city-name');
    $('#voice').click(function () {
        startRecording();
    });
    $('#go').click(function () {
        addCity(cityNameField.val())
    });
});

ymaps.ready(function () {
    map = new ymaps.Map("map", {
        center: [55.76, 37.64],
        zoom: 12
    });
});

function cityNameResult(name) {
    cityNameField.val(name);
    geocode(name)
}

function geocode(name) {
    $.ajax({
        url: 'https://geocode-maps.yandex.ru/1.x/?format=json&geocode=' + name,
        success: function (data) {
            var strings = data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(" ");
            map.setCenter([parseFloat(strings[1]), parseFloat(strings[0])]);
            map.setZoom(12);
        }
    });
}

var vkCities = new Promise(function (resolve, reject) {
    $.ajax({
        type: "GET",
        crossDomain: true,
        dataType: 'jsonp',
        url: 'https://api.vk.com/api.php?oauth=1&method=database.getCities&v=5.5&country_id=1&need_all=1&offset500&count=1000',
        success: function (data) {
            resolve(data);
        }
    });
});

