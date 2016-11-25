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
        console.log(lib_chalk.black.bgWhite.bold("Received: " + message.utf8Data));
        var json = JSON.parse(message.utf8Data);
        if (json.source === "write" && json.kind === "tileUpdate") {
          //Do stuff here...
        }
      }
    });
  }, 10000);


  var x = 2;
  var y = 1;

  function drawDigit(digit, absX, absY, relX, relY) {
    switch (digit) {
      case 1:
        conx.send(JSON.stringify({kind: "write", edits: [
          [absX, absY, relX, relY, Date.now, " ", 1],
          [absX, absY, relX + 1, relY, Date.now, " ", 1],
          [absX, absY, relX + 2, relY, Date.now, " ", 1],

          [absX, absY, relX, relY + 1, Date.now, " ", 1],
          [absX, absY, relX + 1, relY + 1, Date.now, "|", 1],
          [absX, absY, relX + 2, relY + 1, Date.now, "|", 1],

          [absX, absY, relX, relY + 2, Date.now, " ", 1],
          [absX, absY, relX + 1, relY + 2, Date.now, " ", 1],
          [absX, absY, relX + 2, relY + 2, Date.now, " ", 1]
        ]}));
        break;
      case 2:
        conx.send(JSON.stringify({kind: "write", edits: [
          [absX, absY, relX, relY, Date.now, " ", 1],
          [absX, absY, relX + 1, relY, Date.now, " ", 1],
          [absX, absY, relX + 2, relY, Date.now, "|", 1],

          [absX, absY, relX, relY + 1, Date.now, "_", 1],
          [absX, absY, relX + 1, relY + 1, Date.now, "_", 1],
          [absX, absY, relX + 2, relY + 1, Date.now, "_", 1],

          [absX, absY, relX, relY + 2, Date.now, " ", 1],
          [absX, absY, relX + 1, relY + 2, Date.now, "|", 1],
          [absX, absY, relX + 2, relY + 2, Date.now, " ", 1],
        ]}));
        break;
      case 3:
        conx.send(JSON.stringify({kind: "write", edits: [
          [absX, absY, relX, relY, Date.now, " ", 1],
          [absX, absY, relX + 1, relY, Date.now, " ", 1],
          [absX, absY, relX + 2, relY, Date.now, " ", 1],

          [absX, absY, relX, relY + 1, Date.now, "_", 1],
          [absX, absY, relX + 1, relY + 1, Date.now, "_", 1],
          [absX, absY, relX + 2, relY + 1, Date.now, "_", 1],

          [absX, absY, relX, relY + 2, Date.now, " ", 1],
          [absX, absY, relX + 1, relY + 2, Date.now, "|", 1],
          [absX, absY, relX + 2, relY + 2, Date.now, "|", 1],
        ]}));
        break;
      case 4:
        conx.send(JSON.stringify({kind: "write", edits: [
          [absX, absY, relX, relY, Date.now, " ", 1],
          [absX, absY, relX + 1, relY, Date.now, "|", 1],
          [absX, absY, relX + 2, relY, Date.now, " ", 1],

          [absX, absY, relX, relY + 1, Date.now, " ", 1],
          [absX, absY, relX + 1, relY + 1, Date.now, "_", 1],
          [absX, absY, relX + 2, relY + 1, Date.now, " ", 1],

          [absX, absY, relX, relY + 2, Date.now, " ", 1],
          [absX, absY, relX + 1, relY + 2, Date.now, "|", 1],
          [absX, absY, relX + 2, relY + 2, Date.now, "|", 1],
        ]}));
        break;
      case 5:
        conx.send(JSON.stringify({kind: "write", edits: [
          [absX, absY, relX, relY, Date.now, " ", 1],
          [absX, absY, relX + 1, relY, Date.now, "|", 1],
          [absX, absY, relX + 2, relY, Date.now, " ", 1],

          [absX, absY, relX, relY + 1, Date.now, "_", 1],
          [absX, absY, relX + 1, relY + 1, Date.now, "_", 1],
          [absX, absY, relX + 2, relY + 1, Date.now, "_", 1],

          [absX, absY, relX, relY + 2, Date.now, " ", 1],
          [absX, absY, relX + 1, relY + 2, Date.now, " ", 1],
          [absX, absY, relX + 2, relY + 2, Date.now, "|", 1],
        ]}));
        break;
      case 6:
        conx.send(JSON.stringify({kind: "write", edits: [
          [absX, absY, relX, relY, Date.now, " ", 1],
          [absX, absY, relX + 1, relY, Date.now, "|", 1],
          [absX, absY, relX + 2, relY, Date.now, "|", 1],

          [absX, absY, relX, relY + 1, Date.now, "_", 1],
          [absX, absY, relX + 1, relY + 1, Date.now, "_", 1],
          [absX, absY, relX + 2, relY + 1, Date.now, "_", 1],

          [absX, absY, relX, relY + 2, Date.now, " ", 1],
          [absX, absY, relX + 1, relY + 2, Date.now, " ", 1],
          [absX, absY, relX + 2, relY + 2, Date.now, "|", 1],
        ]}));
        break;
      case 7:
        conx.send(JSON.stringify({kind: "write", edits: [
          [absX, absY, relX, relY, Date.now, " ", 1],
          [absX, absY, relX + 1, relY, Date.now, " ", 1],
          [absX, absY, relX + 2, relY, Date.now, " ", 1],

          [absX, absY, relX, relY + 1, Date.now, "_", 1],
          [absX, absY, relX + 1, relY + 1, Date.now, " ", 1],
          [absX, absY, relX + 2, relY + 1, Date.now, " ", 1],

          [absX, absY, relX, relY + 2, Date.now, " ", 1],
          [absX, absY, relX + 1, relY + 2, Date.now, "|", 1],
          [absX, absY, relX + 2, relY + 2, Date.now, "|", 1],
        ]}));
        break;
      case 8:
        conx.send(JSON.stringify({kind: "write", edits: [
          [absX, absY, relX, relY, Date.now, " ", 1],
          [absX, absY, relX + 1, relY, Date.now, "|", 1],
          [absX, absY, relX + 2, relY, Date.now, "|", 1],

          [absX, absY, relX, relY + 1, Date.now, "_", 1],
          [absX, absY, relX + 1, relY + 1, Date.now, "_", 1],
          [absX, absY, relX + 2, relY + 1, Date.now, "_", 1],

          [absX, absY, relX, relY + 2, Date.now, " ", 1],
          [absX, absY, relX + 1, relY + 2, Date.now, "|", 1],
          [absX, absY, relX + 2, relY + 2, Date.now, "|", 1],
        ]}));
        break;
      case 9:
        conx.send(JSON.stringify({kind: "write", edits: [
          [absX, absY, relX, relY, Date.now, " ", 1],
          [absX, absY, relX + 1, relY, Date.now, "|", 1],
          [absX, absY, relX + 2, relY, Date.now, " ", 1],

          [absX, absY, relX, relY + 1, Date.now, "_", 1],
          [absX, absY, relX + 1, relY + 1, Date.now, "_", 1],
          [absX, absY, relX + 2, relY + 1, Date.now, " ", 1],

          [absX, absY, relX, relY + 2, Date.now, " ", 1],
          [absX, absY, relX + 1, relY + 2, Date.now, "|", 1],
          [absX, absY, relX + 2, relY + 2, Date.now, "|", 1],
        ]}));
        break;
      case 0:
        conx.send(JSON.stringify({kind: "write", edits: [
          [absX, absY, relX, relY, Date.now, " ", 1],
          [absX, absY, relX + 1, relY, Date.now, "|", 1],
          [absX, absY, relX + 2, relY, Date.now, "|", 1],

          [absX, absY, relX, relY + 1, Date.now, "_", 1],
          [absX, absY, relX + 1, relY + 1, Date.now, " ", 1],
          [absX, absY, relX + 2, relY + 1, Date.now, "_", 1],

          [absX, absY, relX, relY + 2, Date.now, " ", 1],
          [absX, absY, relX + 1, relY + 2, Date.now, "|", 1],
          [absX, absY, relX + 2, relY + 2, Date.now, "|", 1],
        ]}));
        break;
    }

  }

  var timeInterval = setInterval(function() {
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    //drawDigit(parseInt(seconds.toString()[seconds.toString().length - 1]), x, y, 2, 3);
    console.log(date);
    drawDigit((hours.toString().length === 2 ? parseInt(hours.toString()[0]) : 0), x, y, 2, 2);
    drawDigit((hours.toString().length === 2 ? parseInt(hours.toString()[1]) : parseInt(hours.toString()[0])), x, y, 2, 5);
    drawDigit((minutes.toString().length === 2 ? parseInt(minutes.toString()[0]) : 0), x, y, 2, 9);
    drawDigit((minutes.toString().length === 2 ? parseInt(minutes.toString()[1]) : parseInt(minutes.toString()[0])), x, y, 2, 12);
    drawDigit((seconds.toString().length === 2 ? parseInt(seconds.toString()[0]) : 0), x, y + 1, 2, 0);
    drawDigit((seconds.toString().length === 2 ? parseInt(seconds.toString()[1]) : parseInt(seconds.toString()[0])), x, y + 1, 2, 3);

  }, 1000);

  var designInterval = setInterval(function() {
    conx.send(JSON.stringify({kind: "write", edits: [
      [x, y, 0, 0, Date.now, "┌", 1],
      [x, y, 0, 1, Date.now, "─", 1],
      [x, y, 0, 2, Date.now, "─", 1],
      [x, y, 0, 3, Date.now, "─", 1],
      [x, y, 0, 4, Date.now, "─", 1],
      [x, y, 0, 5, Date.now, "─", 1],
      [x, y, 0, 6, Date.now, "─", 1],
      [x, y, 0, 7, Date.now, "─", 1],
      [x, y, 0, 8, Date.now, "─", 1],
      [x, y, 0, 9, Date.now, "─", 1],
      [x, y, 0, 10, Date.now, "─", 1],
      [x, y, 0, 11, Date.now, "─", 1],
      [x, y, 0, 12, Date.now, "─", 1],
      [x, y, 0, 13, Date.now, "─", 1],
      [x, y, 0, 14, Date.now, "─", 1],
      [x, y, 0, 15, Date.now, "─", 1],
      [x, y + 1, 0, 0, Date.now, "─", 1],
      [x, y + 1, 0, 1, Date.now, "─", 1],
      [x, y + 1, 0, 2, Date.now, "─", 1],
      [x, y + 1, 0, 3, Date.now, "─", 1],
      [x, y + 1, 0, 4, Date.now, "─", 1],
      [x, y + 1, 0, 5, Date.now, "─", 1],
      [x, y + 1, 0, 6, Date.now, "─", 1],
      [x, y + 1, 0, 7, Date.now, "─", 1],
      [x, y + 1, 0, 8, Date.now, "─", 1],
      [x, y + 1, 0, 9, Date.now, "─", 1],
      [x, y + 1, 0, 10, Date.now, "─", 1],
      [x, y + 1, 0, 11, Date.now, "─", 1],
      [x, y + 1, 0, 12, Date.now, "─", 1],
      [x, y + 1, 0, 13, Date.now, "─", 1],
      [x, y + 1, 0, 14, Date.now, "─", 1],
      [x, y + 1, 0, 15, Date.now, "─", 1],
      [x, y + 1, 0, 15, Date.now, "┐", 1],

      [x, y, 1, 0, Date.now, "│", 1],
      [x, y + 1, 1, 15, Date.now, "│", 1],

      [x, y, 2, 0, Date.now, "│", 1],
      [x, y + 1, 2, 15, Date.now, "│", 1],

      [x, y, 3, 0, Date.now, "│", 1],
      [x, y + 1, 3, 15, Date.now, "│", 1],

      [x, y, 4, 0, Date.now, "│", 1],
      [x, y + 1, 4, 15, Date.now, "│", 1],

      [x, y, 5, 0, Date.now, "│", 1],
      [x, y + 1, 5, 15, Date.now, "│", 1],

      [x, y, 6, 0, Date.now, "└", 1],
      [x, y, 6, 1, Date.now, "─", 1],
      [x, y, 6, 2, Date.now, "─", 1],
      [x, y, 6, 3, Date.now, "─", 1],
      [x, y, 6, 4, Date.now, "─", 1],
      [x, y, 6, 5, Date.now, "─", 1],
      [x, y, 6, 6, Date.now, "─", 1],
      [x, y, 6, 7, Date.now, "─", 1],
      [x, y, 6, 8, Date.now, "─", 1],
      [x, y, 6, 9, Date.now, "─", 1],
      [x, y, 6, 10, Date.now, "─", 1],
      [x, y, 6, 11, Date.now, "─", 1],
      [x, y, 6, 12, Date.now, "─", 1],
      [x, y, 6, 13, Date.now, "─", 1],
      [x, y, 6, 14, Date.now, "─", 1],
      [x, y, 6, 15, Date.now, "─", 1],
      [x, y + 1, 6, 0, Date.now, "─", 1],
      [x, y + 1, 6, 1, Date.now, "─", 1],
      [x, y + 1, 6, 2, Date.now, "─", 1],
      [x, y + 1, 6, 3, Date.now, "─", 1],
      [x, y + 1, 6, 4, Date.now, "─", 1],
      [x, y + 1, 6, 5, Date.now, "─", 1],
      [x, y + 1, 6, 6, Date.now, "─", 1],
      [x, y + 1, 6, 7, Date.now, "─", 1],
      [x, y + 1, 6, 8, Date.now, "─", 1],
      [x, y + 1, 6, 9, Date.now, "─", 1],
      [x, y + 1, 6, 10, Date.now, "─", 1],
      [x, y + 1, 6, 11, Date.now, "─", 1],
      [x, y + 1, 6, 12, Date.now, "─", 1],
      [x, y + 1, 6, 13, Date.now, "─", 1],
      [x, y + 1, 6, 14, Date.now, "─", 1],
      [x, y + 1, 6, 15, Date.now, "─", 1],
      [x, y + 1, 6, 15, Date.now, "┘", 1]
    ]}));
  }, 5000);

  //*/

});

ws.connect("wss://www.yourworldoftext.com/ws/");
