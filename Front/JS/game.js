let user = document.getElementById("username");

socket.emit("isSession","");


socket.on("onSession", (data) => {              //affichage selon s'il y a une session d'active ou non
    console.log(data);
    if(data){
        user.style.display = "block";
        document.getElementById("username").innerHTML = data;
    }
    else{
        user.style.display = "none";
    }
})