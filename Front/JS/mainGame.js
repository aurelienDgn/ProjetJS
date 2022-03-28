
let game = new G();
createGrid.createTable((document.getElementById('grid'))); // Rempli tableau HTML
game.lol(); //Rempli tableau JS

listeners.initArme();
listeners.initRota();
listeners.bat();


socket.on("result", (msgTab) => {

    console.log("zee");
    /*let it = document.getElementById("dfd");
    for(let i=0;i<msgTab.length;i++){
        console.log(msgTab[i]+"\n");
        it.textContent += msgTab[i]+"\n"
    }*/
})