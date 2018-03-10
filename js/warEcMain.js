//WAR ECON
//A game made in 2018 by Kyle Connor
//@efithor
//Special thanks to KJP
//Made with Paper.js


//Globals
var isMainMenuOpen = false;
var mainMenuNewGameButton;
var mainMenuLoadButton;
var mainMenuSettingsButton;
var mainMenuBackground;
var mainMenuTitle;
var mousePos;
var buttonArray = [];
//var regionArray = [];

//Run when the window loads
window.onload = function(){

//Initialize paper
var canvas = document.getElementById('myCanvas');
paper.setup(canvas);
paperTool = new paper.Tool();

//Keep track of mouse position.
paperTool.onMouseMove = function(event){
  mousePos = event.point;
}

//On mouse down, have each button check if it was clicked.
paperTool.onMouseDown = function(event){
  for(var i=0;i<buttonArray.length;i++){
    buttonArray[i].checkClick(event.point);
  }
}
//draw main menu
drawMainMenu();


//Start main loop
paper.view.onFrame = function(event){
  //Every Frame, check if each button is being hovered over.
  for(var i=0;i<buttonArray.length;i++){
    buttonArray[i].checkHovers();
  }


  //Game
  if(false){
    //Monitor UI actions
    //Recruit
    if(recruitRegimentButton){
      recruitRegiment();
    }
    //Disband
    if(disbandRegimentButton){
      disbandRegiment();
    }
    //Adjust
    if(adjustRegimentButton){
      adjustRegiment();
    }
    //Train
    if(trainRegimentButton){
      trainRegiment();
    }
    //Deploy
    if(deployRegimentButton){
      deployRegiment();
    }
    //Savegame
    if(saveGameButton){
      saveGame();
    }
    //Settings
    if(settingsButton){
      openSettings();
    }
    //Load Game
    if(loadGameMenuButton){
      loadGameMenu();
    }
    //Main Menu
    if(mainMenuButton){
      openMainMenu();
    }
    //End Turn
    if(endTurnButton){
      //Have other PMCs take their actions
      pmcTurns();
      //Battle-related checks
      battleChecks();
      //Influence-related checks
      influenceChecks();
      //Weath related adjustments
      weathChecks();
      //Have influences create or recind contracts.
      interestTurns();
      //Misc adjustments
      incrementTurnCount();
      //Savegame
      saveGame();
    }
  }

  //End Main loop
  paper.view.update();
}

}

