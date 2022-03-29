const { Socket } = require("socket.io");


class Game {
    initGrille() {
        let grille = new Array(10);
        for (let i = 0; i < 10; i++) {
            grille[i] = new Array(10);
        }
        return grille;
    }

    constructor() {
        this.t = "null";
        //this.joueur1 = joueur1;
        //this.joueur2 = joueur2;
        this.grilleJ1 = this.initGrille();
        this.grilleJ2 = this.initGrille();
        this.ready = 0;
        let now = new Date();
        this.time = now.getMinutes() * 60 + now.getSeconds();
        this.winner = undefined;
        this.turn = 1;
        this.arme = 1;
        this.radarUsedJ1 = false;
        this.radarUsedJ2 = false;
        this.torpilleUsedJ1 = false;
        this.torpilleUsedJ2 = false;
        this.bombeAFragUsedJ1 = false;
        this.bombeAFragUsedJ2 = false;

        this.b3J1 = 2;
        this.b4J1 = 3;
        this.b5J1 = 3;
        this.b6J1 = 4;
        this.b7J1 = 5;

        this.b3J2 = 2;
        this.b4J2 = 3;
        this.b5J2 = 3;
        this.b6J2 = 4;
        this.b7J2 = 5;

        this.canPlayJ1 = false;
        this.canPlayJ2 = false;

        /************* */
        this.nbShipAlive = 5;
        this.canPlace = false;
        this.canAttack = false;
        this.canHover = false;
        this.actuSize = 0;
        this.actuSens = 0;
        this.batActu = 0;

        this.bateau3V = ["url('../Images/vertically/boat2.1.png')", "url('../Images/vertically/boat2.2.png')"];
        this.bateau3H = ["url('../Images/horizontally/boat2.1.png')", "url('../Images/horizontally/boat2.2.png')"];
        this.bateau4V = ["url('../Images/vertically/boat3.1.png')", "url('../Images/vertically/boat3.2.png')", "url('../Images/vertically/boat3.3.png')"];
        this.bateau4H = ["url('../Images/horizontally/boat3.1.png')", "url('../Images/horizontally/boat3.2.png')", "url('../Images/horizontally/boat3.3.png')"];
        this.bateau5V = ["url('../Images/vertically/boat3.1.png')", "url('../Images/vertically/boat3.2.png')", "url('../Images/vertically/boat3.3.png')"];
        this.bateau5H = ["url('../Images/horizontally/boat3.1.png')", "url('../Images/horizontally/boat3.2.png')", "url('../Images/horizontally/boat3.3.png')"];
        this.bateau6V = ["url('../Images/vertically/boat4.1.png')", "url('../Images/vertically/boat4.2.png')", "url('../Images/vertically/boat4.3.png')", "url('../Images/vertically/boat4.4.png')"];
        this.bateau6H = ["url('../Images/horizontally/boat4.1.png')", "url('../Images/horizontally/boat4.2.png')", "url('../Images/horizontally/boat4.3.png')", "url('../Images/horizontally/boat4.4.png')"];
        this.bateau7V = ["url('../Images/vertically/boat5.1.png')", "url('../Images/vertically/boat5.2.png')", "url('../Images/vertically/boat5.3.png')", "url('../Images/vertically/boat5.4.png')", "url('../Images/vertically/boat5.5.png')"];
        this.bateau7H = ["url('../Images/horizontally/boat5.1.png')", "url('../Images/horizontally/boat5.2.png')", "url('../Images/horizontally/boat5.3.png')", "url('../Images/horizontally/boat5.4.png')", "url('../Images/horizontally/boat5.5.png')"];

        this.batPlace = [0, 0, 0, false, false, false, false, false];
        this.batPlaceJ1 = false;
        this.batPlaceJ2 = false;

        this.nbBatPlace = 0;

    }


    /********************************************************* */

    setCanPlayJ1(b){
        this.canPlayJ1 = b;
    }

