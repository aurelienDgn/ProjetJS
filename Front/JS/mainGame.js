
let game = new G();
createGrid.createTable((document.getElementById('grid'))); // Rempli tableau HTML
game.lol(); //Rempli tableau JS

listeners.initArme();
listeners.initRota();
listeners.bat();

//game.defense([0,4], true, false);
//game.resultAttack([3,2], true, false);
//game.resultAttack([0,0], false, false);



//game.attack([0,1], "arme");
//game.defense([2,2], false, false);
