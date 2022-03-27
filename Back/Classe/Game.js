class Game{
    initGrille(){
        let grille = new Array(10);
        for(let i=0;i<10;i++){
            grille[i]= new Array(10);
        }
        return grille;
    }

    constructor(joueur1,joueur2){
        this.joueur1=joueur1;
        this.joueur2=joueur2;
        this.grille=this.initGrille();
        this.ready = 0;
        let now = new Date();
        this.time = now.getMinutes() * 60 + now.getSeconds() ;
        this.winner = undefined;
        this.turn = 1;
        this.arme = 1;
        this.radarUsed=false; 
        this.torpilleUsed=false;
        this.bombeAFragUsed=false;

        /************* */
        this.nbShipAlive = 5;
        this.canPlace = false;
        this.canAttack = false;
        this.canHover = false;
        this.actuSize = 0;
        this.actuSens = 0;
        this.batActu = 0;

        this.bateau3V = ["url('../Images/vertically/boat2.1.png')","url('../Images/vertically/boat2.2.png')"];
        this.bateau3H = ["url('../Images/horizontally/boat2.1.png')","url('../Images/horizontally/boat2.2.png')"];
        this.bateau4V = ["url('../Images/vertically/boat3.1.png')","url('../Images/vertically/boat3.2.png')","url('../Images/vertically/boat3.3.png')"];
        this.bateau4H = ["url('../Images/horizontally/boat3.1.png')","url('../Images/horizontally/boat3.2.png')","url('../Images/horizontally/boat3.3.png')"];
        this.bateau5V = ["url('../Images/vertically/boat3.1.png')","url('../Images/vertically/boat3.2.png')","url('../Images/vertically/boat3.3.png')"];
        this.bateau5H = ["url('../Images/horizontally/boat3.1.png')","url('../Images/horizontally/boat3.2.png')","url('../Images/horizontally/boat3.3.png')"];
        this.bateau6V = ["url('../Images/vertically/boat4.1.png')","url('../Images/vertically/boat4.2.png')","url('../Images/vertically/boat4.3.png')","url('../Images/vertically/boat4.4.png')"];
        this.bateau6H = ["url('../Images/horizontally/boat4.1.png')","url('../Images/horizontally/boat4.2.png')","url('../Images/horizontally/boat4.3.png')","url('../Images/horizontally/boat4.4.png')"];
        this.bateau7V = ["url('../Images/vertically/boat5.1.png')","url('../Images/vertically/boat5.2.png')","url('../Images/vertically/boat5.3.png')","url('../Images/vertically/boat5.4.png')","url('../Images/vertically/boat5.5.png')"];
        this.bateau7H = ["url('../Images/horizontally/boat5.1.png')","url('../Images/horizontally/boat5.2.png')","url('../Images/horizontally/boat5.3.png')","url('../Images/horizontally/boat5.4.png')","url('../Images/horizontally/boat5.5.png')"];
        
        this.batPlace = [0,0,0,false,false,false,false,false];

    }


    /********************************************************* */

    rondPoint(coord, arme){
        if(this.canAttack == true){
            this.attack(coord, arme);
        } else if (this.canPlace){
            this.place(coord);
        }
    }

    port(){
        switch(this.batActu){
            case 3:
                if(this.actuSens == 0){
                    return this.bateau3V;
                } else {
                    return this.bateau3H;
                }
            case 4:
                if(this.actuSens == 0){
                    return this.bateau4V;
                } else {
                    return this.bateau4H;
                }
            case 5:
                if(this.actuSens == 0){
                    return this.bateau5V;
                } else {
                    return this.bateau5H;
                }
            case 6:
                if(this.actuSens == 0){
                    return this.bateau6V;
                } else {
                    return this.bateau6H;
                }
            case 7:
                if(this.actuSens == 0){
                    return this.bateau7V;
                } else {
                    return this.bateau7H;
                }
        }
    }

    place(coord){
        
        let good = true;

        for(let i=0;i<this.actuSize;i++){
            if((this.actuSens == 0) && (document.getElementById("case"+(coord[0]+i)+"-"+coord[1]) == null)){ // Détecter si la case est déjà prise par un autre ship
                good = false;
            } else if ((this.actuSens == 1) && (document.getElementById("case"+(coord[0])+"-"+(coord[1]+i)) == null)){
                good = false;
            }
        }

        if (good == false){
            alert("Erreur le bateau dépasse de la grille");
        } else if (good == true){

        for(let i=0;i<this.actuSize;i++){

            if((this.actuSens == 0) && (good == true)){

                this.setCase((coord[0]+i),coord[1],this.getBatActu());

                this.canHover = false;
                this.canPlace = false;

            } else if(this.actuSens == 1 && good == true){

                this.setCase(coord[0], (coord[1]+i),this.getBatActu());
                
                this.canHover = false;
                this.canPlace = false; 
            }
        }

            //console.log("placé");
            this.batPlace[this.batActu] = true;
        }
    }

    hoverOn(coord){
        // Permet d'afficher les bateaux sur la grille au survol de la souris

        if(this.canHover && (this.batPlace[this.batActu] == false)){
            
            this.canPlace = true;

            let tabBtn = [];
            let good = true;

            let bateau = this.port();

            if(this.actuSens == 0){ 

                for(let i=0;i<this.actuSize;i++){
                    tabBtn[i] = document.getElementById("case"+(coord[0]+i)+"-"+coord[1]);

                    //Evite débordement
                    if((tabBtn[i] != null)){
                        if((this.grille[coord[0]+i][coord[1]] != 0) ){
                        //Si y'a un bateau ici ça ne marche pas 
                        good = false;
                        this.canPlace = false;
                        }
                    }
                }
                
                if(good == true){
                for(let i=0;i<this.actuSize;i++){
                    if(tabBtn[i] != null && good == true){
                        //Sinon on affiche le bateau
                        tabBtn[i].style.backgroundImage = bateau[i];   
                        this.canPlace = true;
                    }
                }   }
                

            } else if (this.actuSens == 1){
                
                for(let i=0;i<this.actuSize;i++){
                    tabBtn[i] = document.getElementById("case"+(coord[0])+"-"+(coord[1]+i));
                    
                    //Evite débordement
                    if(tabBtn[i] != null){
                        if(this.grille[coord[0]][coord[1]+i] != 0){
                        good = false;
                        this.canPlace = false;
                        }
                }

                    if(tabBtn[i] != null && good == true){
                        tabBtn[i].style.backgroundImage = bateau[i]; 
                        this.canPlace = true;
                    }
                }

            }
        }
    }

    hoverOff(coord){
        // Permet d'enlever les bateaux de la grille lorsque la souris ne survole plus la case
        
        if(this.canHover && (this.batPlace[this.batActu] == false)){

            let tabBtn = [];
            let good = true;
            
            if(this.actuSens == 0){

                for(let i=0;i<this.actuSize;i++){

                    tabBtn[i] = document.getElementById("case"+(coord[0]+i)+"-"+coord[1]);
                    
                    //Evite débordement et enlever bateau déjà posé
                    if(tabBtn[i] != null){
                    if(this.grille[coord[0]+i][coord[1]] != 0){
                        good = false;
                        this.canPlace = false;
                    }}

                    if(tabBtn[i] != null && good == true){
                        tabBtn[i].style.backgroundImage = "url(../Images/sea.png)";
                    }
                }

            } else if(this.actuSens == 1){
                for(let i=0;i<this.actuSize;i++){
                    tabBtn[i] = document.getElementById("case"+(coord[0])+"-"+(coord[1]+i));
                    
                    //Evite débordement

                    if(this.grille[coord[0]][coord[1]+i] != 0){
                        good = false;
                        this.canPlace = false;
                    }
                    if(tabBtn[i] != null && good == true){
                        tabBtn[i].style.backgroundImage = "url(../Images/sea.png)";
                    }
                }
            }

        }
    }

    setBatActu(nb){
        this.batActu = nb;
    }

    getBatActu(){
        return this.batActu;
    }

    setCanAttack(b){
        this.canAttack = b;
    }

    getCanAttack(){
        return this.canAttack;
    }

    changeSens(){
        if(this.actuSens == 0){
            this.actuSens = 1;
        } else if (this.actuSens == 1){
            this.actuSens = 0;
        }
    }

    setActuSize(size){
        this.actuSize = size;
    }

    setActuSens(sens){
        this.actuSens = sens;
    }

    setCanHover(b){
        this.canHover = b;
    }

    /*************************************** */
    getArme(){
        return this.arme;
    }
/********************************************* */
    setArme(nb){
        this.arme = nb;
        this.canAttack = true;
        this.canHover = false;
    }

    getjoueur1(){
        return this.joueur1;
    }

    getjoueur2(){
        return this.joueur2;
    }

    getTurn(){
        return this.turn;
    }

    setCase(x,y,content, changeHTML){
        this.grille[x][y]=content;
        /*************************** */
        //Changer l'apparence de la grille
        if(changeHTML){
            this.printCase(x,y,content);
        }
    }

    getCase(x,y){
        return this.grille[x][y];
    }

    lol(){

        for(let i = 0;i<10;i++){
            for(let j=0;j<10;j++){
                this.setCase(i,j,0, false);
            }
        }
    }

    /***************************** */
    printCase(x,y,nb){

        switch(nb){
            case 0:
                document.getElementById("case"+x+"-"+y).textContent = 0;
                break;
            case 1:
                document.getElementById("case"+x+"-"+y).textContent = 1;
                break;
            case 2:
                document.getElementById("case"+x+"-"+y).textContent = 2;
                break;
            case 3:
                document.getElementById("case"+x+"-"+y).textContent = 3;
                break;
            case 4:
                document.getElementById("case"+x+"-"+y).textContent = 4;
                break;
            case 5:
                document.getElementById("case"+x+"-"+y).textContent = 5;
                break;
            case 6:
                document.getElementById("case"+x+"-"+y).textContent = 6;
                break;
            case 7:
                document.getElementById("case"+x+"-"+y).textContent = 7;
                break;
        }
    }

    isCaseEmpty(x,y){
        if(this.grille[x][y]===undefined){
            return true;
        }
        else{
            return false;
        }
    }

    returnGrille(){
        return this.grille;
    }

    consoleLogTable(){
        console.log(this.grille);
    }

    /***********************armes**********************************/
    missile(x,y){
        if (this.isCaseEmpty(x,y)==true)
        {
            this.setCase(x,y,2); //2 pour dire qu'on a touché mais qu'il y avait rien
            return this.getCase(x,y);
        }
        else{
            this.setCase(x,y,1); //1 quand on a touché mais qu'il y avait un bateau 
                                //ne pas oublier de gérer les autres numéros pour les autres bateaux
            return this.getCase(x,y);
        }
    }

    radar(x,y){
        if(this.radarUsed!=true){
            this.radarUsed=true;
            for(i=this.grid[y-1];i=this.grid[y+1];i++){
                for(j=this.grid[x-1];j=this.grid[x+1];j++){

                    if(this.isCaseEmpty(x,y)!=true){ 
                        //récuperer les coord du bateau grace au serv
                        //print bateau à la coord récupérée

                    }
                    
                }
            }
        }
        else{
            alert("Radar déjà utlisé.");
        }
    }

    torpille(x,y){
        if(this.torpilleUsed!=true){
            this.torpilleUsed=true;
            let torpilleAttack=false;

            if (this.isCaseEmpty(x,y)==true){ //récup les coords du serv
                this.setCase(x,y,2); 
                this.getCase(x,y);
            }
            else{
                this.setCase(x,y,1); 
                this.getCase(x,y);
            }

            if(torpilleAttack!=true){
                for(i=this.grid[y-1];i=this.grid[y+1];i++){
                    for(j=this.grid[x-1];j=this.grid[x+1];j++){

                        if (this.isCaseEmpty(x,y)==true){
                            this.setCase(x,y,2); 
                            this.getCase(x,y); //sert à rien, il faudra remplacer par un renvoi au serveur de 
                                              //la case; ici le getcase ME renvoie la case
                        }
                        else{ //Gérer pour les différents bateaux donc else if case =2, 4, 5, etc pour pas
                              //que même s'il y a d'autres bateaux ils soient tapés aussi
                            this.setCase(x,y,1); 
                            this.getCase(x,y);
                        }

                    
                    }
                }
                        
            }
        }
    }

    bombeAFrag(x,y){
        if(this.bombeAFragUsed!=true){
            this.bombeAFragUsed=true;
            for(i=this.grid[y-1];i=this.grid[y+1];i++){
                for(j=this.grid[x-1];j=this.grid[x+1];j++){
                    if(i==this.grid[y]||j==this.grid[x]){

                        if (this.isCaseEmpty(x,y)==true){
                            this.setCase(x,y,2); 
                            this.getCase(x,y);
                        }
                        else{ 
                            this.setCase(x,y,1); 
                            this.getCase(x,y);
                        }
                    }

                
                }
            }
        }

    }
/****************************************************** */

    /************************************ */
    resultAttack(coord,resultAtk,destroyed){

        let g = document.getElementById("case"+coord[0]+"-"+coord[1]);
        if(resultAtk == true){

            if(destroyed == true){
                
                //Demander co du bateau au serveur
                //console.log("Un bateau détruit");
                // Afficher un message

            } else{
                // afficher bateau touché
                //console.log("bat barré");
                let t = g.style.backgroundImage;
                g.style.backgroundImage = "url(../Images/croixV.png), "+t;

            }
        }
        else{
            //console.log("else affiche 2");
            //numéro pas touché
            let t = g.style.backgroundImage;
            g.style.backgroundImage = "url(../Images/rond.png), "+t;
            //this.setCase(coord[0],coord[1],2);
        }
    }

    /******************************************* */
    attack(coord, arme){

        if(this.canAttack == true){
            console.log("Coordonnées : "+coord+"- Arme = "+arme);
            //envoyer au serveur

            // récupère du serveur les paramètres
            this.resultAttack(coord,false,false);
        }
    }

    defense(coord, resultDef, destroyed){
        
        let g = document.getElementById("case"+coord[0]+"-"+coord[1]);
        
        if(resultDef == true){

            if(destroyed == true){
                
                //Demander co du bateau au serveur
                //console.log("if destroyed");
                this.nbShipAlive--;
            } else{
                // afficher bateau touché
                //console.log("bat barré");
                let t = g.style.backgroundImage;
                g.style.backgroundImage = "url(../Images/croixR.png), "+t;

            }
        }
        else{
            console.log("c'est bon il s'est foiré en "+coord[0]+","+coord[1]+" !");
        }

    }


    isFinished(){

        if(this.joueur1.tableOfShip[11].nombreRestant =='0'){
            this.winner = 2;
            return true;
        }

        if(this.joueur2.tableOfShip[11].nombreRestant == '0'){
            this.winner = 1;
            return true;
        }

        let nbr = 10;
        for(let i of this.joueur1.tableOfShip){
            if(!(i == this.joueur1.tableOfShip[0] || i == this.joueur1.tableOfShip[11])){
                if(i.nombreRestant == 0)
                    nbr--;
            }
        }

        if(!nbr) {
            this.winner = 2;
            return true;

        }

        nbr = 10;
        for(let i of this.joueur2.tableOfShip){
            if(!(i == this.joueur2.tableOfShip[0] || i == this.joueur2.tableOfShipView[11])){
                if(i.nombreRestant == 0)
                    nbr--;
            }
        }

        if(!nbr){
            this.winner = 1;
            return true;
        }

        return false;
    }

    setTime(){
        
        let now = new Date();
        let gameTime = now.getMinutes() * 60 + now.getSeconds() ;
        if( gameTime - this.time < 0){
            this.time = gameTime + 3600 - this.time;
        }
        else {
            this.time = gameTime - this.time;
        }
    }
    //Pour faciliter l'ecriture des scores
    exportData(){
        let data = {
            joueur1 : this.joueur1.getName(),
            joueur2 : this.joueur2.getName(),
            tabj1 : this.joueur1.tableOfShipView(),
            tabj2: this.joueur2.tableOfShipView(),
            time : this.time,
            winner : this.winner
        }
        return data;
    }
}

module.exports = Game;

/*
// L'import de la classe Pion ne marche pas si on la mets pas dans Game je ne sais pas pk
class Ship{
    constructor(type,taille,sens ,x,y){
        this.type=type; // Nom de la pièce
        this.taille = taille;
        this.sens = sens; // 1 : horizontale - 0: Verticale
        
        this.x=x; // Coordonnées en ligne de la pièce sur le plateau/grille
        this.y=y; // Coordonnées en colonne de la pièce sur le plateau/grille

        this.alive=true;
    }
    typeDeLaPiece(){
        return this.type;
    }

    getTaille(){
        return this.taille;
    }

    getSens(){
        return this.sens;
    }

    setSens(s){
        this.sens = s;
    }

    setCoord(coord){
        this.x = coord[0];
        this.y = coord[1];
    }
}
//module.exports = Ship;
*/