    getCanPlayJ1(){
        return this.canPlayJ1;
    }

    setCanPlayJ2(b){
        this.canPlayJ2 = b;
    }

    getCanPlayJ2(){
        return this.canPlayJ2;
    }

    getBatPlaceJ1(){
        return this.batPlaceJ1;
    }

    setBatPlaceJ1(b){
        this.batPlaceJ1 = b;
    }

    getBatPlaceJ2(){
        return this.batPlaceJ2;
    }

    setBatPlaceJ2(b){
        this.batPlaceJ2 = b;
    }

    getTorpilleJ1(){
        return this.torpilleUsedJ1;
    }

    setTorpilleJ1(b){
        this.torpilleUsedJ1 = b;
    }

    getTorpilleJ2(){
        return this.torpilleUsedJ2;
    }

    setTorpilleJ2(b){
        this.torpilleUsedJ2 = b;
    }

    getBombeJ1(){
        return this.bombeAFragUsedJ1;
    }

    setBombeJ1(b){
        this.bombeAFragUsedJ1 = b;
    }

    getBombeJ2(){
        return this.bombeAFragUsedJ2;
    }

    setBombeJ2(b){
        this.bombeAFragUsedJ2 = b;
    }

    getRadarJ1(){
        return this.radarUsedJ1;
    }

    setRadarJ1(b){
        this.radarUsedJ1 = b;
    }

    getRadarJ2(){
        return this.radarUsedJ2;
    }

    setRadarJ2(b){
        this.radarUsedJ2 = b;
    }

    getB3J1(){
        return this.b3J1;
    }

    setB3J1(nb){
        this.b3J1 += nb;
    }

    getB4J1(){
        return this.b4J1;
    }

    setB4J1(nb){
        this.b4J1 += nb;
    }

    getB5J1(){
        return this.b5J1;
    }

    setB5J1(nb){
        this.b5J1 += nb;
    }

    getB6J1(){
        return this.b6J1;
    }

    setB6J1(nb){
        this.b6J1 += nb;
    }

    getB7J1(){
        return this.b7J1;
    }

    setB7J1(nb){
        this.b7J1 += nb;
    }

    getB3J2(){
        return this.b3J2;
    }

    setB3J2(nb){
        this.b3J2 += nb;
    }

    getB4J2(){
        return this.b4J2;
    }

    setB4J2(nb){
        this.b4J2 += nb;
    }

    getB5J2(){
        return this.b5J2;
    }

    setB5J2(nb){
        this.b5J2 += nb;
    }

    getB6J2(){
        return this.b6J2;
    }

    setB6J2(nb){
        this.b6J2 += nb;
    }

    getB7J2(){
        return this.b7J2;
    }

    setB7J2(nb){
        this.b7J2 += nb;
    }

    setGrilleJ1(grid){
        this.grilleJ1 = grid;
    }

    getGrilleJ1(){
        return this.grilleJ1;
    }

    setGrilleJ2(grid){
        this.grilleJ2 = grid;
    }

    getGrilleJ2(){
        return this.grilleJ2;
    }

    setT(n){
        this.t = n;
    }
    getT(){
        return this.t;
    }

    rondPoint(coord, arme) {
        if (this.canAttack == true) {
            this.attack(coord, arme);
        } else if (this.canPlace) {
            this.place(coord);
        }
    }

    port() {
        switch (this.batActu) {
            case 3:
                if (this.actuSens == 0) {
                    return this.bateau3V;
                } else {
                    return this.bateau3H;
                }
            case 4:
                if (this.actuSens == 0) {
                    return this.bateau4V;
                } else {
                    return this.bateau4H;
                }
            case 5:
                if (this.actuSens == 0) {
                    return this.bateau5V;
                } else {
                    return this.bateau5H;
                }
            case 6:
                if (this.actuSens == 0) {
                    return this.bateau6V;
                } else {
                    return this.bateau6H;
                }
            case 7:
                if (this.actuSens == 0) {
                    return this.bateau7V;
                } else {
                    return this.bateau7H;
                }
        }
    }