//Hoiseted functions
//Initializer Functions
//Creates a series of hexagonal reigon objects for the game to take place on.
//A reigon is a paper object with other attributes ascribed to it.
function createRegions(){
  var regionArray = setupLand();
  setupRegionBiomes(regionArray, 0.25,0.25,0.25);
}
//Given a certain radius, quantity, and origin, create a hexagonal grid.
function createHexagonalGrid(radius,xCount,yCount,xOrig,yOrig){
  var regArray = [];
  for(var x=0;x<xCount;x++){
    regArray[x] = [];
    for(var y=0;y<yCount;y++){
      var newRegion = new paper.Path.RegularPolygon(new paper.Point(xOrig + x * Math.sqrt(3)/2*radius*2,yOrig + y * radius*1.5),6,radius);
      if(y%2){
        newRegion.position.x = newRegion.position.x + (Math.sqrt(3)/2*radius*2)/2;
      }
      newRegion.strokeColor = 'black';
      newRegion.strokeWidth = 5;
      newRegion.xCord = x;
      newRegion.yCord = y;
      newRegion.isLand = undefined;
      regArray[x][y] = newRegion;
    }
  }
  return regArray;
}
//Given a region array, create landmasses
function setupLand(){
  rArray = [];
  rArray = createHexagonalGrid(20,25,20,50,50);
  //Set the left and right borders to be water.
  for(var y=0;y<rArray[0].length;y++){
    rArray[0][y].fillColor = '#0a48ad';
    rArray[0][y].isLand = false;
    rArray[rArray.length-1][y].fillColor = '#0a48ad';
    rArray[rArray.length-1][y].isLand = false
  }
  // top and bottom: the middle 60% is land.
  for(var x=0;x<rArray.length;x++){
    if(x<=Math.floor(rArray.length*0.2)-1 || (x>Math.floor(rArray.length*0.8)-1)){
      rArray[x][0].fillColor = '#0a48ad';
      rArray[x][0].isLand = false;
      rArray[x][rArray[0].length-1].fillColor = '#0a48ad';
      rArray[x][rArray[0].length-1].isLand = false;
    }else{
      rArray[x][0].fillColor = 'white';
      rArray[x][0].isLand = true;
      rArray[x][rArray[0].length-1].fillColor = 'white';
      rArray[x][rArray[0].length-1].isLand = true;
    }
  }

  //Drop in "continent seeds" and "ocean seeds"
  //Choose 4 random numbers ranging from 0-8. These will be our ocean seeds.
  var oceanSeeds = chooseXofY(4,[0,1,2,3,4,5,6,7,8]);
  var seedCount = 0;
  for(var x=0; x<3; x++){
    for(var y=0; y<3;y++){
      var seedX = x+1;
      var seedY = y+1;
      var landColor;
      var izzitLand;
      if(doesXArrayContainYElement(oceanSeeds,seedCount)){
        landColor = '#0a48ad';
        izzitLand = false;
      }else{
        landColor = 'white';
        izzitLand = true;
      }
      rArray[Math.floor(rArray.length/4)*seedX][Math.floor(rArray[0].length/4)*seedY].fillColor = landColor;
      rArray[Math.floor(rArray.length/4)*seedX][Math.floor(rArray[0].length/4)*seedY].isLand = izzitLand;
      var adjArray = getAdjacentHexes(rArray,rArray[Math.floor(rArray.length/4)*seedX][Math.floor(rArray[0].length/4)*seedY]);
      for(var i=0;i<adjArray.length;i++){
        if(adjArray != undefined){
            adjArray[i].fillColor = landColor;
            adjArray[i].isLand = izzitLand;
        }
      }
      seedCount++;
    }
  }

  //If an adjacent region has a land type, increase the chance that said type will also have that type.
  for(var x=0;x<rArray.length;x++){
    for(var y=0;y<rArray[x].length;y++){
      if(rArray[x][y].isLand === undefined){
        var adjArray = getAdjacentHexes(rArray,rArray[x][y]);
        var landCount = 0;
        for(var i=0; i<adjArray.length;i++){
          if(adjArray[i] != undefined && adjArray[i].isLand != undefined){
            if(adjArray[i].isLand){
              landCount++;
            }else{
              landCount--;
            }
          }
        }
        //Now that we know how many adjacent tiles are/n't lands, randomly make this tile land or water.
        if(Math.random() > 0.6 - landCount/13){
          rArray[x][y].isLand = true;
          rArray[x][y].fillColor = 'white';
        }else{
          rArray[x][y].isLand = false;
          rArray[x][y].fillColor = '#0a48ad';
        }
      }
    }
  }

  //Ensure the landmasses we just generated are valid.
  if(!checkLandmass(rArray,.35)){
    console.log('Not enough land, rejecting...');
    rArray = [];
    setupLand(rArray);
  }

  return rArray;
}
//Given a region array, verify if there's enough land.
function checkLandmass(rArray,minPercentNeeded){
  var totalTiles = getTotalTiles(rArray);
  var landTiles = getTotalLandTiles(rArray);
  if(landTiles/totalTiles >= minPercentNeeded){
    return true;
  }else{
    return false;
  }
}

//Given a region array, assign biomes.
function setupRegionBiomes(regionArray, mountainPercent, forestPercent, desertPercent){
  //Add plains, hills, cities, towns, mountains, tundra, deserts.
  //Create geographic features
  placeBiomeType(regionArray,'mountain',mountainPercent); //Mountains
  placeBiomeType(regionArray,'forest',forestPercent); //Forests
  placeBiomeType(regionArray,'desert',desertPercent); //Deserts
  //Remaining tiles are plains
  for(var x=0;x<regionArray.length;x++){
    for(var y=0;y<regionArray[x].length;y++){
      if(regionArray[x][y].isLand && regionArray[x][y].biome === undefined){
        regionArray[x][y].biome = 'plain';
      }
    }
  }
  //Color the zones based on temp.
  createTempZones(regionArray);

  //Place a number of towns relative to the size of the map.
  //Biased towards coasts, temperate, and tropical areas.
  createTowns(regionArray,0.15);
  //Upgrade a percentage of the towns to cities
  //Biased towards cities that have more towns nearby.
  upgradeTownsToCities(regionArray,0.15);

}

