class Pion{
    constructor(type,force,joueur,x,y){
        this.type=type; // Nom de la pièce
        this.joueur=joueur; // Joueur auquel est rattaché cette pièce, la couleur est déductible donc l'attribut "couleur" n'existe pas

        this.x=x; // Coordonnées en ligne de la pièce sur le plateau/grille
        this.y=y; // Coordonnées en colonne de la pièce sur le plateau/grille

        this.alive=true;
    }
    typeDeLaPiece(){
        return this.type;
    }
}
module.exports = Ship;