    place(coord) {

        let good = true;

        for (let i = 0; i < this.actuSize; i++) {
            if ((this.actuSens == 0) && (document.getElementById("case" + (coord[0] + i) + "-" + coord[1]) == null)) { // Détecter si la case est déjà prise par un autre ship
                good = false;
            } else if ((this.actuSens == 1) && (document.getElementById("case" + (coord[0]) + "-" + (coord[1] + i)) == null)) {
                good = false;
            }
        }

        if (good == false) {
            alert("Erreur le bateau dépasse de la grille");
        } else if (good == true) {

            for (let i = 0; i < this.actuSize; i++) {

                if ((this.actuSens == 0) && (good == true)) {

                    this.setCase((coord[0] + i), coord[1], this.getBatActu());

                    this.canHover = false;
                    this.canPlace = false;

                } else if (this.actuSens == 1 && good == true) {

                    this.setCase(coord[0], (coord[1] + i), this.getBatActu());

                    this.canHover = false;
                    this.canPlace = false;
                }
            }

            //console.log("placé");
            this.batPlace[this.batActu] = true;
            this.nbBatPlace++;
        }
    }

    hoverOn(coord) {
        // Permet d'afficher les bateaux sur la grille au survol de la souris

        if (this.canHover && (this.batPlace[this.batActu] == false)) {

            this.canPlace = true;

            let tabBtn = [];
            let good = true;

            let bateau = this.port();

            if (this.actuSens == 0) {

                for (let i = 0; i < this.actuSize; i++) {
                    tabBtn[i] = document.getElementById("case" + (coord[0] + i) + "-" + coord[1]);

                    //Evite débordement
                    if ((tabBtn[i] != null)) {
                        if ((this.grille[coord[0] + i][coord[1]] != 0)) {
                            //Si y'a un bateau ici ça ne marche pas 
                            good = false;
                            this.canPlace = false;
                        }
                    }
                }

                if (good == true) {
                    for (let i = 0; i < this.actuSize; i++) {
                        if (tabBtn[i] != null && good == true) {
                            //Sinon on affiche le bateau
                            tabBtn[i].style.backgroundImage = bateau[i];
                            this.canPlace = true;
                        }
                    }
                }


            } else if (this.actuSens == 1) {

                for (let i = 0; i < this.actuSize; i++) {
                    tabBtn[i] = document.getElementById("case" + (coord[0]) + "-" + (coord[1] + i));

                    //Evite débordement
                    if (tabBtn[i] != null) {
                        if (this.grille[coord[0]][coord[1] + i] != 0) {
                            good = false;
                            this.canPlace = false;
                        }
                    }

                    if (tabBtn[i] != null && good == true) {
                        tabBtn[i].style.backgroundImage = bateau[i];
                        this.canPlace = true;
                    }
                }

            }
        }
    }

    hoverOff(coord) {
        // Permet d'enlever les bateaux de la grille lorsque la souris ne survole plus la case

        if (this.canHover && (this.batPlace[this.batActu] == false)) {

            let tabBtn = [];
            let good = true;

            if (this.actuSens == 0) {

                for (let i = 0; i < this.actuSize; i++) {

                    tabBtn[i] = document.getElementById("case" + (coord[0] + i) + "-" + coord[1]);

                    //Evite débordement et enlever bateau déjà posé
                    if (tabBtn[i] != null) {
                        if (this.grille[coord[0] + i][coord[1]] != 0) {
                            good = false;
                            this.canPlace = false;
                        }
                    }

                    if (tabBtn[i] != null && good == true) {
                        tabBtn[i].style.backgroundImage = "url(../Images/sea.png)";
                    }
                }

            } else if (this.actuSens == 1) {
                for (let i = 0; i < this.actuSize; i++) {
                    tabBtn[i] = document.getElementById("case" + (coord[0]) + "-" + (coord[1] + i));

                    //Evite débordement

                    if (this.grille[coord[0]][coord[1] + i] != 0) {
                        good = false;
                        this.canPlace = false;
                    }
                    if (tabBtn[i] != null && good == true) {
                        tabBtn[i].style.backgroundImage = "url(../Images/sea.png)";
                    }
                }
            }

        }
    }