function createTowns(regionArray,townPercent){
  var potentialTownArray = [];
  //Create array with all valid regions, giving a weight to each region.
  for(var x=0;x<regionArray.length;x++){
    for(var y=0;y<regionArray[x].length;y++){
      if(regionArray[x][y].isLand){
        var weight = 10;
        if(isTemperate(regionArray[x][y]) || isTropical(regionArray[x][y])){
          weight = weight + 10;
        }
        if(isCoastal(regionArray, regionArray[x][y])){
          weight = weight + 10;
        }
        potentialTownArray.push([regionArray[x][y],weight]);
      }
    }
  }
  var townCount = 0;
  var totalLand = getTotalLandTiles(regionArray);
  while(townCount/totalLand < townPercent){
    //Choose a region at random, that region gets a town.
    var chosenElement = selectElementRandomlyFromWeightedArray(potentialTownArray);
    giveRegionTown(chosenElement[0]);
    townCount++;
    //Remove the region from the weighted array.
    potentialTownArray.slice(getXArrayAddressOfYElement(potentialTownArray,chosenElement));
  }
}

function giveRegionTown(region){
  region.townIcon = new paper.PointText();
  region.townIcon.position.x = region.position.x-9;
  region.townIcon.position.y = region.position.y+12;
  region.townIcon.fontSize = 28;
  region.townIcon.content = 'T';
}

function isTemperate(region){
  if(region.tempZone === 'temperate'){
    return true;
  }
  return false;
}

function isTropical(region){
  if(region.tempZone === 'tropical'){
    return true;
  }
  return false;
}

function isArtic(region){
  if(region.tempZone === 'artic'){
    return true;
  }
  return false;
}

function isCoastal(rArray, region){
  var adjArray = getAdjacentHexes(rArray, region);
  for(var i=0; i<adjArray.length;i++){
    if(adjArray[i] != undefined){
      if(!adjArray[i].isLand){
        return true;
      }
    }
  }
  return false;
}

function upgradeTownsToCities(regionArray,percentage){
  //Create an array with all towns, giving weight to each town.
  //Choose a town at random to upgrade to a city.
  //Remove the region from the weighted array.
  //Recalculate weights, nearby cities lower the weight.
  //Repeat until sufficent
}

//Choose a random land square and put a biomeType on it.
//Either grab a random adjacent squre (80% chance?) and put a biomeType
//there, or choose a new nonbiomeType square.
//Do this until a certain percentage of biomeType have been created.
//Will not override biomes already created.
function placeBiomeType(rArray, biomeType, maxPercent){
  //Create an array of valid land.
  var validLandArray = [];
  var biomeCount = 0;
  var totalTiles = getTotalLandTiles(rArray);

  for(var x=0;x<rArray.length;x++){
    for(var y=0;y<rArray[x].length;y++){
      if(rArray[x][y].isLand && rArray[x][y].biome === undefined){
        validLandArray.push(rArray[x][y]);
      }
    }
  }
  //Place biomes. Biased towards placing them near like biomes.
  var lastPlaced = undefined;
  while(biomeCount/totalTiles < maxPercent){
    //If lastPlaced != undefined, have there be an 80% chance of placing another
    //biomeType next to it.
    if(lastPlaced!=undefined && Math.random()<=0.8){
      var adjArray = getAdjacentHexes(rArray,lastPlaced);
      //Determine which tiles in the adjArray are valid
      var validAdjArray = [];
      for(var i=0;i<adjArray.length;i++){
        if(doesXArrayContainYElement(validLandArray,adjArray[i])){
          validAdjArray.push(adjArray[i]);
        }
      }
      //Now that the adjArray has been created, let's work with it.
      //Special case where there arn't any valid tiles.
      if(validAdjArray.length === 0){
        //Choose a random plot of valid land. Put a biome on it.
        var validID = Math.floor(Math.random()*validLandArray.length);
        validLandArray[validID].biome = biomeType;
        lastPlaced=validLandArray[validID];
        validLandArray.slice(validID); //remove this element from the valid land array.
      }else{
        //Otherwise, choose one from the validAdjArray.
        var validAdjID = Math.floor(Math.random()*validAdjArray.length)
        validAdjArray[validAdjID].biome = biomeType;
        lastPlaced = validAdjArray[validAdjID];
        validLandArray.slice(getXArrayAddressOfYElement(validLandArray,validAdjArray[validAdjID])); //remove this tile from the valid land array.
      }
    }else{
      //Choose a random plot of valid land. Put a mountain on it.
      var validID = Math.floor(Math.random()*validLandArray.length);
      validLandArray[validID].biome = biomeType;
      lastPlaced=validLandArray[validID];
      validLandArray.slice(validID); //remove this place from the valid land array.
    }
    biomeCount++;
  }

}

