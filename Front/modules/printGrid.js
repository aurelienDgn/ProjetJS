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
            
            // On ajoute événement('click') lorsque l'on clique sur la cellule
            listeners.add(td1,game.attack,[j,i]);

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
