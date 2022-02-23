class Game{
    initGrille(){
        let grille = new Array(10);
        for(let i=0;i<10;i++){
            grille[i]= new Array(10);
        }

        for(let i = 0;i<10;i++){

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
    }

    /*************************************** */
    getArme(){
        return this.arme;
    }
/********************************************* */
    setArme(nb){
        this.arme = nb;
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

    setCase(x,y,content){
        this.grille[x][y]=content;
        /*************************** */
        //Changer l'apparence de la grille
        this.printCase(x,y,content);
    }

    getCase(x,y){
        return this.grille[x][y];
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

    /******************************************* */
    attack(coord, arme){
        console.log("Coordonnées : "+coord+"- Arme = "+arme);
        //envoyer au serveur
    }

    /************************************ */
    resultAttack(coord,resultAtk,destroyed){

        if(resultAtk == true){

            if(destroyed == true/*ou mettre numéro du bateau (0 si pas détruit)*/){
                
                //Demander co du bateau au serveur
                //Afficher bateau barré (setCase())
                
            } 
            else{
                
                //setCase(x,y,numéro bateau barré)
            }
        }
    }

    defense(){

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

//module.exports = Game;