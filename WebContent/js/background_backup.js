chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
	sendResponse({data: localStorage[request.key]});
});