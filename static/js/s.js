window.addEventListener("DOMContentLoaded", () => {

  const websocket = new WebSocket("ws://localhost:6789/");


  document.querySelector(".minus").addEventListener("click", () => {
    websocket.send(JSON.stringify({ action: "minus" }));
  });


  document.querySelector(".plus").addEventListener("click", () => {
    websocket.send(JSON.stringify({ action: "plus" }));
  });


  websocket.onmessage = ({ data }) => {

    const event = JSON.parse(data);
    console.log(data)

    switch (event.type) {

      case "value":

        document.querySelector(".value").textContent = event.value;
        break;

      case "users":

        const users = `${event.count} user${event.count == 1 ? "" : "s"}`;
        document.querySelector(".users").textContent = users;
        break;

      default:
        console.error("unsupported event", event);

    }
  };

//canvas buttons

  //retrieve node in DOM via ID
  var c = document.getElementById('board');

  //instantiate a CanvasRenderingContext2D object
  var ctx = c.getContext("2d")

  //init global state var
  var mode = "rect";

  // var toggleMode = function(e) {
  // false = rect | true = circle
  var toggleMode = (e) => {
    console.log("toggling.. ");
    var check = document.getElementById('buttonToggle');
    // window.alert(check);
    if (mode ==="rect"){
      mode = "circ"
      check.innerText = "circle"
      console.log("toggled true(circle) successfully")
    }
    else {
      mode = "rect"
      check.innerText = "rect"
      console.log("toggled false(rect) successfully")
    }
  }

  var drawRect = function(e) {
    var mouseX = e.offsetX
    var mouseY = e.offsetY
    console.log("mouseclick registered at ", mouseX, mouseY);

    ctx.beginPath();
    ctx.rect(mouseX, mouseY, 50, 100);
    ctx.fillStyle = "pink";
    ctx.fill();
  }

  // var drawircle = function(e) {
  var drawCircle = (e) => {
    var mouseX = e.offsetX
    var mouseY = e.offsetY
    console.log ("mouseclick registered at ", mouseX, mouseY);

    ctx.beginPath();
    ctx.arc(mouseX, mouseY, 50, 0, 360);
    ctx.fillStyle = "red";
    ctx.fill();
  }

  // var draw = function(e) {
  var draw = (e) => {
    if (mode === "rect") {
      drawRect(e);
    }
    else {
      drawCircle(e);
    }
  }

  // var wipeCanvas = function() {
  var wipeCanvas = () => {
    ctx.clearRect(0, 0, c.clientWidth, c.clientHeight);
  }

  c.addEventListener("click", draw);
  var bToggler = document.getElementById('buttonToggle');
  bToggler.addEventListener("click", toggleMode);
  var clearB = document.getElementById('buttonClear');
  clearB.addEventListener("click", wipeCanvas);

});
