var lib_webSocket = require("websocket");
var lib_chalk = require("chalk");

var x = -2;
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
    if (typeof editingTiles[x + "," + (y + 1)] !== "string") {
      knownTiles[x + "," + (y + 1)] = " ".repeat(128);
      editingTiles[x + "," + (y + 1)] = " ".repeat(111);
    }
    if (typeof editingTiles[x + "," + (y + 2)] !== "string") {
      knownTiles[x + "," + (y + 2)] = " ".repeat(128);
      editingTiles[x + "," + (y + 2)] = " ".repeat(111);
    }
    if (typeof editingTiles[x + "," + (y + 3)] !== "string") {
      knownTiles[x + "," + (y + 3)] = " ".repeat(128);
      editingTiles[x + "," + (y + 3)] = " ".repeat(111);
    }
    if (typeof editingTiles[x + "," + (y + 4)] !== "string") {
      knownTiles[x + "," + (y + 4)] = " ".repeat(128);
      editingTiles[x + "," + (y + 4)] = " ".repeat(111);
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

    var hourString = "-".repeat(24);
    hourString = hourString.substring(0, hours) + "+" + hourString.substring(hours + 1);
    var minuteString = "-".repeat(60);
    minuteString = minuteString.substring(0, minutes) + "+" + minuteString.substring(minutes + 1);
    var secondString = "-".repeat(60);
    secondString = secondString.substring(0, seconds) + "+" + secondString.substring(seconds + 1);

    editingTiles[x + "," + y] = editingTiles[x + "," + y].substring(0, 91) + "Hour " + editingTiles[x + "," + y].substring(96, 105) + "Minute " + editingTiles[x + "," + y].substring(112, 121) + "Second ";
    editingTiles[x + "," + (y + 1)] = editingTiles[x + "," + (y + 1)].substring(0, 80) + hourString.substring(0, 16) + minuteString.substring(0, 16) + secondString.substring(0, 16);
    editingTiles[x + "," + (y + 2)] = editingTiles[x + "," + (y + 2)].substring(0, 80) + hourString.substring(16, 24) + "       2" + minuteString.substring(16, 32) + secondString.substring(16, 32);
    editingTiles[x + "," + (y + 3)] = editingTiles[x + "," + (y + 3)].substring(0, 80) + "4-Hour  UTC+0:00" + minuteString.substring(32, 48) + secondString.substring(32, 48);
    editingTiles[x + "," + (y + 4)] = editingTiles[x + "," + (y + 4)].substring(0, 80) + "  ~BitByte  " + editingTiles[x + "," + (y + 4)].substring(92, 96) + minuteString.substring(48, 60) + editingTiles[x + "," + (y + 4)].substring(108, 112) + secondString.substring(48, 60) + editingTiles[x + "," + (y + 4)].substring(124);

    if (prepChanges(x + "," + y) !== false) {
      conx.send(prepChanges(x + "," + y));
    }
    if (prepChanges(x + "," + (y + 1)) !== false) {
      conx.send(prepChanges(x + "," + (y + 1)));
    }
    if (prepChanges(x + "," + (y + 2)) !== false) {
      conx.send(prepChanges(x + "," + (y + 2)));
    }
    if (prepChanges(x + "," + (y + 3)) !== false) {
      conx.send(prepChanges(x + "," + (y + 3)));
    }
    if (prepChanges(x + "," + (y + 4)) !== false) {
      conx.send(prepChanges(x + "," + (y + 4)));
    }

  }, 500);
  //*/

});

ws.connect("wss://www.yourworldoftext.com/ws/");
