class Game{

    constructor(j1, j2){
        
        this.currentPlayer = 1; // A mettre au hasard au début de chq partie

        this.winner = undefined;

        this.coordBoatJ1;
        this.coordBoatJ2;

        this.grid = []; // 10x10

    }

    initializeGrid(){
        let line = []

        for(let i=0;i<10;i++){
            for(let j=0;j<10;j++){
                line.push(undefined);
            }
            this.grid.push(line);
            line = [];
        }

        console.table(this.grid);
    }

}