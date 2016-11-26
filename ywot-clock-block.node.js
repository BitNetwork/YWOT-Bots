var lib_webSocket = require("websocket");
var lib_chalk = require("chalk");

var x = 1;
var y = -1;

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
    ws.connect("wss://www.yourworldoftext.com/ws/");
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
    var year = date.getUTCFullYear();
    var month = date.getUTCMonth() + 1;
    var day = date.getUTCDate();
    var dayOfWeek = date.getUTCDay();

    var hours = date.getUTCHours();
    var minutes = date.getUTCMinutes();
    var seconds = date.getUTCSeconds();
    discardChanges();
    if (typeof editingTiles[x + "," + y] !== "string") {
      knownTiles[x + "," + y] = " ".repeat(128);
      editingTiles[x + "," + y] = " ".repeat(96);
    }

    var yearOne = parseInt(year.toString()[0]);
    var yearTwo = parseInt(year.toString()[1]);
    var yearThree = parseInt(year.toString()[2]);
    var yearFour = parseInt(year.toString()[3]);
    var monthOne = month.toString().length === 2 ? parseInt(month.toString()[0]) : 0;
    var monthTwo = month.toString().length === 2 ? parseInt(month.toString()[1]) : parseInt(month.toString()[0]);
    var dayOne = day.toString().length === 2 ? parseInt(day.toString()[0]) : 0;
    var dayTwo = day.toString().length === 2 ? parseInt(day.toString()[1]) : parseInt(day.toString()[0]);

    var dayWeekName = dayOfWeek === 0 ? "Sun" : dayOfWeek === 1 ? "Mon" : dayOfWeek === 2 ? "Tue" : dayOfWeek === 3 ? "Wed" : dayOfWeek === 4 ? "Thu" : dayOfWeek === 5 ? "Fri" : dayOfWeek === 6 ? "Sat" : "   ";
    var monthName = month === 1 ? "Jan" : month === 2 ? "Feb" : month === 3 ? "Mar" : month === 4 ? "Apr" : month === 5 ? "May" : month === 6 ? "Jun" : month === 7 ? "Jul" : month === 8 ? "Aug" : month === 9 ? "Sep" : month === 10 ? "Oct" : month === 11 ? "Nov" : month === 12 ? "Dec" : "   ";

    var hourOne = hours.toString().length === 2 ? parseInt(hours.toString()[0]) : 0;
    var hourTwo = hours.toString().length === 2 ? parseInt(hours.toString()[1]) : parseInt(hours.toString()[0]);
    var minuteOne = minutes.toString().length === 2 ? parseInt(minutes.toString()[0]) : 0;
    var minuteTwo = minutes.toString().length === 2 ? parseInt(minutes.toString()[1]) : parseInt(minutes.toString()[0]);
    var secondOne = seconds.toString().length === 2 ? parseInt(seconds.toString()[0]) : 0;
    var secondTwo = seconds.toString().length === 2 ? parseInt(seconds.toString()[1]) : parseInt(seconds.toString()[0]);

    editingTiles[x + "," + y] = "┌──────────────┐│  " + dayWeekName + " " + dayOne + dayTwo + " " + monthName + "  ││              ││   " + hourOne + hourTwo + ":" + minuteOne + minuteTwo + ":" + secondOne + secondTwo + "   ││   " + dayOne + dayTwo + "/" + monthOne + monthTwo + "/" + yearThree + yearFour + "   ││              ││ UTC ~BitByte │└──────────────┘";

    if (prepChanges(x + "," + y) !== false) {
      conx.send(prepChanges(x + "," + y));
    }

  }, 500);
  //*/

});

ws.connect("wss://www.yourworldoftext.com/~BitByte/Bot/ws/");