//given a biome, color it.
function colorBiome(biomeTile){
  if(biomeTile.biome === 'mountain'){
    biomeTile.fillColor = '#5b6466';
  }
  if(biomeTile.biome === 'snow-capped mountain'){
    biomeTile.fillColor = '#848f91';
  }
  if(biomeTile.biome === 'snowyMoutain'){
    biomeTile.fillColor = '#abb9bc';
  }
  if(biomeTile.biome === 'forest'){
    biomeTile.fillColor = '#1f632c';
  }
  if(biomeTile.biome === 'boreal forest'){
    biomeTile.fillColor = '#38593e';
  }
  if(biomeTile.biome === 'jungle'){
    biomeTile.fillColor = '#026315';
  }
  if(biomeTile.biome === 'swamp'){
    biomeTile.fillColor = '#4f5b02';
  }
  if(biomeTile.biome === 'desert'){
    biomeTile.fillColor = '#899e06';
  }
  if(biomeTile.biome === 'tundra'){
    biomeTile.fillColor = '#600505';
  }
  if(biomeTile.biome === 'grassland'){
    biomeTile.fillColor = '#427a06';
  }
}

//given a region array, convert tiles by temp.
function createTempZones(rArray){
  //Divide the land into temp zones
  zWidth = Math.floor(rArray[0].length/6);
  //1/6 and 6/6: Artic
  nHemArticMaxY = zWidth-1;
  sHemArticMinY = (zWidth*5)+1;
  //Plains -> Tundra
  //Desert -> Tundra
  //Forest -> Boreal Forest
  //Mountain ->  Snowy Mount

  //2/6 and 5/6: Temperate
  nHemTempMaxY = (zWidth*2);
  sHemTempMinY = (zWidth*4);
  //Plains -> Grassland
  //Desert -> Desert
  //Forest -> Forest
  //Mountain ->  Snow-Capped Mount

  //Middle third: Tropical
  tropMaxY = zWidth*4;
  //Plains -> Swamp
  //Desert -> Desert
  //Forest -> Jungle
  //Mountain -> Mount
  for(var x=0;x<rArray.length;x++){
    for(var y=0;y<rArray[x].length;y++){
      //artic cases
      if(y<=nHemArticMaxY || y>=sHemArticMinY){
        if(rArray[x][y].biome === 'plain'){
          rArray[x][y].biome = 'tundra';
          rArray[x][y].tempZone = 'artic';
          colorBiome(rArray[x][y]);
        }
        if(rArray[x][y].biome === 'desert'){
          rArray[x][y].biome = 'tundra';
          rArray[x][y].tempZone = 'artic';
          colorBiome(rArray[x][y]);
        }
        if(rArray[x][y].biome === 'forest'){
          rArray[x][y].biome = 'boreal forest';
          rArray[x][y].tempZone = 'artic';
          colorBiome(rArray[x][y]);
        }
        if(rArray[x][y].biome === 'mountain'){
          rArray[x][y].biome = 'snowyMoutain';
          rArray[x][y].tempZone = 'artic';
          colorBiome(rArray[x][y]);
        }
      }
      //temperate cases
      if(y<=nHemTempMaxY && y>nHemArticMaxY || y>=sHemTempMinY && y<sHemArticMinY){
        if(rArray[x][y].biome === 'plain'){
          rArray[x][y].biome = 'grassland';
          rArray[x][y].tempZone = 'temperate';
          colorBiome(rArray[x][y]);
        }
        if(rArray[x][y].biome === 'desert'){
          rArray[x][y].biome = 'desert';
          rArray[x][y].tempZone = 'temperate';
          colorBiome(rArray[x][y]);
        }
        if(rArray[x][y].biome === 'forest'){
          rArray[x][y].biome = 'forest';
          rArray[x][y].tempZone = 'temperate';
          colorBiome(rArray[x][y]);
        }
        if(rArray[x][y].biome === 'mountain'){
          rArray[x][y].biome = 'snow-capped mountain';
          rArray[x][y].tempZone = 'temperate';
          colorBiome(rArray[x][y]);
        }
      }
      //tropical cases
      if(y<=tropMaxY && y>nHemArticMaxY && y>nHemTempMaxY){
        if(rArray[x][y].biome === 'plain'){
          rArray[x][y].biome = 'swamp';
          rArray[x][y].tempZone = 'tropical';
          colorBiome(rArray[x][y]);
        }
        if(rArray[x][y].biome === 'desert'){
          rArray[x][y].biome = 'desert';
          rArray[x][y].tempZone = 'tropical';
          colorBiome(rArray[x][y]);
        }
        if(rArray[x][y].biome === 'forest'){
          rArray[x][y].biome = 'jungle';
          rArray[x][y].tempZone = 'tropical';
          colorBiome(rArray[x][y]);
        }
        if(rArray[x][y].biome === 'mountain'){
          rArray[x][y].biome = 'mountain';
          rArray[x][y].tempZone = 'tropical';
          colorBiome(rArray[x][y]);
        }
      }
    }
  }
}

