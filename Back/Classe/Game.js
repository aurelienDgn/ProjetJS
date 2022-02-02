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
    }

    getCase(x,y){
        return this.grille[x][y];
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

    //Fonction qui gère toutes les résultats d'attaque possible, que ce soit victoire, défaire, égalité ou cas spéciaux.
    attack(start,end,player){
        let s = parseInt(start)
        let e = parseInt(end)
        this.turn = this.turn %2 +1;
        if(this.grille[Math.trunc(s/10)][s%10].getForce() == 3 && this.grille[Math.trunc(e/10)][e%10].getForce() == 100 ){
            if(player === 1){
                this.joueur2.tableOfShip = this.joueur2.decrNombreRestantDuType('100')
            }
            else{
                this.joueur1.tableOfShip = this.joueur1.decrNombreRestantDuType('100')
            }
            this.grille[Math.trunc(e/10)][e%10] = this.grille[Math.trunc(s/10)][s%10];
            this.grille[Math.trunc(e/10)][e%10].discovered = true;
            this.grille[Math.trunc(s/10)][s%10] = null;
            return [1,100];
        }
        else if(this.grille[Math.trunc(s/10)][s%10].getForce() == 1 && this.grille[Math.trunc(e/10)][e%10].getForce() == 10 ){
            if(player == 1){
                this.joueur2.tableOfShip = this.joueur2.decrNombreRestantDuType('10')
            }
            else{
                this.joueur1.tableOfShip = this.joueur1.decrNombreRestantDuType('10')
            }
            this.grille[Math.trunc(e/10)][e%10] = this.grille[Math.trunc(s/10)][s%10];
            this.grille[Math.trunc(e/10)][e%10].discovered = true;
            this.grille[Math.trunc(s/10)][s%10] = null;
            return [1,10];
        }
        else if(parseInt(this.grille[Math.trunc(s/10)][s%10].getForce()) < parseInt(this.grille[Math.trunc(e/10)][e%10].getForce())){
            let looser = this.grille[Math.trunc(s/10)][s%10].getForce();
            if(player == 1){
                this.joueur1.tableOfShip = this.joueur1.decrNombreRestantDuType(this.grille[Math.trunc(s/10)][s%10].getForce())
            }
            else{
                this.joueur2.tableOfShip = this.joueur2.decrNombreRestantDuType(this.grille[Math.trunc(s/10)][s%10].getForce())
            }
            this.grille[Math.trunc(s/10)][s%10] = null;
            this.grille[Math.trunc(e/10)][e%10].discovered = true;
            return [-1,looser];
        }
        else if(parseInt(this.grille[Math.trunc(s/10)][s%10].getForce()) === parseInt(this.grille[Math.trunc(e/10)][e%10].getForce())){
            let looser = this.grille[Math.trunc(s/10)][s%10].getForce();
            this.joueur1.tableOfShip = this.joueur1.decrNombreRestantDuType(this.grille[Math.trunc(s/10)][s%10].getForce())
            this.joueur2.tableOfShip = this.joueur2.decrNombreRestantDuType(this.grille[Math.trunc(e/10)][e%10].getForce())
            this.grille[Math.trunc(s/10)][s%10] = null;
            this.grille[Math.trunc(e/10)][e%10] = null;
            return [0,looser]
        }
        else if(parseInt(this.grille[Math.trunc(start/10)][start%10].force) > parseInt(this.grille[Math.trunc(e/10)][e%10].force)){
            let looser = this.grille[Math.trunc(e/10)][e%10].force;
            if(player == 1){
                this.joueur2.tableOfShip = this.joueur2.decrNombreRestantDuType(this.grille[Math.trunc(e/10)][e%10].force)
            }
            else{
                this.joueur1.tableOfShip = this.joueur1.decrNombreRestantDuType(this.grille[Math.trunc(e/10)][e%10].force)
            }
            this.grille[Math.trunc(e/10)][e%10] = this.grille[Math.trunc(s/10)][s%10];
            this.grille[Math.trunc(e/10)][e%10].discovered = true;
            this.grille[Math.trunc(s/10)][s%10] = null;
            return [1,looser];
        }

    }

    move(start,end,player){
        let s = parseInt(start)
        let e = parseInt(end)
        this.turn = this.turn %2 +1;
        this.grille[Math.trunc(e/10)][e%10] = this.grille[Math.trunc(s/10)][s%10];
        this.grille[Math.trunc(s/10)][s%10] = null;
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