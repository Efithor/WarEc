//WAR ECON
//A game made in 2018 by Kyle Connor
//@efithor
//Special thanks to KJP
//Made with Paper.js

//Initialize paper

//draw main menu
drawMainMenu();

//Start main loop
paper.window.onFrame(){
  //Main Menu
  if(isMainMenuOpen()){
    //Mouse click related actions
    //newGame
    if(newGameButton){
      newGame();
    }
    //Load Game Menu
    if(loadGameButton){
      loadGameMenu();
    }
    //Settings
    if(settingsButton){
      openSettings();
    }

    //Mouse hover related actions

  }
  //Game
  if(!isMainMenuOpen()){
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
}

//Hoiseted functions
//Initializer Functions
//Creates a series of hexagonal reigon objects for the game to take place on.
//A reigon is a paper object with other attributes ascribed to it.
function createReigons(){

}
//Creates a number of interest objects to compete over regions.
function createInterests(){

}
//Creates a set of PMC objects to work for the interests.
function createPMCs(){

}
function drawMainMenu(){

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
//Checks if the main menu is open.
function isMainMenuOpen(){

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