//Creates a number of interest objects to compete over regions.
function createInterests(){
  //Create Nations
  //Nations seek to expand influence in a contiguous fashion.

  //Create Nationalists
  //Nationalits seek to secure influence in a specific set of regions.

  //Create Corporations
  //Corporations seek to secure influence owned by other Corporations.

  //Terrorists
  //Terrorists seek to secure influence over a specific nation.

}
//Creates a set of PMC objects to work for the interests.
function createPMCs(){

}
function drawMainMenu(){
  //Create Background
  mainMenuBackground = new paper.Path.Rectangle(new paper.Point(0,0),new paper.Point(1024,768));
  mainMenuBackground.fillColor = '#8b9b8e';

  //Create title
  mainMenuTitle = new paper.PointText(new paper.Point(paper.view.center.x-55,paper.view.center.y-200));
  mainMenuTitle.content = 'WarEc';
  mainMenuTitle.fontSize = 30;

  //Create "New Game" button
  var mainMenuNewGameButtonPanel = new paper.Path.Rectangle(new paper.Point(0,0),new paper.Point(120,80));
  mainMenuNewGameButtonPanel.fillColor = '#9b5d5d';
  mainMenuNewGameButtonPanel.strokeColor = 'black';
  mainMenuNewGameButtonPanel.strokeWidth = 7;
  var mainMenuNewGameButtonText = new paper.PointText(new paper.Point((mainMenuNewGameButtonPanel.position.x-45), mainMenuNewGameButtonPanel.position.y+5));
  mainMenuNewGameButtonText.content = 'New Game';
  mainMenuNewGameButtonText.fontSize = 18;
  mainMenuNewGameButton = new paper.Group([mainMenuNewGameButtonPanel,mainMenuNewGameButtonText]);
  mainMenuNewGameButton.position = new paper.Point(paper.view.center);
  mainMenuNewGameButton.highlightable = true;
  mainMenuNewGameButton.isHighlighted = false;
  mainMenuNewGameButton.checkHovers = function(){
    if(!this.isHighlighted && this.contains(mousePos)){
      this.children[0].strokeColor = 'red';
      this.isHighlighted = true;
    }
    if(this.isHighlighted && !this.contains(mousePos)){
      this.children[0].strokeColor = 'black';
      this.isHighlighted = false;
    }
  }
  mainMenuNewGameButton.checkClick = function(eventPos){
    if(this.contains(eventPos)){
      closeMainMenu();
      newGame();
    }
  }
  buttonArray.push(mainMenuNewGameButton);

  //Create "Load Game" button
  var mainMenuLoadGameButtonPanel = new paper.Path.Rectangle(new paper.Point(0,0),new paper.Point(120,80));
  mainMenuLoadGameButtonPanel.fillColor = '#9b5d5d';
  mainMenuLoadGameButtonPanel.strokeColor = 'black';
  mainMenuLoadGameButtonPanel.strokeWidth = 7;
  var mainMenuLoadGameButtonText = new paper.PointText(new paper.Point((mainMenuLoadGameButtonPanel.position.x-45), mainMenuLoadGameButtonPanel.position.y+5));
  mainMenuLoadGameButtonText.content = 'Load Game';
  mainMenuLoadGameButtonText.fontSize = 18;
  mainMenuLoadButton = new paper.Group([mainMenuLoadGameButtonPanel,mainMenuLoadGameButtonText]);
  mainMenuLoadButton.position = new paper.Point(paper.view.center.x,paper.view.center.y+100);
  mainMenuLoadButton.highlightable = true;
  mainMenuLoadButton.isHighlighted = false;
  mainMenuLoadButton.checkHovers = function(){
    if(!this.isHighlighted && this.contains(mousePos)){
      this.children[0].strokeColor = 'red';
      this.isHighlighted = true;
    }
    if(this.isHighlighted && !this.contains(mousePos)){
      this.children[0].strokeColor = 'black';
      this.isHighlighted = false;
    }
  }
  mainMenuLoadButton.checkClick = function(eventPos){
    if(this.contains(eventPos)){
      console.log('Load Game!');
    }
  }
  buttonArray.push(mainMenuLoadButton);

  //Create "Settings" button
  var mainMenuSettingsButtonPanel = new paper.Path.Rectangle(new paper.Point(0,0),new paper.Point(120,80));
  mainMenuSettingsButtonPanel.fillColor = '#9b5d5d';
  mainMenuSettingsButtonPanel.strokeColor = 'black';
  mainMenuSettingsButtonPanel.strokeWidth = 7;
  var mainMenuSettingsButtonText = new paper.PointText(new paper.Point((mainMenuSettingsButtonPanel.position.x-45), mainMenuSettingsButtonPanel.position.y+5));
  mainMenuSettingsButtonText.content = 'Settings';
  mainMenuSettingsButtonText.fontSize = 18;
  mainMenuSettingsButton = new paper.Group([mainMenuSettingsButtonPanel,mainMenuSettingsButtonText]);
  mainMenuSettingsButton.position = new paper.Point(paper.view.center.x,paper.view.center.y+200);
  mainMenuSettingsButton.highlightable = true;
  mainMenuSettingsButton.isHighlighted = false;
  mainMenuSettingsButton.checkHovers = function(){
    if(!this.isHighlighted && this.contains(mousePos)){
      this.children[0].strokeColor = 'red';
      this.isHighlighted = true;
    }
    if(this.isHighlighted && !this.contains(mousePos)){
      this.children[0].strokeColor = 'black';
      this.isHighlighted = false;
    }
  }
  mainMenuSettingsButton.checkClick = function(eventPos){
    if(this.contains(eventPos)){
      console.log('Settings');
    }
  }
  buttonArray.push(mainMenuSettingsButton);

  isMainMenuOpen = true;
}

