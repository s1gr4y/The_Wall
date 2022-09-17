//Util.js:
console.log("Nice too see you here...");

//vars for msg history, currently two since we might change system later.
let serverHistory = [];
let messageHistory = [];
let userId = -1;
let userNamePrepend = "";

//helper functions for clearing and adding to board.
function AddLine(text) {
	let element = document.getElementById("block");
	let node = document.createElement("p");
	//node.id = "";
	//console.log("adding: " + text);
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

function requestId() {
	let xhr = new XMLHttpRequest();
	xhr.open('POST', '/id');
	xhr.onreadystatechange = function() {
		if (xhr.readyState == XMLHttpRequest.DONE) {
			let data = JSON.parse(xhr.responseText);
			if (data <= -1) {
				return;
			}
			//console.log(data);
			userId = data;
			userNamePrepend = "user" + userId + ": ";
			document.getElementById('user_inp').setAttribute('maxlength', 83 - userNamePrepend.length);
		}
	};
	xhr.send(200);
}

function requestIdNoCookie() {
	let xhr = new XMLHttpRequest();
	xhr.open('POST', '/idC');
	xhr.onreadystatechange = function() {
		if (xhr.readyState == XMLHttpRequest.DONE) {
			let data = JSON.parse(xhr.responseText);
			//console.log(data);
			userId = data;
			userNamePrepend = "user" + userId + ": ";
			document.getElementById('user_inp').setAttribute('maxlength', 83 - userNamePrepend.length);
		}
	};
	xhr.send(200);
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
			for (let i = 0; i < serverHistory.length; i++) {
				if (messageHistory[i] == undefined || messageHistory[i].text !== serverHistory[i].text) {
					messageHistory = serverHistory;
					RefreshBoard();
					break;
				}
			}
			//for (let i = 0; i < messageHistory.length; i++) {
			//	console.log("printing: " + messageHistory[i].text);
			//}
			//console.log("done sending");
		}
	};
	xhr.timeout = 6000; // Set timeout for 6 sec until refresh site, might not be needed since we get ip on first get but might as well have
	xhr.ontimeout = function () {
		//console.log("refreshing");
		location.reload();
	};
	//xhr.open('POST', '/update');
	xhr.send(200);
}

function NoCookiesSendErr() {
	let xhr = new XMLHttpRequest();
	xhr.open('GET', '/404');
	xhr.onreadystatechange = function() {
		if (xhr.readyState == XMLHttpRequest.DONE) {	//
			window.location.href = '/404.html'
		}
	};
	xhr.send();
}


//end function defs
if (navigator.cookieEnabled) {
	requestId();
} else {
	console.log("calling no cookie vers");
	NoCookiesSendErr();
}


//event listener to send msg to server then get new logs back.
let myTextBox = document.getElementById('user_inp');
myTextBox.addEventListener('keypress', function(key) {	//has passed in key so we know if it is 'enter'
	if (key.keyCode == 13) {	//keyCode for enter
		event.preventDefault();	//IMPORTATNT LINE: used so we don't redirect to page we request.
		//console.log(myTextBox.value);
		let text_refactor = userNamePrepend + myTextBox.value;
		//console.log(text_refactor);
		//text_refactor.replace(/(\r\n|\n|\r)/gm, '');
		let text_val = {'text': text_refactor};	//'user' + userId + ': ' + myTextBox.value
		let raw_val = myTextBox.value;
		if (raw_val.length <= 0) {
			return;
		}
		
		let xhr = new XMLHttpRequest();
		xhr.open('POST', '/send');
		xhr.setRequestHeader('Content-Type', 'application/json');
		let infoStr = JSON.stringify(text_val);
		//xhr.status = 278;
		//console.log(infoStr);
		xhr.send(infoStr);
		
		GetAndResolveServerMsgList();
		
		myTextBox.value= '';
	}
});

//update recursive function to get msg logs
///*
GetAndResolveServerMsgList();
let requestInterval = function() {
	setTimeout(function() {
		if (navigator.cookieEnabled) {
			if (document.cookie.indexOf('userID=') == -1) {
				requestId();	//need to get new id
			}
		}
		
		GetAndResolveServerMsgList();
		requestInterval();	//Initiate next getmsgs call
	}, 1200);	//1.2 sec delay
};
requestInterval();
//*/