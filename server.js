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
let connectList = new Map();   //list of ips to give unique usernames (but not leak their ip)
let connectionCount = 0;
let getHitReqCount = 0;
let port = 3000;

if (process.argv[2] && !isNaN(process.argv[2])) {  //first cmd arg passed in to change port
    port = process.argv[2];
    //console.log("port is: " + port);
}

function inIpList(input_ip) {
    if (connectList.get(input_ip) == undefined) {
        connectList.set(input_ip, ++connectionCount);
    }
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

//I believe order matters here, yep need id first or it will halt after a few msgs for some reason, unsure still needs more testing


///*
//resolve msg sent from user.
app.post("/send", function(req, res) {
    //console.log("sent post");
    let text_value = req.body;
    text_value.number = 'msgNumber:'+counter++;
    //console.log("got: " + text_value.text);
    //console.log(text_value.text.length);
    if (text_value.text.length != 0) {  //no need for check anymore...
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
    //res.status(200);
});

//order matters for what gets resolved first for post, esp when getting id

//update the contents of msgs client side by sending them
app.post("/update", function(req, res) {
    //console.log("update post");
    //console.log("sent back: " + JSON.stringify(messageHistory));
    res.json(messageHistory);   //JSON.stringify(messageHistory)
    //res.status(200);
});

//get id for connected user
app.post("/id", function(req, res) {
    //console.log("sending id: " + connectionCount);
    if (connectList.get(req.ip) == undefined) {
        connectList.set(req.ip, ++connectionCount);
    }
    res.json(connectList.get(req.ip));   //JSON.stringify(messageHistory)
    //res.status(200);
});

//*/

//when site is reloaded or visited
app.get('/', function(req, res) {
    //console.log(req.method);
    //console.log("Received Request!");
    res.sendFile(path.join(__dirname+'/express/boardPage.html'));   //page matters here. i.e if we tried to send index.html, then it doesn't go through since it express defaults to it.
    res.status(200);
    inIpList(req.ip);
    getHitReqCount++;
    //res.json("user_"+connectionCount);
    //console.log("connection count: " + connectionCount);
});

const server = http.createServer(app);
server.listen(port, () => {
    console.log("Listening on http://localhost:" + port);
});