//Menu Functions
//Starts a new game. Could take parameters in later versions.
function newGame(){
  createRegions();
  createInterests();
  createPMCs();
}
//Shows a menu with three load slots.
function loadGameMenu(){

}
//Opens the options screen. Has sound and music sliders.
function openSettings(){

}
//Opens the main menu.
function openMainMenu(){

}
//Offloads the main menu.
function closeMainMenu(){
  //Check if the main menu is open
  if(!isMainMenuOpen){
    return console.log('Error: Unable to fire closeMainMenu(): Menu is already closed.');
  }
  //Delete Background
  mainMenuBackground.remove();
  //Delete Title
  mainMenuTitle.remove();
  //Delete Buttons
  for(var i=0;i<buttonArray.length;i++){
    buttonArray[i].remove();
  }
  //Clear Button Array
  buttonArray = [];

  isMainMenuOpen = false;
}

//Regiment Functions
//creates a vanilla regiment object.
function recruitRegiment(){

}
//Deletes a regiment object.
function disbandRegiment(){

}
//Adjusts the number of people in a regiment.
function adjustRegiment(){

}
//changes what kind of training a given regiment is undergoing.
function trainRegiment(){

}
//sends a regiment out on a contract.
function deployRegiment(){

}

//End Turn Functions
//Has the AI PMCs recruit, disband, adjust, train, deploy, and accept.
function pmcTurns(){

}
//Determine what happens for each regiment engaged in combat.
function battleChecks(){

}
//Calculates the new value of each region's influence.
function influenceChecks(){

}
//Calculates the new value of each regions wealth.
function weathChecks(){

}
//Has each interest create and recind contracts.
function interestTurns(){

}
//Calculate each PMC's expenditures and income
function tabulatePMCIncome(){

}
//Calculate each PMC's stock price.
function tabulatePMCStockPrice(){

}
//Increase the turn count by one.
function incrementTurnCount(){

}

