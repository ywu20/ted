//retrieve node in DOM via ID
var c = document.getElementById("slate");

// creates websocket
const websocket = new WebSocket("ws://localhost:6789/");

var ctx = c.getContext("2d");

var mode = "rect";

var toggleMode = (e) => {
  if (mode == "rect") {
    mode = "circle";
  }
  else {
    mode = "rect";
  }

}

// sending data to server
var send_mouse = function(e){
  var mouseX = e.offsetX;
  var mouseY = e.offsetY;
  console.log("sent to server "+mode+" "+mouseX+","+mouseY);
  websocket.send(JSON.stringify({"mode":mode, "xcor":mouseX, "ycor":mouseY}))
}

var drawRect = function(mouseX, mouseY) {
  ctx.fillStyle = "red";
  ctx.fillRect(mouseX, mouseY, 100, 200);

}

var drawCircle = function(mouseX, mouseY) {
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(mouseX, mouseY, 50, 0, 2*Math.PI);
  ctx.fill();
}

var wipeCanvas = function() {
  ctx.clearRect(0, 0, c.clientWidth, c.clientHeight);
}

// the click button would send coordinates to all instead of drawing
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
                                  }
                         );

var clearB = document.getElementById("buttonClear");
clearB.addEventListener('click', function(){

    // send to  server to wipe for all
    console.log("sent to server wipe -1,-1");
    websocket.send(JSON.stringify({"mode":"wipe"}));})

// gets data from server to see where / what to draw
websocket.onmessage=({data})=>{
  // parse data from server
  const event = JSON.parse(data);

  console.log("recieved from server:");
  console.log(event);

  // determine what/ where to draw
  if(event.mode=="rect"){
    drawRect(event.xcor,event.ycor);
  }else if (event.mode == "circle"){
    drawCircle(event.xcor, event.ycor);
  }else if (event.mode == "wipe"){
    wipeCanvas();
  }else if(event.type == "users"){
    console.log(event.count+" users are online");
  }
}
