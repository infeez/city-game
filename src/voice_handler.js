var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;

var recognition = new SpeechRecognition();
recognition.lang = 'ru-RU';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

function startRecording() {
    recognition.start();
}

recognition.onresult = function (event) {
    var cityName = event.results[event.results.length - 1][0].transcript;
    cityNameResult(cityName);
};

recognition.onspeechend = function () {
    recognition.stop();
};

recognition.onnomatch = function (event) {
    console.log(event);
};

recognition.onerror = function (event) {
    console.log(event.error);
};