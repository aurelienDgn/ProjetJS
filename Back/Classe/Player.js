class Player{
    constructor(name){
        this.name=name;
        this.color=undefined;
        // Tableau des pions du joueur
        this.tableOfShip = [
            {name:"Porte-Avion",nombreRestant:"5"},
            {name:"Croiseur",nombreRestant:"4"},
            {name:"Sous-Marin",nombreRestant:"3"},
            {name:"Sous-Marin",nombreRestant:"3"},
            {name:"Torpilleur",nombreRestant:"2"},
        ];
    }
    //fonctions de retours
    getName(){
        return this.name;
    }
    tableOfShipView(){
        return this.tableOfShip;
    }
    indiceDuType(type){
        for(const indice in this.tableOfShip){
            if(this.tableOfShip[indice].name==type){
                return indice;
            }
        }
    }
    nombreRestantDuType(type){
        for(const element of this.tableOfShip){
            if(element.name==type){
                return element.nombreRestant;
            }
        }
    }
    typeDeLaPiece(indice){
        return this.tableOfShip[indice].name;
    }
    nombreRestantIndice(indice){
        return this.tableOfShip[indice].nombreRestant;
    }
    
    decrNombreRestantDuType(type){
        for(let element of this.tableOfShip){
            if(element.force==type){
                element.nombreRestant--;
                return this.tableOfShip;

            }
        }
    }
    //remplir le tableau des pièces d'un joueur, afin de pouvoir compter combien il en reste
    Remplirtab(){
        this.tableOfShip = [
            {name:"Porte-Avion",nombreRestant:"5"},
            {name:"Croiseur",nombreRestant:"4"},
            {name:"Sous-Marin",nombreRestant:"3"},
            {name:"Sous-Marin",nombreRestant:"3"},
            {name:"Torpilleur",nombreRestant:"2"},
        ];
    }
}
module.exports = Player;