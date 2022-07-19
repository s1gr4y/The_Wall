//Util.js:
console.log("Nice too see you here...");

//vars for msg history, currently two since we might change system later.
let serverHistory = [];
let messageHistory = [];

//helper functions for clearing and adding to board.
function AddLine(text) {
	let element = document.getElementById("block");
	let node = document.createElement("p");
	//node.id = "";
	node.innerText = text;
    element.appendChild(node);
}

function RemoveAll() {
	document.getElementById("block").innerHTML = "";
}

function RefreshBoard() {
	RemoveAll();
	for (let i = 0; i < serverHistory.length; i++) {
		AddLine(serverHistory[i].text);
	}
}

//Main funcitonality below for getting/sending msgs.
//We send msg here and afterward request for new msgs list.
function GetAndResolveServerMsgList() {
	let xhr = new XMLHttpRequest();
	xhr.open('POST', '/update');
	xhr.onreadystatechange = function() {
		if (xhr.readyState == XMLHttpRequest.DONE) {
			//console.log("got");
			//console.log(xhr.responseText);
			serverHistory = JSON.parse(xhr.responseText);
			/*	//if we want continuous stream
			if (serverHistory.length > messageHistory.length) {
				//let linediff = serverHistory.length - messageHistory.length;
				for (let i = messageHistory.length; i < serverHistory.length; i++) {
					AddLine(serverHistory[i].text);
				}
			}
			*/
			messageHistory = serverHistory;
			RefreshBoard();
			//for (let i = 0; i < messageHistory.length; i++) {
			//	console.log("printing: " + messageHistory[i].text);
			//}
			//console.log("done sending");
		}
	};
	//xhr.open('POST', '/update');
	xhr.send(200);
}

//event listener to send msg to server then get new logs back.
let myTextBox = document.getElementById('user_inp');
myTextBox.addEventListener('keypress', function(key) {	//has passed in key so we know if it is 'enter'
	if (key.keyCode == 13) {	//keyCode for enter
		event.preventDefault();	//IMPORTATNT LINE: used so we don't redirect to page we request.
		//console.log(myTextBox.value);
		let text_val = {'text': myTextBox.value};
		
		let xhr = new XMLHttpRequest();
		xhr.open('POST', '/send');
		xhr.setRequestHeader('Content-Type', 'application/json');
		let infoStr = JSON.stringify(text_val);
		//xhr.status = 278;
		//console.log(infoStr);
		xhr.send(infoStr);
		
		GetAndResolveServerMsgList();
		
		//$.post("http://localhost:3000/ajax",{text: "info"});	//essentially trying to mirror this without jquery
		myTextBox.value= '';
	}
});

//update recursive function to get msg logs
///*
GetAndResolveServerMsgList();
let requestInterval = function() {
	setTimeout(function() {
		GetAndResolveServerMsgList();
		requestInterval();	//Initiate next getmsgs call
	}, 1500);
};
requestInterval();
//*/