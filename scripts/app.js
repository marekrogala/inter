/***
 * Experiment
 */






/*** Single bulbs configuration ***/


var keys = {
"1": 1,
"2": 2,
"3": 3,
"4": 4,
"5": 5,
"6": 6,
"7": 7,
"8": 8,
"9": 9,
"0": 10,
}


var state = {}

var currentConfig;
var bulbsConfiguration = function(){
  var p = currentPattern;
  var result = {};
  for(var i = 1; i <= config.number_of_keys; i++){
    result[i] = p % 2;
    p = (p - result[i]) / 2;
  }
  return result;
}

var now = function() {
  return (new Date()).getTime()
}


var logLine = function(line){
  console.log(line);
}

var logEvent = function(evnt){
  evnt.absolute_time = now();
  evnt.current_state = state;
  console.log(JSON.stringify(evnt));
}

var bulbsToString = function(bulbs){
  var s = "";
  for(key in keys){
    if(bulbs[key]){
      s += keys[key] + "  ";
    }
  }
 return s;
}

var currentConfiguration;
var restartConfiguration = function(){
  var conf = bulbsConfiguration();
  logEvent({name: "begin restartConfiguration", timestamp: timestamp, bulbs: conf});

  displayBulbs(conf);
  var timestamp = now();
  state = {
    state: "started",
    started_at: timestamp,
    pressing_substate: "waiting_for_first_key",
    pressed_valid: [],
    pressed_invalid: [],
    seen: {}};
  logEvent({name: "done restartConfiguration", timestamp: timestamp, bulbs: conf});
}

var startInput = function(time) {
  state.pressing_substate = "pressing_valid";
  state.pressing_started_at = time;
  state.valid_input_timer = setTimeout(endValidInput, config.TIME_VALID_INPUT);
  logEvent({name: "start of input", passedTime: time});
}

var endValidInput = function(time) {
  clearTimeout(state.valid_input_timer);
  state.pressing_substate = "pressing_invalid";
  state.pressing_invalid_started_at = time;
  state.invalid_input_timer = setTimeout(endInvalidInput, config.TIME_INVALID_INPUT);
  logEvent({name: "end of valid input", passedTime: time});
}

var endInvalidInput = function(time) {
  clearTimeout(state.invalid_input_timer);
  logEvent({name: "end all input", passedTime: time});
  displayResults();
}

var displayResults = function () {
  logEvent({name: "Displaying results."});

  for(i in state.pressed_valid) turnCorrect(state.pressed_valid[i]);
  for(i in state.pressed_invalid) turnWrong(state.pressed_invalid[i]);

  setTimeout(runOneIterationOfExperiment, config.TIME_DISPLAY_RESULTS);
}

var recordValid = function (key) {
  state.pressed_valid.push(key);
}

var recordInvalid = function (key) {
  state.pressed_invalid.push(key);
}

var recordMaybeValid = function (key, dir) {
  if(dir == "DOWN") {
    if(currentConfig[key]) {
      recordValid(key);
    } else {
      recordInvalid(key);
    }
  }
}

var recordIfInvalid = function (key, dir) {
    if(dir == "DOWN") {
      if(!currentPattern[key]) {
        recordInvalid(key);
      }
    }
}

var seen = function(key, dir) {
  var k = key + "_" + dir
  var result = state.seen[k];
  state.seen[k] = true;
  return result;
}

var processExperimentKey = function(keyString, direction) {
  var time = now()
  if(state.state == "started") {
    var keyCode = keys[keyString];
    if(keyCode !== undefined){
      var delta = time - state.pressing_started_at;
      logEvent({name: "key", direction: direction, code: keyCode,
        keyString: keyString, timeSincePressingStarted: delta});

      if(!seen(keyCode, direction)) { // Filter out keyholds.

        if(state.pressing_substate == "waiting_for_first_key"){
          startInput(time);
          recordMaybeValid(keyCode, direction);
        }
        else if(state.pressing_substate == "pressing_valid"){
          recordMaybeValid(keyCode, direction);
          if(direction == "UP"){
            endValidInput(time);
          }
        }
        else if(state.pressing_substate == "pressing_invalid"){
          recordIfInvalid(keyCode, direction);
        }
      }
    }
  }
}

var onKeydown = function(key){
  var keyString = String.fromCharCode(key);
  processExperimentKey(keyString, "DOWN");
}

var onKeyup = function(key){
  var keyString = String.fromCharCode(key);
  processExperimentKey(keyString, "UP");
}

var setUpExperiment = function () {
    $(document).keydown(function(event){
        onKeydown(event.which)
    })
    $(document).keyup(function(event){
        onKeyup(event.which)
    })
}

setUpExperiment();



/*** whole experiment management ***/

var patterns = []
var patterns_count = Math.pow(2, config.number_of_keys);
for(var j = 1; j < patterns_count; j++) {
  for(var i = 0; i < config.number_of_pattern_repetitions; i++){
    patterns.push(j);
  }
}
shuffle(patterns); // Fixed order because of fixed seed.

var currentPatternId = -1;
var currentPattern;

var timeouts = [1.5, 1.65, 1.8, 1.95]
var randomTimeoutBeforeDisplay = function () {
  var id = Math.floor(Math.random() * timeouts.length);
  return timeouts[id] * 1000;
}

var runOneIterationOfExperiment = function () {
  turnOffAll();
  displayBulbs({});
  currentPatternId++;
  currentPattern = patterns[currentPatternId];
  currentConfig = bulbsConfiguration();
  if (currentPattern) {
    var timeout = randomTimeoutBeforeDisplay();
    logEvent({name: "Initializing one iteration of experiment.", timeout: timeout})
    setTimeout(restartConfiguration, timeout);
  } else {
    console.log("All patterns finished.");
    logEvent({name: "All patterns finished."})
  }
}











/*** general app ****/


var turnOn = function (id) {
    turnOff(id);
    $("#bulb-" + id).addClass("lit");
}

var turnWrong = function (id) {
    //console.log("turning " + id + " wrong")
    turnOff(id);
    $("#bulb-" + id).addClass("wrong");
}

var turnCorrect = function (id) {
    //console.log("turning " + id + " correct")
    turnOff(id);
    $("#bulb-" + id).addClass("correct");
}

var turnOff = function (id) {
    $("#bulb-" + id).removeClass("lit");
    $("#bulb-" + id).removeClass("correct");
    $("#bulb-" + id).removeClass("wrong");
}

var turnOffAll = function () {
    var id = 1;
    while (id <= config.number_of_keys) {
        turnOff(id);
        id++;
    }
}

var displayBulbs = function (bulbs) {
  turnOffAll();
  logEvent({name: "display bulbs", bulbs: bulbs});
  for (key in bulbs) {
    if (bulbs[key]) {
      turnOn(key);
    }
  }
}

$(function() {
  $("#start-btn").click( function() {
      logEvent({name: "Start button clicked."})
      $("#intro").fadeOut(600, function () {
        $("#main-experiment").fadeIn(600, function () {
          logEvent({
            name: "Experiment started.",
            config: config
            })
          runOneIterationOfExperiment();
        });
      });
    }
  );
});