//Utility Functions
function isRealObject(object){
  if(object !== 'null' && object !== 'undefined'){
    return true;
  }
  return false;
}
//Given a region array and region object, return an array containing all adjacent hexes, starting with the 1oClock one and working clockwise. Gaps are listed as undefinded.
function getAdjacentHexes(rArray, rObj){
  var adjArray = [];
  //Slot 1
  //Get x+1
  if(rArray[rObj.xCord+1]===undefined){
    adjArray[1] = undefined;
  }else{
    adjArray[1] = rArray[rObj.xCord+1][rObj.yCord];
  }
  //Slot 4
  //Get x-1
  if(rArray[rObj.xCord-1]===undefined){
    adjArray[4] = undefined;
  }else{
    adjArray[4] = rArray[rObj.xCord-1][rObj.yCord];
  }
  if(rObj.yCord%2){ //If y odd
    if(rArray[rObj.xCord+1]===undefined){
      adjArray[0] = undefined;
      adjArray[2] = undefined;
    }else{
      //Get y-1, x+1 //Slot 0
      adjArray[0] = rArray[rObj.xCord+1][rObj.yCord-1];
      //Get y+1. x+1 //Slot 2
      adjArray[2] = rArray[rObj.xCord+1][rObj.yCord+1];
    }
    //Get y+1 //Slot 3
    adjArray[3] = rArray[rObj.xCord][rObj.yCord+1];
    //Get y-1 //Slot 5
    adjArray[5] = rArray[rObj.xCord][rObj.yCord-1];
  }else{
    //Get y-1 //Slot 0
    adjArray[0] = rArray[rObj.xCord][rObj.yCord-1];
    //Get y+1 //Slot 2
    adjArray[2] = rArray[rObj.xCord][rObj.yCord+1];
    if(rArray[rObj.xCord-1]===undefined){
      adjArray[3] = undefined;
    }else{
      //Get y+1. x+1 //Slot 3
      adjArray[3] = rArray[rObj.xCord-1][rObj.yCord+1];
    }
    if(rArray[rObj.xCord-1]===undefined){
      adjArray[5] = undefined;
    }else{
      //Get y-1, x-1 //Slot 5
      adjArray[5] = rArray[rObj.xCord-1][rObj.yCord-1];
    }
  }

  return adjArray;
}

function chooseXofY(x,y){
  var chosenArray = [];
  while(chosenArray.length < x){
    var chosenElement = y[Math.floor(Math.random()*y.length)];
    if(!doesXArrayContainYElement(chosenArray,chosenElement)){
      chosenArray.push(chosenElement);
    }
  }
  return chosenArray;
}

function doesXArrayContainYElement(x,y){
  for(var i=0;i<x.length;i++){
    if(x[i]===y){
      return true;
    }
  }
  return false;
}

function getXArrayAddressOfYElement(x,y){
  for(var i=0;i<x.length;i++){
    if(x[i]===y){
      return i;
    }
  }
  return false;
}

//Given a region array, calculat the total tiles.
function getTotalTiles(rArray){
  var totalTiles = 0;
  for(var x=0;x<rArray.length;x++){
    for(var y=0;y<rArray[x].length;y++){
      totalTiles++;
    }
  }
  return totalTiles;
}

function getTotalLandTiles(rArray){
  var landTiles = 0;
  for(var x=0;x<rArray.length;x++){
    for(var y=0;y<rArray[x].length;y++){
      if(rArray[x][y].isLand){
        landTiles++;
      }
    }
  }
  return landTiles;
}

function selectElementRandomlyFromWeightedArray(wArray){
  var sumOfWeights = 0;
  for(var i=0; i<wArray.length; i++){
    sumOfWeights = sumOfWeights + wArray[i][1];
  }
  var chosenValue = Math.random()*sumOfWeights;
  var q = 0;
  for(var i=0;i<wArray.length;i++){
    q = q + wArray[i][1];
    if(chosenValue <= q){
      return wArray[i];
    }
  }
}