    setBatActu(nb) {
        this.batActu = nb;
    }

    getBatActu() {
        return this.batActu;
    }

    setCanAttack(b) {
        this.canAttack = b;
    }

    getCanAttack() {
        return this.canAttack;
    }

    changeSens() {
        if (this.actuSens == 0) {
            this.actuSens = 1;
        } else if (this.actuSens == 1) {
            this.actuSens = 0;
        }
    }

    setActuSize(size) {
        this.actuSize = size;
    }

    setActuSens(sens) {
        this.actuSens = sens;
    }

    setCanHover(b) {
        this.canHover = b;
    }

    /*************************************** */
    getArme() {
        return this.arme;
    }
    /********************************************* */
    setArme(nb) {
        this.arme = nb;
        if(this.nbBatPlace == 5){

            this.canAttack = true;
            this.canHover = false;
        }
    }

    getjoueur1() {
        return this.joueur1;
    }

    getjoueur2() {
        return this.joueur2;
    }

    getTurn() {
        return this.turn;
    }

    setCase(x, y, content, j) {
        if(j == 1){
            console.log("modif grille2");
            this.grilleJ2[x][y] = content;
        } else if (j == 2){
            console.log("modif grillej1");
            this.grilleJ1[x][y] = content;
        } else{
            console.log("bizarre");
        }
        
        /*************************** */
        //Changer l'apparence de la grille
        /*if (changeHTML) {
            this.printCase(x, y, content);
        }*/
    }

    getCase(x, y) {
        return this.grille[x][y];
    }

