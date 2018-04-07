var express = require("express");
var cors = require('cors');
var app = express();

app.use('/', express.static('img'));
app.use('/', express.static('css'));
app.use('/', express.static('src'));
app.use('/', express.static('semantic/dist'));
app.use(cors({credentials: true, origin: true}));
app.options('*', cors());


app.get('/', function (req, res) {
    res.sendFile('index.html', {root: __dirname});
});

app.listen(3000);

console.log("Running at Port 3000");