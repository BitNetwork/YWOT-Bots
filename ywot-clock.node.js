var lib_webSocket = require("websocket");
var lib_chalk = require("chalk");

var x = 58;
var y = -2;

var knownTiles = {};
var editingTiles = {};

function prepChanges(block) {
  if (knownTiles[block] === editingTiles[block]) {
    return false;
  }
  var outJSON = "{\"kind\": \"write\", \"edits\": [";

  if (typeof knownTiles[block] !== "string" && typeof editingTiles[block] === "string") {
    for (var i=0; i<editingTiles[block].length; i++) {
      outJSON += "[" + block + ", " + Math.floor(i / 16) + ", " + (i - Math.floor(i / 16) * 16) + ", " + Date.now() + ", \"" + editingTiles[block][i] + "\", 1],";
    }
  } else {
    for (var i=0; i<knownTiles[block].length; i++) {
      if (knownTiles[block][i] !== editingTiles[block][i]) {
        outJSON += "[" + block + ", " + Math.floor(i / 16) + ", " + (i - Math.floor(i / 16) * 16) + ", " + Date.now() + ", \"" + editingTiles[block][i] + "\", 1],";
      }
    }
  }
  outJSON = outJSON.substring(0, outJSON.length - 1);
  outJSON += "]}";
  if (outJSON.length !== 27) {
    return outJSON;
  }
  return false;
}

function discardChanges(block) {
  if (typeof block !== "string") {
    editingTiles = {};
    for (var key in knownTiles) {
      editingTiles[key] = knownTiles[key];
    }
    return true;
  }
  editingTiles[block] = knownTiles[block];
  return true;
}


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


  conx.on("message", function(message) {
    if (message.type === "utf8") {
      console.log(lib_chalk.black.bgWhite.bold("Received: " + message.utf8Data));
      var json = JSON.parse(message.utf8Data);
      if (json.source === "write" && json.kind === "tileUpdate") {
        for (var key in json.tiles) {
          knownTiles[key] = json.tiles[key].content;
        }
      }
    }
  });

  setInterval(function() {
    var date = new Date();
    var hours = date.getUTCHours();
    var minutes = date.getUTCMinutes();
    var seconds = date.getUTCSeconds();
    discardChanges();
    if (typeof editingTiles[x + "," + y] !== "string") {
      editingTiles[x + "," + y] = " ".repeat(128);
    }
    editingTiles[x + "," + y] = editingTiles[x + "," + y].substring(0, 3) + "┌────────┐" + editingTiles[x + "," + y].substring(13,19) + "│" + (hours.toString().length === 2 ? hours.toString()[0] : "0") + (hours.toString().length === 2 ? hours.toString()[1] : hours.toString()[0]) + ":" + (minutes.toString().length === 2 ? minutes.toString()[0] : "0") + (minutes.toString().length === 2 ? minutes.toString()[1] : minutes.toString()[0]) + ":" + (seconds.toString().length === 2 ? seconds.toString()[0] : "0") + (seconds.toString().length === 2 ? seconds.toString()[1] : seconds.toString()[0]) + "│" + editingTiles[x + "," + y].substring(29,35) + "│~BitByte│" + editingTiles[x + "," + y].substring(45,51) + "└────────┘" + editingTiles[x + "," + y].substring(61);

    if (prepChanges(x + "," + y) !== false) {
      conx.send(prepChanges(x + "," + y));
    }

  }, 500);
  //*/

});

ws.connect("wss://www.yourworldoftext.com/~InfraRaven/LawBook/ws/");