    lol() {

        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                this.setCase(i, j, 0, false);
            }
        }
    }

    /***************************** */
    printCase(x, y, nb) {

        switch (nb) {
            case 0:
                document.getElementById("case" + x + "-" + y).textContent = 0;
                break;
            case 1:
                document.getElementById("case" + x + "-" + y).textContent = 1;
                break;
            case 2:
                document.getElementById("case" + x + "-" + y).textContent = 2;
                break;
            case 3:
                document.getElementById("case" + x + "-" + y).textContent = 3;
                break;
            case 4:
                document.getElementById("case" + x + "-" + y).textContent = 4;
                break;
            case 5:
                document.getElementById("case" + x + "-" + y).textContent = 5;
                break;
            case 6:
                document.getElementById("case" + x + "-" + y).textContent = 6;
                break;
            case 7:
                document.getElementById("case" + x + "-" + y).textContent = 7;
                break;
        }
    }

    isCaseEmpty(x, y) {
        if (this.grille[x][y] === 0) {
            return true;
        }
        else {
            return false;
        }
    }

    returnGrille() {
        return this.grille;
    }

    consoleLogTable() {
        console.log(this.grille);
    }

    /***********************armes**********************************/

    grilleAdv(coord, content){
        this.adv[coord[0]][coord[1]] = content;
    }

    /*missile(coord){

        let destroy = false;
        let shoot = false;

        if(this.adv[coord[0]][coord[1]] != 0 && this.adv[coord[0]][coord[1]] != 1 && this.adv[coord[0]][coord[1]] != 2){
        
            switch(this.adv[coord[0]][coord[1]]){
                case 3:
                    if(this.advB3 != 0){

                        this.advB3--;
                        shoot = true;
        
                        if(this.advB3 == 0){
                            destroy = true;
                        }
                    }
                    break;
                case 4:
                    if(this.advB4 != 0){

                        this.advB4--;
                        shoot = true;
        
                        if(this.advB4 == 0){
                            destroy = true;
                        }
                    }
                    break;
                case 5:
                    if(this.advB5 != 0){

                        this.advB5--;
                        shoot = true;
        
                        if(this.advB5 == 0){
                            destroy = true;
                        }
                    }
                    break;
                case 6:
                    if(this.advB6 != 0){

                        this.advB6--;
                        shoot = true;
        
                        if(this.advB6 == 0){
                            destroy = true;
                        }
                    }
                    break;
                case 7:
                    if(this.advB7 != 0){

                        this.advB7--;
                        shoot = true;
        
                        if(this.advB7 == 0){
                            destroy = true;
                        }
                    }
                    break;
            }

            
            this.resultAttack(coord, shoot, destroy);
        } else if (this.adv[coord[0]][coord[1]] == 0){
            this.resultAttack(coord, shoot, destroy);
        }

    }

    radar(coord){
        if (this.radarUsed != true) {
            this.radarUsed = true;
            
            let x = coord[0] - 1;
            let y = coord[1] -1;

            for(let i=0; i<3;i++){
                for(let j=0;j<3;j++){
                    console.log("Case : "+this.adv[x+i][y+j]);
                    if(this.adv[x+i][y+j] != 0 && this.adv[x+i][y+j] != 1 && this.adv[x+i][y+j] != 2){
                        console.log("y'a un bateau en "+[x+i]+"-"+[y+j]);
                    }
                }
            }
        }
        else {
            alert("Radar déjà utlisé.");
        }
    }

    torpille(coord){
        if(this.torpilleUsed == false){
            this.torpilleUsed = true;

            if(this.adv[coord[0]][coord[1]] != 0 && this.adv[coord[0]][coord[1]] != 1 && this.adv[coord[0]][coord[1]] != 2){

                switch(this.adv[coord[0]][coord[1]]){
                    case 3:
                        if(this.advB3 <= 2){

                            this.advB3 = 0;

                            for(let i=0;i<10;i++){
                                for(let j=0;j<10;j++){
                                    if(this.adv[i][j] == 3){
                                        this.setCase(i,j,1);
                                        let g = document.getElementById("case" + i + "-" + j);
                                        let t = g.style.backgroundImage;
                                        g.style.backgroundImage = "url(../Images/croixV.png), " + t;
                                    } 
                                }
                            }
                        }
                        break;
                    case 4:
                        console.log(this.advB4);
                        if(this.advB4 <= 2){

                            this.advB4 = 0;

                            for(let i=0;i<10;i++){
                                for(let j=0;j<10;j++){
                                    if(this.adv[i][j] == 4){
                                        this.setCase(i,j,1);
                                        let g = document.getElementById("case" + i + "-" + j);
                                        let t = g.style.backgroundImage;
                                        g.style.backgroundImage = "url(../Images/croixV.png), " + t;
                                    } 
                                }
                            }
                        
                        }
                        break;
                    case 5:
                        if(this.advB5 <= 2){

                            this.advB5 = 0;

                            for(let i=0;i<10;i++){
                                for(let j=0;j<10;j++){
                                    if(this.adv[i][j] == 5){
                                        this.setCase(i,j,1);
                                        let g = document.getElementById("case" + i + "-" + j);
                                        let t = g.style.backgroundImage;
                                        g.style.backgroundImage = "url(../Images/croixV.png), " + t;
                                    } 
                                }
                            }
                        
                        }
                        break;
                    case 6:
                        if(this.advB6 <= 2){

                            this.advB6 = 0;

                            for(let i=0;i<10;i++){
                                for(let j=0;j<10;j++){
                                    if(this.adv[i][j] == 6){
                                        this.setCase(i,j,1);
                                        let g = document.getElementById("case" + i + "-" + j);
                                        let t = g.style.backgroundImage;
                                        g.style.backgroundImage = "url(../Images/croixV.png), " + t;
                                    } 
                                }
                            }
                        
                        }
                        break;
                    case 7:
                        if(this.advB7 <= 2){

                            this.advB7 = 0;

                            for(let i=0;i<10;i++){
                                for(let j=0;j<10;j++){
                                    if(this.adv[i][j] == 7){
                                        this.setCase(i,j,1);
                                        let g = document.getElementById("case" + i + "-" + j);
                                        let t = g.style.backgroundImage;
                                        g.style.backgroundImage = "url(../Images/croixV.png), " + t;
                                    } 
                                }
                            }
                        
                        }
                        break;
                }
            }
        } else{
            alert("Torpille déjà utlisé.");
        }
    }

    bombe(coord){
        if(this.bombeAFragUsed == false){
            this.bombeAFragUsed = true;

            let x = coord[0];
            let y = coord[1];

            if(this.adv[x][y] != 0 && this.adv[x][y] != 1 && this.adv[x][y] != 2){
            
                this.setCase(x,y,1);
                let g = document.getElementById("case" + x + "-" + y);
                let t = g.style.backgroundImage;
                g.style.backgroundImage = "url(../Images/croixV.png), " + t;

                switch(this.adv[x][y]){
                    case 3:
                        this.advB3--;
                        break;
                    case 4:
                        this.advB4--;
                        break;
                    case 5:
                        this.advB5--;
                        break;
                    case 6:
                        this.advB6--;
                        break;
                    case 7:
                        this.advB7--;
                        break;
                }
            }
            
            if(this.adv[x+1][y] != 0 && this.adv[x+1][y] != 1 && this.adv[x+1][y] != 2){
            
                this.setCase(x+1,y,1);
                let g = document.getElementById("case" + (x+1) + "-" + y);
                let t = g.style.backgroundImage;
                g.style.backgroundImage = "url(../Images/croixV.png), " + t;

                switch(this.adv[x+1][y]){
                    case 3:
                        this.advB3--;
                        break;
                    case 4:
                        this.advB4--;
                        break;
                    case 5:
                        this.advB5--;
                        break;
                    case 6:
                        this.advB6--;
                        break;
                    case 7:
                        this.advB7--;
                        break;
                }
            }

            if(this.adv[x-1][y] != 0 && this.adv[x-1][y] != 1 && this.adv[x-1][y] != 2){
            
                this.setCase(x-1,y,1);
                let g = document.getElementById("case" + (x-1) + "-" + y);
                let t = g.style.backgroundImage;
                g.style.backgroundImage = "url(../Images/croixV.png), " + t;

                switch(this.adv[x-1][y]){
                    case 3:
                        this.advB3--;
                        break;
                    case 4:
                        this.advB4--;
                        break;
                    case 5:
                        this.advB5--;
                        break;
                    case 6:
                        this.advB6--;
                        break;
                    case 7:
                        this.advB7--;
                        break;
                }
            }

            if(this.adv[x][y+1] != 0 && this.adv[x][y+1] != 1 && this.adv[x][y+1] != 2){
            
                this.setCase(x,y+1,1);
                let g = document.getElementById("case" + x + "-" + (y+1));
                let t = g.style.backgroundImage;
                g.style.backgroundImage = "url(../Images/croixV.png), " + t;

                switch(this.adv[x][y+1]){
                    case 3:
                        this.advB3--;
                        break;
                    case 4:
                        this.advB4--;
                        break;
                    case 5:
                        this.advB5--;
                        break;
                    case 6:
                        this.advB6--;
                        break;
                    case 7:
                        this.advB7--;
                        break;
                }
            }

            if(this.adv[x][y-1] != 0 && this.adv[x][y-1] != 1 && this.adv[x][y-1] != 2){
            
                this.setCase(x,y-1,1);
                let g = document.getElementById("case" + x + "-" + (y-1));
                let t = g.style.backgroundImage;
                g.style.backgroundImage = "url(../Images/croixV.png), " + t;

                switch(this.adv[x][y-1]){
                    case 3:
                        this.advB3--;
                        break;
                    case 4:
                        this.advB4--;
                        break;
                    case 5:
                        this.advB5--;
                        break;
                    case 6:
                        this.advB6--;
                        break;
                    case 7:
                        this.advB7--;
                        break;
                }
            }
        } else{
            alert("Bombe à fragment déjà utilisé");
        }
    }*/

    /****************************************************** */

    /************************************ */
    resultAttack(coord, resultAtk, destroyed, j) {

        if (resultAtk == true) {

            if (destroyed == true) {

                //Demander co du bateau au serveur
                console.log("Un bateau détruit");
                this.setCase(coord[0],coord[1],1,j);

                // Afficher un message

            } else {
                // afficher bateau touché
                console.log("bat touché");
                this.setCase(coord[0],coord[1],1,j);
            }
        }
        else {
            console.log("rien");
            this.setCase(coord[0],coord[1],2,j);

            //if(j == 1){
                //console.log("modif grille1");
                //this.grilleJ1[x][y] = content;
            //} else if (j == 2){
               // console.log("modif grillej2");
               // this.grilleJ2[x][y] = content;
            //}
        }
    }

    /******************************************* */
    attack(coord, arme) {

        if (this.canAttack == true) {
            console.log("Coordonnées : " + coord + "- Arme = " + arme);

            //envoyer au serveur
            switch (arme){
                case 1:
                    this.missile(coord);
                    break;
                case 2:
                    this.torpille(coord);
                    break;
                case 3:
                    this.radar(coord);
                    break;
                case 4:
                    this.bombe(coord);
                    break;
            }
        }
    }

    defense(coord, resultDef, destroyed) {

        let g = document.getElementById("case" + coord[0] + "-" + coord[1]);

        if (resultDef == true) {

            if (destroyed == true) {

                //Demander co du bateau au serveur
                //console.log("if destroyed");
                this.nbShipAlive--;
            } else {
                // afficher bateau touché
                //console.log("bat barré");
                let t = g.style.backgroundImage;
                g.style.backgroundImage = "url(../Images/croixR.png), " + t;

            }
        }
        else {
            console.log("c'est bon il s'est foiré en " + coord[0] + "," + coord[1] + " !");
        }

    }


    isFinished() {

        if (this.joueur1.tableOfShip[11].nombreRestant == '0') {
            this.winner = 2;
            return true;
        }

        if (this.joueur2.tableOfShip[11].nombreRestant == '0') {
            this.winner = 1;
            return true;
        }

        let nbr = 10;
        for (let i of this.joueur1.tableOfShip) {
            if (!(i == this.joueur1.tableOfShip[0] || i == this.joueur1.tableOfShip[11])) {
                if (i.nombreRestant == 0)
                    nbr--;
            }
        }

        if (!nbr) {
            this.winner = 2;
            return true;

        }

        nbr = 10;
        for (let i of this.joueur2.tableOfShip) {
            if (!(i == this.joueur2.tableOfShip[0] || i == this.joueur2.tableOfShipView[11])) {
                if (i.nombreRestant == 0)
                    nbr--;
            }
        }

        if (!nbr) {
            this.winner = 1;
            return true;
        }

        return false;
    }

    setTime() {

        let now = new Date();
        let gameTime = now.getMinutes() * 60 + now.getSeconds();
        if (gameTime - this.time < 0) {
            this.time = gameTime + 3600 - this.time;
        }
        else {
            this.time = gameTime - this.time;
        }
    }
    //Pour faciliter l'ecriture des scores
    exportData() {
        let data = {
            joueur1: this.joueur1.getName(),
            joueur2: this.joueur2.getName(),
            tabj1: this.joueur1.tableOfShipView(),
            tabj2: this.joueur2.tableOfShipView(),
            time: this.time,
            winner: this.winner
        }
        return data;
    }

};

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