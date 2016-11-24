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
      if (message.type === "utf8" && counting === false) {
        //console.log(lib_chalk.black.bgWhite.bold("Received: " + message.utf8Data));
        var json = JSON.parse(message.utf8Data);
        if (json.source === "write" && json.kind === "tileUpdate") {
          for (var key in json.tiles) {
            // Example of REALLY bad code
            var cond = json.tiles[key].content[5] !== "┌" || json.tiles[key].content[6] !== "─" || json.tiles[key].content[7] !== "─" || json.tiles[key].content[8] !== "─" || json.tiles[key].content[9] !== "─" || json.tiles[key].content[10] !== "┐" || json.tiles[key].content[21] !== "│" || json.tiles[key].content[26] !== "│" || json.tiles[key].content[37] !== "└" || json.tiles[key].content[38] !== "─" || json.tiles[key].content[39] !== "─" || json.tiles[key].content[40] !== "─" || json.tiles[key].content[41] !== "─" || json.tiles[key].content[42] !== "┘";
            console.log(json.tiles[key].content[22]);
            switch (counter.toString().length) {
              case 1: cond = cond || (json.tiles[key].content[22] !== "0" || json.tiles[key].content[23] !== "0" || json.tiles[key].content[24] !== "0" || json.tiles[key].content[25] !== counter.toString()[0]); break;
              case 2: cond = cond || (json.tiles[key].content[22] !== "0" || json.tiles[key].content[23] !== "0" || json.tiles[key].content[24] !== counter.toString()[0] || json.tiles[key].content[25] !== counter.toString()[1]); break;
              case 3: cond = cond || (json.tiles[key].content[22] !== "0" || json.tiles[key].content[23] !== counter.toString()[0] || json.tiles[key].content[24] !== counter.toString()[1] || json.tiles[key].content[25] !== counter.toString()[2]); break;
              case 4: cond = cond || (json.tiles[key].content[22] !== counter.toString()[0] || json.tiles[key].content[23] !== counter.toString()[1] || json.tiles[key].content[24] !== counter.toString()[2] || json.tiles[key].content[25] !== counter.toString()[3]); break;
            }
            if (key === (x + "," + y) && cond) {
              counter++;
              counting = true;
              updateCounter();
              setTimeout(function() { counting = false; }, 500);
            }
          }
        }
      }
    });
  }, 5000);


  var x = 1;
  var y = 0;

  var counter = 0;
  var counting = false;

  function updateCounter() {
    switch (counter.toString().length) {
      case 1:
        conx.send(JSON.stringify({kind: "write", edits: [
          [x, y, 1, 6, Date.now, "0", 1],
          [x, y, 1, 7, Date.now, "0", 1],
          [x, y, 1, 8, Date.now, "0", 1],
          [x, y, 1, 9, Date.now, counter.toString()[0], 1],
        ]}));
        break;

      case 2:
        conx.send(JSON.stringify({kind: "write", edits: [
          [x, y, 1, 6, Date.now, "0", 1],
          [x, y, 1, 7, Date.now, "0", 1],
          [x, y, 1, 8, Date.now, counter.toString()[0], 1],
          [x, y, 1, 9, Date.now, counter.toString()[1], 1],
        ]}));
        break;

      case 3:
        conx.send(JSON.stringify({kind: "write", edits: [
          [x, y, 1, 6, Date.now, "0", 1],
          [x, y, 1, 7, Date.now, counter.toString()[0], 1],
          [x, y, 1, 8, Date.now, counter.toString()[1], 1],
          [x, y, 1, 9, Date.now, counter.toString()[2], 1],
        ]}));
        break;

      case 4:
        conx.send(JSON.stringify({kind: "write", edits: [
          [x, y, 1, 6, Date.now, counter.toString()[0], 1],
          [x, y, 1, 7, Date.now, counter.toString()[1], 1],
          [x, y, 1, 8, Date.now, counter.toString()[2], 1],
          [x, y, 1, 9, Date.now, counter.toString()[3], 1],
        ]}));
        break;
    }
  }

  updateCounter();

  var designInterval = setInterval(function() {
    counting = true;
    conx.send(JSON.stringify({kind: "write", edits: [
      [x, y, 0, 5, Date.now, "┌", 1],
      [x, y, 0, 6, Date.now, "─", 1],
      [x, y, 0, 7, Date.now, "─", 1],
      [x, y, 0, 8, Date.now, "─", 1],
      [x, y, 0, 9, Date.now, "─", 1],
      [x, y, 0, 10, Date.now, "┐", 1],

      [x, y, 1, 5, Date.now, "│", 1],
      [x, y, 1, 10, Date.now, "│", 1],

      [x, y, 2, 5, Date.now, "└", 1],
      [x, y, 2, 6, Date.now, "─", 1],
      [x, y, 2, 7, Date.now, "─", 1],
      [x, y, 2, 8, Date.now, "─", 1],
      [x, y, 2, 9, Date.now, "─", 1],
      [x, y, 2, 10, Date.now, "┘", 1]
    ]}));
    setTimeout(function() { counting = false; }, 500);
  }, 2500);

  //*/

});

ws.connect("wss://www.yourworldoftext.com/ws/");
