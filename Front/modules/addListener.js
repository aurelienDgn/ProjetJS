let listeners = (function(){

    return{

        add(elt,callback, coord){
            //Ajoute un evenement onclick à un élément, lui attribut une callback et passe les coordonnées et arme en param
            elt.addEventListener('click', function(){
                callback(coord, game.getArme());
            });
        },

        initArme(){
            //Ajoute les evenemnts onclick des armes

            document.getElementById("missile").addEventListener('click', function(){
                game.setArme(1);
            });

            document.getElementById("torpille").addEventListener('click', function(){
                game.setArme(2);
            });

            document.getElementById("radar").addEventListener('click', function(){
                game.setArme(3);
            });

            document.getElementById("bombe").addEventListener('click', function(){
                game.setArme(4);
            });
        }

    }
})()