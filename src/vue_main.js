window.onload = function () {
    new Vue({
        el: '#app',
        data: {
            value: false,
            errorMessage: null,
            userCity: null,
            machineCity: null,
            yandexMap: null,
            cityList: new Set,
            gameCityList: new Set
        },
        methods: {
            initSpeechApi: function () {
                var context = this;
                window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                window.recognition = new SpeechRecognition();
                window.recognition.lang = 'ru-RU';
                window.recognition.interimResults = false;
                window.recognition.maxAlternatives = 1;
                window.recognition.onresult = function (event) {
                    var data = event.results[event.results.length - 1][0].transcript;
                    if (data.indexOf('*') > 0) {
                        context.errorMessage = 'Ругаться нельзя!';
                        return;
                    }
                    context.speechResult(data);
                };
                window.recognition.onspeechend = function () {
                    window.recognition.stop();
                };
                window.recognition.onnomatch = function (event) {
                    console.log(event);
                };
                window.recognition.onerror = function (event) {
                    console.log(event.error);
                };
            },
            initMap: function () {
                var context = this;
                ymaps.ready(function () {
                    context.yandexMap = new ymaps.Map("map", {
                        center: [55.76, 37.64],
                        zoom: 12
                    });
                });
            },
            initCityList: function () {
                var context = this;
                axios.get('ru_cities.csv')
                    .then(function (data) {
                        var cities = data.data.split('\n');
                        cities.forEach((function (city) {
                            context.cityList.add(city.split(',')[0]);
                        }));
                        for (var i = cities.length - 1; i > 0; i--) {
                            var j = Math.floor(Math.random() * (i + 1));
                            var temp = cities[i];
                            cities[i] = cities[j];
                            cities[j] = temp;
                        }
                    });
            },
            userActionButton: function () {
                window.recognition.start();
            },
            speechResult: function (data) {
                var context = this;
                axios.get('https://geocode-maps.yandex.ru/1.x/?format=json&geocode=' + data)
                    .then(function (ydata) {
                            var geoObject = ydata.data.response.GeoObjectCollection.featureMember[0].GeoObject;
                            var coords = geoObject.Point.pos.split(' ');
                            var lat = parseFloat(coords[1]);
                            var lon = parseFloat(coords[0]);
                            if (lat && lon && context.cityList.has(geoObject.name)) {
                                context.userCity = data;
                                context.yandexMap.setCenter([lat, lon]);
                                context.yandexMap.setZoom(12);
                                context.errorMessage = null;
                                context.machineStep(context.userCity);
                            } else {
                                context.userCity = null;
                                context.errorMessage = 'Некорректный город!';
                            }
                        }
                    );
            },
            machineStep: function (userCity) {
                var context = this;
                var lastCityGame = Array.from(context.gameCityList).pop();
                var firstSybmolUserCity = userCity[0].toLowerCase();
                if (lastCityGame) {
                    var lastCityGameLastSymbol = lastCityGame[lastCityGame.length - 1].toLowerCase();
                    if(lastCityGameLastSymbol == 'ь' || lastCityGameLastSymbol == 'ъ' || lastCityGameLastSymbol == 'ы'){
                        lastCityGameLastSymbol = lastCityGame[lastCityGame.length - 2].toLowerCase();
                    }
                    if(lastCityGameLastSymbol != firstSybmolUserCity) {
                        context.errorMessage = 'Вы назвали город не на ту букву!';
                        return;
                    }
                }
                var added = context.gameCityList.add(userCity);
                if (!added) {
                    context.errorMessage = 'Этот город уже был назван ранее!';
                    return;
                }
                var lastSybmolUserCity = userCity[userCity.length - 1].toLowerCase();
                if(lastSybmolUserCity == 'ь' || lastSybmolUserCity == 'ъ' || lastSybmolUserCity == 'ы'){
                    lastSybmolUserCity = userCity[userCity.length - 2].toLowerCase();
                }
                context.cityList.forEach(function (city) {
                    if (city[0].toLowerCase() == lastSybmolUserCity && !context.gameCityList.has(city)) {
                        context.machineCity = city;
                        context.gameCityList.add(city);
                        context.errorMessage = null;
                        return city;
                    }
                });
            }
        },
        mounted: function () {
            this.initCityList();
            this.initMap();
            this.initSpeechApi();
        }
    });
};