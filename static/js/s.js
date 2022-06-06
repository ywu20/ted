//retrieve node in DOM via ID
var c = document.getElementById("slate");
var ctx = c.getContext("2d");
var mode = "rect";

var socket;
$(document).ready(function() {
    // // The http vs. https is important. Use http for localhost!
    socket = io.connect('http://' + document.domain + ':' + location.port);
    //
    // var text = {{"mode":mode, "xcor":mouseX, "ycor":mouseY}};}
    //
    // // Update the chat window
    // document.getElementById("chat").innerHTML += "You: " + text + "\n\n";
    //
    // // Emit a message to the 'send_message' socket
    // socket.emit('send_mouse', {'text':text});
    console.log("socket is ready");
});


//standard functions
var toggleMode = (e) => {
  if (mode == "rect") {
    mode = "circle";
  }
  else {
    mode = "rect";
  }
};


var send_mouse = function(e){
  var mouseX = e.offsetX;
  var mouseY = e.offsetY;
  // websocket.send(JSON.stringify({"mode":mode, "xcor":mouseX, "ycor":mouseY}))
  socket.emit('send_mouse', {"mode":mode, "xcor":mouseX, "ycor":mouseY});
  console.log("sent to server "+mode+" "+mouseX+", "+mouseY);
};

var drawRect = function(mouseX, mouseY) {
  ctx.fillStyle = "red";
  ctx.fillRect(mouseX, mouseY, 100, 200);
};

var drawCircle = function(mouseX, mouseY) {
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(mouseX, mouseY, 50, 0, 2*Math.PI);
  ctx.fill();
};

var wipeCanvas = function() {
  ctx.clearRect(0, 0, c.clientWidth, c.clientHeight);
};

// eventlisteners
// var c = document.getElementById("slate");
c.addEventListener('click', send_mouse);

var bToggler = document.getElementById("buttonToggle");
bToggler.addEventListener('click', function() {
  toggleMode();
  if (mode == "rect") {
    bToggler.innerHTML = "Rectangle";
  }
  else {
    bToggler.innerHTML = "Circle";
  }
});

var clearB = document.getElementById("buttonClear");
clearB.addEventListener('click', function(){
    // send to  server to wipe for all
    // websocket.send(JSON.stringify({"mode":"wipe"}));
    socket.emit('send_mouse', {"mode":wipe});
    console.log("sent to server wipe -1,-1");
});

// socketio function
socket.on('message_from_server', function(data) {
    var text = data['text'];
    console.log(text);
});

socket.on('draw_to_all', function(data) {
    const event = JSON.parse(data);
    if(event.mode=="rect"){
      drawRect(event.xcor,event.ycor);
    }else if (event.mode == "circle"){
      drawCircle(event.xcor, event.ycor);
    }else if (event.mode == "wipe"){
      wipeCanvas();
    }
});
