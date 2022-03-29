let log = document.getElementById("connexion");
let reg = document.getElementById("inscription");
let user = document.getElementById("username");

socket.emit("isSession","");


socket.on("onSession", data=>{              //affichage selon s'il y a une session d'active ou non
    console.log(data);
    if(data){
        log.style.display = "none";
        reg.style.display = "none";
        user.style.display = "";
        document.getElementById("username").innerHTML = data;
    }
    else{
        log.style.display = "block";
        reg.style.display = "block";
        user.style.display = "none";
    }
})