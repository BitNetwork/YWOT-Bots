var lib_webSocket = require("websocket");
var lib_chalk = require("chalk");


var ws = new lib_webSocket.client();

ws.on("connectFailed", function(error) {
  console.log(lib_chalk.red.bgYellow.bold("Connect Error: " + error.toString()));
});

ws.on("connect", function(conx) {

  console.log(lib_chalk.green.bgCyan.bold("WebSocket Client Connected!"));

  conx.on("error", function(error) {
    console.log(lib_chalk.red.bgYellow.bold("Connection Error: " + error.toString()));
  });

  conx.on("close", function() {
    console.log(lib_chalk.red.bgYellow.bold("Connection Closed!"));
  });

  setTimeout(function() {
    conx.on("message", function(message) {
      if (message.type === "utf8") {
        //console.log(lib_chalk.black.bgWhite.bold("Received: " + message.utf8Data));
        var json = JSON.parse(message.utf8Data);
        if (json.source === "write" && json.kind === "tileUpdate") {
          //Do stuff here...
        }
      }
    });
  }, 10000);


  var x = 1;
  var y = 0;

  var timeInterval = setInterval(function() {
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    conx.send(JSON.stringify({kind: "write", edits: [
      [x, y, 1, 4, Date.now, (hours.toString().length === 2 ? hours.toString()[0] : "0"), 1],
      [x, y, 1, 5, Date.now, (hours.toString().length === 2 ? hours.toString()[1] : hours.toString()[0]), 1],
      [x, y, 1, 6, Date.now, ":", 1],
      [x, y, 1, 7, Date.now, (minutes.toString().length === 2 ? minutes.toString()[0] : "0"), 1],
      [x, y, 1, 8, Date.now, (minutes.toString().length === 2 ? minutes.toString()[1] : minutes.toString()[0]), 1],
      [x, y, 1, 9, Date.now, ":", 1],
      [x, y, 1, 10, Date.now, (seconds.toString().length === 2 ? seconds.toString()[0] : "0"), 1],
      [x, y, 1, 11, Date.now, (seconds.toString().length === 2 ? seconds.toString()[1] : seconds.toString()[0]), 1]
    ]}));
  }, 1000);

  //*/

});

ws.connect("wss://www.yourworldoftext.com/ws/");
