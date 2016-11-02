// Initialize Firebase
var config = {
  apiKey: "AIzaSyAQ8JS_zLNF84BTlGV0vo-Y1xDLfuOpA7U",
  authDomain: "binitshahcom.firebaseapp.com",
  databaseURL: "https://binitshahcom.firebaseio.com",
  storageBucket: "",
  messagingSenderId: "493845300138"
};
firebase.initializeApp(config);
var localNumConvos;
var numMessage = 0;

$( document ).ready(function(){
  $(".button-collapse").sideNav();
})

// Create our RiveScript interpreter.
var rs = new RiveScript();

// Load our files from the brain/ folder.
rs.loadFile([
	"brain/begin.rive",
	"brain/clients.rive",
	"brain/eliza.rive",
	"brain/myself.rive",
	"brain/javascript.rive",
	"brain/binit.rive"
	], on_load_success, on_load_error);

// You can register objects that can then be called
// using <call></call> syntax
rs.setSubroutine('fancyJSObject', function(rs, args){
	// doing complex stuff here
});

function on_load_success () {
	// Now to sort the replies!
	rs.sortReplies();
}

function on_load_error (err) {
	console.log("Loading error: " + err);
}

// Handle sending a message to the bot.
function sendMessage () {
	firebase.database().ref('analytics/numConvos').once('value').then(function(snapshot) {
	  	if(localNumConvos == null){
		  	localNumConvos = snapshot.val();

		  	var added = localNumConvos + 1;
		  	firebase.database().ref('analytics/').update({
		  	    numConvos: added
		  	});
		}


	  	var text = $("#email").val();
	  	if(text === "") {
	  		Materialize.toast('Your message is empty!', 1000);
	  	}
	  	else {
	  		$("#email").val("");
	  		var firebasetext = "THEM: " + text;
	  		firebase.database().ref('conversations/' + localNumConvos).update({
	  		    [numMessage]: firebasetext
	  		});
	  		numMessage++;
	  		$("#appendable").append('<div style="text-align: right"><div class="them"> ' + text + '</div></div>');
	  		try {
	  		var reply = rs.reply("soandso", text);
	  		reply = reply.replace(/\n/g, "<br>");
	  		var firebasereply = "BOT: " + reply;
	  		firebase.database().ref('conversations/' + localNumConvos).update({
	  		    [numMessage]: firebasereply
	  		});
	  		numMessage++;
	  		botDots(reply);
	  		} catch(e) {
	  			window.alert(e.message + "\n" + e.line);
	  			console.log(e);
	  		}
	  	}
	});

	return false;
}

function botDots(reply){
	$("#appendable").append('<div id="dots"><div class="me"><img src="img/preloader_4.gif" style="margin-top:-10px; margin-bottom:-10px;"/></div></div>');
	$('html, body').animate({
        scrollTop: $("#textMessageInput").offset().top - 300
    }, 1000);
    var delay = 300 + ~~(Math.random()*(50)) + (reply.length*5);
    if(delay > 1500){
    	delay = 1500;
    }
	setTimeout(function () {
	   $("#dots").remove();
	   $("#appendable").append('<div><div class="me">' + reply + '</div></div>');
	   $('html, body').animate({
	        scrollTop: $("#textMessageInput").offset().top - 300
	    }, 1000);
	}, delay)
}