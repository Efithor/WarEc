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
function createReigons(){
  createHexagonalGrid(40,10,10,100,100);
}
//Given a certain radius of
function createHexagonalGrid(radius,xCount,yCount,xOrig,yOrig){
  for(var i=0;i<yCount;i++){
    for(var q=0;q<xCount;q++){
      var newRegion = new paper.Path.RegularPolygon(new paper.Point(xOrig + q * Math.sqrt(3)/2*radius*2,yOrig + i * radius*1.5),6,radius);
      if(i%2){
        newRegion.position.x = newRegion.position.x - (Math.sqrt(3)/2*radius*2)/2;
      }
      newRegion.fillColor = 'green';
      newRegion.strokeColor = 'black';
      newRegion.strokeWidth = 5;
    }
  }
}
//Creates a number of interest objects to compete over regions.
function createInterests(){

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
  createReigons();
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
