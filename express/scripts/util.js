//Util.js:
console.log("Nice too see you here...");

let serverHistory = [];
let messageHistory = [];

function GetAndResolveServerMsgList() {
	xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == XMLHttpRequest.DONE) {
			//console.log("got");
			//console.log(xhr.responseText);
			serverHistory = JSON.parse(xhr.responseText);
			messageHistory = serverHistory;
			//for (let i = 0; i < messageHistory.length; i++) {
			//	console.log("printing: " + messageHistory[i].text);
			//}
			//console.log("done sending");
			RemoveAll();
			for (let i = 0; i < serverHistory.length; i++) {
				//console.log("addng: " + serverHistory[i].text);
				AddLine(serverHistory[i].text);
			}
		}
	};
	xhr.open('POST', '/update');
	xhr.send(200);
}


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

function resolveTextInput() {
	//need to resolve server vs local msgs
	getServerMsgList();
	RemoveAll();
	for (let i = 0; i < serverHistory.length; i++) {
		//console.log("addng: " + serverHistory[i].text);
		AddLine(serverHistory[i].text);
	}
}


let myTextBox = document.getElementById('user_inp');
myTextBox.addEventListener('keypress', function(key) {
	if (key.keyCode == 13) {	//keyCode for enter
		event.preventDefault();
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
		
		//$.post("http://localhost:3000/ajax",{text: "info"});
		//resolveTextInput();
		myTextBox.value= '';
	}
});


GetAndResolveServerMsgList();
///*
let requestInterval = function() {
	setTimeout(function() {
		GetAndResolveServerMsgList();
		requestInterval();	//Initiate next fetch
	}, 2000);
};
requestInterval();
//*/
