var lib_webSocket = require("websocket");
var lib_chalk = require("chalk");
var lib_readline = require("readline");

var input = lib_readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function prompt(callback, pro) {
  input.question((typeof pro === "string" ? pro : ">"), function(str) {
    callback(str);
    return prompt(callback, pro);
  });
}

prompt(function(str) { try { console.log(eval(str)); } catch (error) { console.log(error.message); } } );

var x = 2;
var y = 1;

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
        console.log(knownTiles);
      }
    }
  });

  discardChanges();
  knownTiles[x + "," + y] = " ".repeat(128);
  editingTiles[x + "," + y] = "x" + " ".repeat(127);
  if (prepChanges(x + "," + y) !== false) {
    conx.send(prepChanges(x + "," + y));
  }
  console.log(prepChanges(x + "," + y));
  //*/

});

ws.connect("wss://www.yourworldoftext.com/~BitByte/Bot/ws/");
