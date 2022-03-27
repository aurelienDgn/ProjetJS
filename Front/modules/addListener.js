let listeners = (function(){

    return{

        addClick(elt, coord){
            //Ajoute un evenement onclick à un élément, lui attribut une callback et passe les coordonnées et arme en param
            elt.addEventListener('click', function(){
                game.rondPoint(coord, game.getArme());
            });

            //elt.addEventListener("mouseover", hihihaha);
            elt.addEventListener("mouseover", function(){
                game.hoverOn(coord);
            })


            //elt.addEventListener("mouseout", ouinouin);
            elt.addEventListener("mouseout", function (){
                game.hoverOff(coord);
            })
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
        },

        initRota(){
            document.getElementById("rot").addEventListener("click", function(){
                game.changeSens();
            })
        },

        bat(){
        //Implémentation des bateaux :  

        let bateau1 = new Pion("Barque", 2,0,0,0);
        let bateau2 = new Pion("Bateau", 3,0,0,0);
        let bateau3 = new Pion("Bateau", 3,0,0,0);
        let bateau4 = new Pion("Cuirasse", 4,0,0,0);
        let bateau5 = new Pion("Porte avion", 5,0,0,0);


        document.getElementById("b1").addEventListener("click", function(){

            game.setCanAttack(false);
            game.setCanHover(true);
            game.setActuSize(bateau1.getTaille());
            game.setBatActu(3);
        });

        document.getElementById("b2").addEventListener("click", function(){

            game.setCanAttack(false);
            game.setCanHover(true);
            game.setActuSize(bateau2.getTaille());
            game.setBatActu(4);
        })

        document.getElementById("b3").addEventListener("click", function(){

            game.setCanAttack(false);
            game.setCanHover(true);
            game.setActuSize(bateau3.getTaille());
            game.setBatActu(5);
        })

        document.getElementById("b4").addEventListener("click", function(){

            game.setCanAttack(false);
            game.setCanHover(true);
            game.setActuSize(bateau4.getTaille());
            game.setBatActu(6);
        })

        document.getElementById("b5").addEventListener("click", function(){

            game.setCanAttack(false);
            game.setCanHover(true);
            game.setActuSize(bateau5.getTaille());
            game.setBatActu(7);
        })
    }

    }
})()