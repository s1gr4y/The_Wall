const http = require('http');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
//const fetch = require("node-fetch");
//const fs = require('fs')
const app = express();

app.use(express.json());
app.use(express.static("express"));
app.use(bodyParser.urlencoded({extended: true}));

let maxSize = 19;
let counter = 0;
let messageHistory = [];    //new Array.apply(null, Array(maxSize)).map(function () {});
let connectionCount = 0;

/*  //for basic no express
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    fs.readFile(__dirname+'/express/index.html', 'utf-8', function(err, data) {
        res.write(data);
    });
});

const port = 3000;
server.listen(port, () => {
    console.log("Listening on port: " + port);
});
*/




app.post("/send", function(req, res) {
    let text_value = req.body;
    text_value.number = 'msgNumber:'+counter++;
    //console.log("got: " + req.body);
    if (text_value == undefined || text_value.text.length != 0) {   //==
        //console.log(text_value.length);
        messageHistory.push(text_value);
        let overflow = messageHistory.length - maxSize;
        for (let i = 0; i < overflow; i++) {
             messageHistory.shift();
        }
    }
    //res.status(200).send({text: text_value});
    console.log("msgs");
    for (i = 0; i < messageHistory.length; i++) {
        console.log(i + ' ' + messageHistory[i].text);
    }
    res.json({'status': 200});
});

app.post("/update", function(req, res) {
    //console.log("sent back: " + JSON.stringify(messageHistory));
    res.json(messageHistory);   //JSON.stringify(messageHistory)
});


app.use('/', function(req, res) {
    //console.log(req.method);
    res.sendFile(path.join(__dirname+'/express/index.html'));   //res.sendFile(path.join(__dirname+'/express/index.html'));
    //res.json("user_"+connectionCount);
    console.log("Received Request!");
});


const server = http.createServer(app);
const port = 3000;
server.listen(port, () => {
    console.log("Listening on port: " + port);
});