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

    setAlive(b){
        this.alive = b;
    }

    getAlive(){
        return this.alive;
    }
}
//module.exports = Ship;