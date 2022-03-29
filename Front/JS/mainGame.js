
let game = new G();
createGrid.createTable((document.getElementById('grid'))); // Rempli tableau HTML
game.lol(); //Rempli tableau JS

listeners.initArme();
listeners.initRota();
listeners.bat();

socket.on("result", (msgTab) => {

    let g = document.getElementById("case" + msgTab[0][0] + "-" + msgTab[0][1]);
    console.log(g)
    let t = g.style.backgroundImage;
    g.style.backgroundImage = "url(../Images/croixR.png), " + t;

    console.log("zee ", msgTab);
    if (msgTab != null && msgTab != -1) {
      if(msgTab.length > 0){
        console.log("MSGTAB :", msgTab[0][0], msgTab[0][1]);
        game.setCase(msgTab[0][0], msgTab[0][1],1);
      }
    }
    // let it = document.getElementById("dfd");

    // for(let i=0;i<msgTab.length;i++){
    //     console.log("POOOP ", msgTab[i]+"\n");
    // }
})
socket.on("gameFinish", function(){
  alert("PARTIE FINITO");
})
