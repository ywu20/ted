//retrieve node in DOM via ID
var c = document.getElementById("slate");

// creates websocket
const websocket = new WebSocket("ws://localhost:6789/");

//instatiate a CanvasRenderingContext2D object
var ctx = c.getContext("2d");

//init global state var
var mode = "rect";

var toggleMode = (e) => {
  if (mode == "rect") {
    mode = "circle";
  }
  else {
    mode = "rect";
  }

}

var send_mouse = function(e){
  var mouseX = e.offsetX;
  var mouseY = e.offsetY;
  console.log("sent to server "+mode+" "+mouseX+","+mouseY);
  websocket.send(mode+" "+mouseX+","+mouseY);
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

//var wipeCanvas = () => {}
var wipeCanvas = function() {
  ctx.clearRect(0, 0, c.clientWidth, c.clientHeight);
}

c.addEventListener('click', send_mouse);

//rect|circ button
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

var clearB = document.getElementById("buttonClear"); //wipe button
clearB.addEventListener('click', function(){
    console.log("sent to server wipe -1,-1");
    websocket.send("wipe "+"-1,-1");}); //doesn't need () because just fxnName

websocket.onmessage=({data})=>{
  const event = JSON.parse(data);
  console.log("recieved from server:");
  console.log(event);
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
