let createGrid = (function(){

    function createHeadLine(){
        //Créer la premiere ligne

        let th = document.createElement("tr");
        let j = 1;

        // On ajoute la case dans le coin en haut a gauche
        th.appendChild(document.createElement("td"));

        for(let i=0;i<9;i++){
            let td = document.createElement("td");
            td.innerHTML = j.toString()
            th.appendChild(td);
            j++;
        }

        return th;
    }

    function createLineWithEventClick(i){
        //Créer les lignes avec les evenement onclick

        let alpha = ["A","B","C","D","E","F","G","H","I","J"];

        let tr = document.createElement("tr");
            
        let td = document.createElement("td");
        td.innerHTML = alpha[i];
        tr.appendChild(td);

        for(let j=0;j<9;j++){
            let td1 = document.createElement("td");
            td1.id = "case"+i+"-"+j;

            // On ajoute les images en fond
            //td1.innerHTML = "<img alt='water' src='../Images/sea.png'>";

            if (i == 6 && j == 1){
                td1.innerHTML = "<img alt='boat2' src='../Images/vertically/boat2.1.png'>";
            } else if(i == 7 && j == 1){
                td1.innerHTML = "<img alt='boat2' src='../Images/vertically/boat2.2.png'>";

            } else if (i == 1 && j == 1){
                td1.innerHTML = "<img alt='boat3' src='../Images/horizontally/boat3.1.png'>";
            } else if(i == 1 && j == 2){
                td1.innerHTML = "<img alt='boat3' src='../Images/horizontally/boat3.2.png'>";
            } else if(i == 1 && j == 3){
                td1.innerHTML = "<img alt='boat3' src='../Images/horizontally/boat3.3.png'>";

            } else if (i == 3 && j == 3){
                td1.innerHTML = "<img alt='boat3' src='../Images/vertically/boat3.1.png'>";
            } else if(i == 4 && j == 3){
                td1.innerHTML = "<img alt='boat3' src='../Images/vertically/boat3.2.png'>";
            } else if(i == 5 && j == 3){
                td1.innerHTML = "<img alt='boat3' src='../Images/vertically/boat3.3.png'>";

            } else if (i == 6 && j == 4){
                td1.innerHTML = "<img alt='boat4' src='../Images/horizontally/boat4.1.png'>";
            } else if(i == 6 && j == 5){
                td1.innerHTML = "<img alt='boat4' src='../Images/horizontally/boat4.2.png'>";
            } else if(i == 6 && j == 6){
                td1.innerHTML = "<img alt='boat4' src='../Images/horizontally/boat4.3.png'>";
            } else if(i == 6 && j == 7){
                td1.innerHTML = "<img alt='boat4' src='../Images/horizontally/boat4.4.png'>";

            } else if (i == 0 && j == 6){
                td1.innerHTML = "<img alt='boat5' src='../Images/vertically/boat5.1.png'>";
            } else if(i == 1 && j == 6){
                td1.innerHTML = "<img alt='boat5' src='../Images/vertically/boat5.2.png'>";
            } else if(i == 2 && j == 6){
                td1.innerHTML = "<img alt='boat5' src='../Images/vertically/boat5.3.png'>";
            } else if(i == 3 && j == 6){
                td1.innerHTML = "<img alt='boat5' src='../Images/vertically/boat5.4.png'>";
            } else if(i == 4 && j == 6){
                td1.innerHTML = "<img alt='boat5' src='../Images/vertically/boat5.5.png'>";
            
            } else {
                td1.innerHTML = "<img alt='water' src='../Images/sea.png'>";
            }
            
            // On ajoute événement('click') lorsque l'on clique sur la cellule
            /*listeners.add(td1,game.attack,[j,i]);*/

            tr.appendChild(td1);
        }
        
        return tr;

    }

    return{
        createTable(table){

            table.appendChild(createHeadLine());

            for(let i=0;i<9;i++){
                table.appendChild(createLineWithEventClick(i));
            }
            
        }
    }

})()
