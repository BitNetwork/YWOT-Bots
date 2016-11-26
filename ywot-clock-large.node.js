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

function drawDigit(digit) {
  var outArray = [];
  switch (digit) {
    case 1:
      outArray[0] = " ", outArray[3] = " ", outArray[6] = " ",
      outArray[1] = " ", outArray[4] = "|", outArray[7] = " ",
      outArray[2] = " ", outArray[5] = "|", outArray[8] = " ";
      break;
    case 2:
      outArray[0] = " ", outArray[3] = "_", outArray[6] = " ",
      outArray[1] = " ", outArray[4] = "_", outArray[7] = "|",
      outArray[2] = "|", outArray[5] = "_", outArray[8] = " ";
      break;
    case 3:
      outArray[0] = " ", outArray[3] = "_", outArray[6] = " ",
      outArray[1] = " ", outArray[4] = "_", outArray[7] = "|",
      outArray[2] = " ", outArray[5] = "_", outArray[8] = "|";
      break;
    case 4:
      outArray[0] = " ", outArray[3] = " ", outArray[6] = " ",
      outArray[1] = "|", outArray[4] = "_", outArray[7] = "|",
      outArray[2] = " ", outArray[5] = " ", outArray[8] = "|";
      break;
    case 5:
      outArray[0] = " ", outArray[3] = "_", outArray[6] = " ",
      outArray[1] = "|", outArray[4] = "_", outArray[7] = " ",
      outArray[2] = " ", outArray[5] = "_", outArray[8] = "|";
      break;
    case 6:
      outArray[0] = " ", outArray[3] = "_", outArray[6] = " ",
      outArray[1] = "|", outArray[4] = "_", outArray[7] = " ",
      outArray[2] = "|", outArray[5] = "_", outArray[8] = "|";
      break;
    case 7:
      outArray[0] = " ", outArray[3] = "_", outArray[6] = " ",
      outArray[1] = " ", outArray[4] = " ", outArray[7] = "|",
      outArray[2] = " ", outArray[5] = " ", outArray[8] = "|";
      break;
    case 8:
      outArray[0] = " ", outArray[3] = "_", outArray[6] = " ",
      outArray[1] = "|", outArray[4] = "_", outArray[7] = "|",
      outArray[2] = "|", outArray[5] = "_", outArray[8] = "|";
      break;
    case 9:
      outArray[0] = " ", outArray[3] = "_", outArray[6] = " ",
      outArray[1] = "|", outArray[4] = "_", outArray[7] = "|",
      outArray[2] = " ", outArray[5] = "_", outArray[8] = "|";
      break;
    case 0:
      outArray[0] = " ", outArray[3] = "_", outArray[6] = " ",
      outArray[1] = "|", outArray[4] = " ", outArray[7] = "|",
      outArray[2] = "|", outArray[5] = "_", outArray[8] = "|";
      break;
    default:
      outArray[0] = " ", outArray[3] = " ", outArray[6] = " ",
      outArray[1] = " ", outArray[4] = " ", outArray[7] = " ",
      outArray[2] = " ", outArray[5] = " ", outArray[8] = " ";
      break;
  }
  return outArray;
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
      editingTiles[x + "," + (y + 1)] = " ".repeat(96);
    }

    var yearOne = parseInt(year.toString()[0]);
    var yearTwo = parseInt(year.toString()[1]);
    var yearThree = parseInt(year.toString()[2]);
    var yearFour = parseInt(year.toString()[3]);
    var monthOne = month.toString().length === 2 ? parseInt(month.toString()[0]) : 0;
    var monthTwo = month.toString().length === 2 ? parseInt(month.toString()[1]) : parseInt(month.toString()[0]);
    var dayOne = day.toString().length === 2 ? parseInt(day.toString()[0]) : 0;
    var dayTwo = day.toString().length === 2 ? parseInt(day.toString()[1]) : parseInt(day.toString()[0]);

    var hourOne = drawDigit(hours.toString().length === 2 ? parseInt(hours.toString()[0]) : 0);
    var hourTwo = drawDigit(hours.toString().length === 2 ? parseInt(hours.toString()[1]) : parseInt(hours.toString()[0]));
    var minuteOne = drawDigit(minutes.toString().length === 2 ? parseInt(minutes.toString()[0]) : 0);
    var minuteTwo = drawDigit(minutes.toString().length === 2 ? parseInt(minutes.toString()[1]) : parseInt(minutes.toString()[0]));
    var secondOne = drawDigit(seconds.toString().length === 2 ? parseInt(seconds.toString()[0]) : 0);
    var secondTwo = drawDigit(seconds.toString().length === 2 ? parseInt(seconds.toString()[1]) : parseInt(seconds.toString()[0]));

    editingTiles[x + "," + y] = "┌───────────────│ " + hourOne[0] + hourOne[3] + hourOne[6] + hourTwo[0] + hourTwo[3] + hourTwo[6] + " " + minuteOne[0] + minuteOne[3] + minuteOne[6] + minuteTwo[0] + minuteTwo[3] + minuteTwo[6] + " │ " + hourOne[1] + hourOne[4] + hourOne[7] + hourTwo[1] + hourTwo[4] + hourTwo[7] + ":" + minuteOne[1] + minuteOne[4] + minuteOne[7] + minuteTwo[1] + minuteTwo[4] + minuteTwo[7] + ":│ " + hourOne[2] + hourOne[5] + hourOne[8] + hourTwo[2] + hourTwo[5] + hourTwo[8] + ":" + minuteOne[2] + minuteOne[5] + minuteOne[8] + minuteTwo[2] + minuteTwo[5] + minuteTwo[8] + ":│     " + dayOne + dayTwo + " / " + monthOne + monthTwo + " / └───────────────" + editingTiles[x + "," + y].substring(96);
    editingTiles[x + "," + (y + 1)] = "───────────────┐" + secondOne[0] + secondOne[3] + secondOne[6] + secondTwo[0] + secondTwo[3] + secondTwo[6] + "         │" + secondOne[1] + secondOne[4] + secondOne[7] + secondTwo[1] + secondTwo[4] + secondTwo[7] + " UTC+0:00│" + secondOne[2] + secondOne[5] + secondOne[8] + secondTwo[2] + secondTwo[5] + secondTwo[8] + " ~BitByte│" + yearOne + yearTwo + yearThree + yearFour + "           │───────────────┘" + editingTiles[x + "," + (y + 1)].substring(96);

    if (prepChanges(x + "," + y) !== false) {
      conx.send(prepChanges(x + "," + y));
    }
    if (prepChanges(x + "," + (y + 1)) !== false) {
      conx.send(prepChanges(x + "," + (y + 1)));
    }

  }, 500);
  //*/

});

ws.connect("wss://www.yourworldoftext.com/ws/");
