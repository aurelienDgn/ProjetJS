
let game = new G();
createGrid.createTable((document.getElementById('grid'))); // Rempli tableau HTML
game.lol(); //Rempli tableau JS

listeners.initArme();
listeners.initRota();
listeners.bat();


socket.on("result", (msgTab) => {

  console.log("zee ", msgTab);
  if (msgTab =! null && msgTab != -1) {
    console.log("len : "+msgTab.length);
      
      for (let i = 0; i < msgTab.length; i++) {
        console.log("normally");

        let co = msgTab[i];
        game.setCase(co[0], co[1], 1, 1);
        let g = document.getElementById("case" + co[0] + "-" + co[1]);
        let t = g.style.backgroundImage;
        g.style.backgroundImage = "url(../Images/image2.png), " + t;
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
