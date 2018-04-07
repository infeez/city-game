var cities = new Set;

function addCity(name) {
    var add = cities.add(name.toLowerCase());
    console.log(add);
    return add;
}

function getCitie() {
    getCities.then(function (value) { console.log(value) })
}