
let game = new G();
createGrid.createTable((document.getElementById('grid'))); // Rempli tableau HTML
game.lol(); //Rempli tableau JS

listeners.initArme();
listeners.initRota();
listeners.bat();


socket.on("result", (msgTab) => {

  console.log("zee ", msgTab);
  if (msgTab =! null && msgTab != -1) {
    if (msgTab.length > 0) {
      // console.log("MSGTAB :", msgTab);
      for (let i = 0; i < msgTab.length; i++) {
        game.setCase(msgTab[i][0], msgTab[i][1], 1, 1);
      }

    }
  }
  // let it = document.getElementById("dfd");

  // for(let i=0;i<msgTab.length;i++){
  //     console.log("POOOP ", msgTab[i]+"\n");
  // }
})
