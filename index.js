const readline = require('readline');

// ---- for time usage calculations ---- //
/*
console.time();
*/ 

// ---- helper function to calculate the shortest distance between swvl station and the user station ---- //
const shortestDist = (coord1, coord2) => {
  let diffX_sq = Math.pow(coord1[0] - coord2[0], 2);
  let diffY_sq = Math.pow(coord1[1] - coord2[1], 2);
  return Math.sqrt(diffX_sq + diffY_sq);
}

// ---- helper function to calculate the nearest swvl station ---- //
const calcNearestStation = (userRouteMap, swvlStationsMap) => {
  let minDist, closestSwvlStation;
  for(let [userStation, userCoord] of userRouteMap.entries()) {
    for(let [swvlStation, swvlCoord] of swvlStationsMap.entries()) {
      let dist = shortestDist(userCoord, swvlCoord);
      if(!minDist || dist < minDist) {
        minDist = dist;
        closestSwvlStation = swvlStation;
      }
    }
    console.log(userStation + ' ' + closestSwvlStation);

    // delete the visited station from the pool of swvl stations
    swvlStationsMap.delete(closestSwvlStation);

    // clear minDist and closestSwvlStation before the next loop
    minDist = undefined;
    closestSwvlStation = undefined;
  }
}

// ---- Creating a readline interface instance which is a wrapper to handle reading and writing from the terminal ---- //
let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let numOfRoutesInSwvl;
let swvlStationsMap = new Map();
let userRouteMap = new Map();
// ---- blocksCount and numOfStationsInRoute are for keeping track of the number of lines entered as input ---- // 
let blocksCount;    
let numOfStaionsInRoute;

// ---- Prompting the user for input, it provides the user for a location to enter input ---- //
rl.prompt();

// ---- Event handler means "on receiving a new line, invoke this callback" ---- //
rl.on('line', function(line){
  // ---- this if statement handles the very first line from input ---- //
  if (numOfRoutesInSwvl === undefined) {
    // ---- the variable N ---- //
    numOfRoutesInSwvl = parseInt(line)   
    // ---- the blocksCount variable keeps track of the number of blocks left, and when blocksCount becomes zero, we close the input stream and stop prompting the user for more input ---- //
    blocksCount = numOfRoutesInSwvl + 1;
  // ---- this else statement handles the rest of the input ---- //  
  } else {
    let input = line.split(" ");   
    // ---- for handling the input line with one integer ---- //
    if(input.length === 1) {
      // ---- the variable K ---- //
      numOfStaionsInRoute = parseInt(line);   
      blocksCount--;
    // ---- for handling the input lines that containes the coordinates ---- //
    } else if (input.length > 1 && blocksCount >= 1) {
      // ---- adding swvl station label and coordinates to the swvlStationsMap ---- //
      swvlStationsMap.set(input[0], [parseInt(input[1]), parseInt(input[2])]);    
      numOfStaionsInRoute--;
    } else if (input.length > 1) {
      // ---- adding user station label and coordinates to the userRouteMap ---- //
      userRouteMap.set(input[0], [parseInt(input[1]), parseInt(input[2])]);    
      numOfStaionsInRoute--;
    }
  }
  if(numOfStaionsInRoute === 0 && blocksCount === 0) {
    rl.close();
  } else {
    rl.prompt();
  }
// ---- Event Handler for after closing the stream ---- //
}).on('close', function(){
  // ---- calc and prints to the terminal each user suggested station to its nearest corresponding swvl station ---- //
  calcNearestStation(userRouteMap, swvlStationsMap);
  
});

// ----- time and memory usage estimates ---- //
/*
console.timeEnd();

const used = process.memoryUsage().heapUsed / 1024 / 1024;
console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
*/



