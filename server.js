const http = require('http');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

app.use(express.json());
app.use(express.static("express"));
app.use(bodyParser.urlencoded({extended: true}));

//server vars
let maxSize = 19;
let counter = 0;
let messageHistory = [];    //new Array.apply(null, Array(maxSize)).map(function () {});
let connectionCount = 0;
let port = 3000;

if (process.argv[2] && !isNaN(process.argv[2])) {  //first cmd arg passed in to change port
    port = process.argv[2];
    //console.log("port is: " + port);
}

/*  //for basic with no express
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

//I believe order matters here
///*
//resolve msg sent from user.
app.post("/send", function(req, res) {
    //console.log("sent post");
    let text_value = req.body;
    text_value.number = 'msgNumber:'+counter++;
    //console.log("got: " + text_value.text);
    //console.log(text_value.text.length);
    if (text_value.text.length != 0) {
        messageHistory.push(text_value);
        
        //this is for rate limiting by shifting history back, similar to queue of msgs.
        let overflow = messageHistory.length - maxSize;
        for (let i = 0; i < overflow; i++) {
             messageHistory.shift();
        }

    }
    //res.status(200).send({text: text_value});
    //console.log("msgs");
    //for (i = 0; i < messageHistory.length; i++) {
    //    console.log(i + ' ' + messageHistory[i].text);
    //}
    res.json({'status': 200});
});

app.post("/update", function(req, res) {
    //console.log("update post");
    //console.log("sent back: " + JSON.stringify(messageHistory));
    res.json(messageHistory);   //JSON.stringify(messageHistory)
});
//*/

//when site is reloaded or visited
app.use('/', function(req, res) {
    //console.log(req.method);
    //console.log("Received Request!");
    res.sendFile(path.join(__dirname+'/express/boardPage.html'));   //page matters here. i.e if we tried to send index.html, then it doesn't go through since it express defaults to it.
    res.status(200);
    connectionCount++;
    //res.json("user_"+connectionCount);
    //console.log("connection count: " + connectionCount);
});

const server = http.createServer(app);
server.listen(port, () => {
    console.log("Listening on http://localhost:" + port);
});