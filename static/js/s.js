//retrieve node in DOM via ID
var c = document.getElementById("slate");

// creates websocket
const websocket = new WebSocket("ws://localhost:6789/");

//instatiate a CanvasRenderingContext2D object
var ctx = c.getContext("2d");

//init global state var
var mode = "rect";

var toggleMode = (e) => {
  console.log("toggling...");
  if (mode == "rect") {
    mode = "circle";
  }
  else {
    mode = "rect";
  }
  console.log(mode);
}
var send_mouse = function(e){
  var mouseX = e.offsetX;
  var mouseY = e.offsetY;
  console.log(mouseX+","+mouseY);
  websocket.send(mode+" "+mouseX+","+mouseY);
}

var drawRect = function(mouseX, mouseY) {
  //var mouseX = e.offsetX;
  //var mouseY = e.offsetY;
  console.log("mouseClick registered at ", mouseX, mouseY);
  ctx.fillStyle = "red";
  ctx.fillRect(mouseX, mouseY, 100, 200);

}

var drawCircle = function(mouseX, mouseY) {
  console.log("mouseClick registered at ", mouseX, mouseY);
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(mouseX, mouseY, 50, 0, 2*Math.PI);
  ctx.fill();
}

var draw = function(e) {
  if (mode == "rect") {
    drawRect(e);
  }
  else {
    drawCircle(e);
  }
  console.log("drew shape");
}

//var wipeCanvas = () => {}
var wipeCanvas = function() {
  ctx.clearRect(0, 0, c.clientWidth, c.clientHeight);
  console.log("wiped");
  websocket.send("wipe "+"-1,-1");
}

c.addEventListener('click', send_mouse);

var bToggler = document.getElementById("buttonToggle"); //rect|circ button
bToggler.addEventListener('click', function() {
                                    toggleMode();
                                    if (mode == "rect") {
                                      bToggler.innerHTML = "Rectangle";
                                    }
                                    else {
                                      bToggler.innerHTML = "Circle";
                                    }
                                  }
                         ); //switch between rectange and circle

var clearB = document.getElementById("buttonClear"); //wipe button
clearB.addEventListener('click', wipeCanvas); //doesn't need () because just fxnName

websocket.onmessage=({data})=>{
  const event = JSON.parse(data);
  console.log(event);
  if(event.mode=="rect"){
    drawRect(event.xcor,event.ycor);
  }else if (event.mode == "circle"){
    drawCircle(event.xcor, event.ycor);
  }else if (event.mode == "wipe"){
    wipeCanvas();
  }
}
