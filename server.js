/**** Import npm libs ****/

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const session = require("express-session")({
    // CIR2-chat encode in sha256
    secret: "eb8fcc253281389225b4f7872f2336918ddc7f689e1fc41b64d5c4f378cdc438",
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 2 * 60 * 60 * 1000,
        secure: false
    }
});

var Game = require('./Back/Classe/Game.js');
var Player = require('./Back/Classe/Player.js');
var Ship = require('./Back/Classe/Ship.js');
const sharedsession = require("express-socket.io-session");
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const fs = require('fs');
const mysql = require('mysql');
const scoreHandler = require('./Back/Module/scoreHandler');


// Connexion à la base de donnée
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "battlecheap"
});

con.connect(err => {
    if (err) throw err;
    else console.log('Bienvenue dans ma BDD');
});
/***************/

const bcrypt = require('bcryptjs');

const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static(__dirname + '/Front'));
app.use(urlencodedParser);
app.use(session);
app.use(express.json());

//Pour changer le nombre de salons
const roomnbr = 10;
var users = {};
let rooms = new Array(roomnbr);
let games = new Array(roomnbr);
for (let i = 0; i < roomnbr; i++) {
    rooms[i] = new Array(3);
    rooms[i][0] = 0;
}

// Le serveur ecoute sur ce port
http.listen(8880, () => {
    console.log('Serveur lancé sur le port 8880');
})

io.use(sharedsession(session, {
    // Session automatiquement sauvegardée en cas de modification
    autoSave: true
}));

// Détection de si nous sommes en production, pour sécuriser en https
if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    session.cookie.secure = true // serve secure cookies
}

// redirige vers la page d'accueil
app.get("/", (req, res) => {
    res.sendFile(__dirname + '/Front/HTML/index.html');
    let sessionData = req.session;
});

// redirige vers la page de connexion si l'URL contient '/signin'
app.get("/signin", (req, res) => {
    res.sendFile(__dirname + '/Front/HTML/signIn.html');
});


// redirige vers la page d'enregistrement si l'URL contient '/signup'
app.get("/signup", (req, res) => {
    res.sendFile(__dirname + '/Front/HTML/signUp.html');
});

// redirige vers la page d'attente si l'URL contient '/waitingRoom'
app.get('/waitingRoom', (req, res) => {
    req.session.ready = true;
    if (req.session.username) {
        res.sendFile(__dirname + '/Front/HTML/waitingRoom.html');
        console.log(req.session.ready);
    }
    else {
        res.redirect('/signin');
    }
});

// redirige vers la page des regles du jeu si l'URL contient '/rules'
app.get("/rules", (req, res) => {
    res.sendFile(__dirname + '/Front/HTML/rules.html');
});

// redirige vers la page de jeu si l'URL contient '/game'
app.get('/game', (req, res) => {
    // console.log("username", req.session.username, "ready", req.session.ready);
    if (req.session.username && req.session.ready) {
        // console.log(req.session);
        res.sendFile(__dirname + '/Front/HTML/game.html');
    }
    else {
        res.redirect('/');
    }

});

// Directement après la connexion d'un socket au serveur
io.on('connection', (socket) => {

    users[socket.id] = {
        inGame: null,
        player: null
    };

    socket.on('message', (msg) => {
        console.log(socket.handshake.session.username + ' : ' + msg);
        //Envoie le message pour tous!
        io.emit('new-message', socket.handshake.session.username + ' : ' + msg);
        //Autre alternative : envoyer le message à tous les autres socket ormis celui qui envoie
        //socket.broadcast.emit('new-message', msg);
    });

    // Entre dans la salle d'attente, il faut attendre un deuxième joueur.
    socket.join('waitingRoom');

    socket.on("register", (info) => {
        let sql = "INSERT INTO users VALUES (default,?,?)";
        con.query(sql, [info[0], info[1], info[2]], (err) => {
            if (err) throw err;
        });

    });

    socket.on("getScore", () => {
        socket.emit("sendScore", (scoreHandler.getScores()));
        socket.handshake.session.ready = undefined;
    })

    socket.on("isSession", () => {
        io.emit("onSession", socket.handshake.session.username);
    });

    socket.on("username", (info) => {
        let sql = "SELECT username FROM users WHERE username = ?";
        con.query(sql, [info[0]], (err, res) => {
            if (err) throw err;
            socket.emit("resultUser", res);
        });
    });

    socket.on("password", (info) => {
        let sql = "SELECT password FROM users WHERE username = ?";
        con.query(sql, [info[0]], (err, res) => {
            if (err) throw err;
            socket.emit("resultPass", res[0].password);
        });
    });

    socket.on("crypt", (info) => {
        bcrypt.hash(info, 10, function (err, hash) {
            if (err) throw err;
            socket.emit("resultCrypt", hash);
        });
    });

    socket.on("decrypt", (info) => {
        bcrypt.compare(info[0], info[1], function (err, res) {
            if (err) throw err;
            socket.emit("resultDecrypt", res);
        });
    });

    socket.on("getRoom", () => {
        for (let i = 0; i < roomnbr; i++) {
            if (rooms[i][0] !== 2 && (i === 0 || rooms[i - 1][0] === 2)) {
                rooms[i][0] += 1; // Nbr de joueurs
                socket.handshake.session.player = rooms[i][0];
                socket.join("room" + i);
                rooms[i][rooms[i][0]] = socket.handshake.session.username
                socket.handshake.session.room = i;
                if (rooms[i][0] === 2) {
                    let joueur1 = new Player(rooms[socket.handshake.session.room][1])
                    let joueur2 = new Player(rooms[socket.handshake.session.room][2]);
                    games[socket.handshake.session.room] = new Game(joueur1, joueur2);
                    games[socket.handshake.session.room].ready = 0;
                    socket.to("room" + i).emit("redirectJ1"); // Envoie uniquement à l'autre joueur cette socket
                    socket.emit("redirectJ2"); // socket envoyé uniquement à l'emetteur
                }
                i = roomnbr;
            }
        }
    });

    /**
     * Traitement du tir
     */
    socket.on('shot', function (position) {
        var game = users[socket.id].inGame, opponent;

        if (game !== null) {
            // L'utilisateur est-il en ligne ?
            if (game.currentPlayer === users[socket.id].player) {
                opponent = game.currentPlayer === 0 ? 1 : 0;

                if (game.shoot(position)) {
                    // Le tir mène-t-il à la victoire ?
                    checkGameOver(game);

                    // Renouvelle le statut de jeu des deux côtés
                    io.to(socket.id).emit('update', game.getGameState(users[socket.id].player, opponent));
                    io.to(game.getPlayerId(opponent)).emit('update', game.getGameState(opponent, opponent));
                }
            }
        }
    });

    /**
     * Si un joueur quitte le jeu
     */
    socket.on('leave', function () {
        if (users[socket.id].inGame !== null) {
            leaveGame(socket);

            socket.join('waiting room');
            joinWaitingPlayers();
        }
    });

    /**
     * Si un joueur perd la connexion
     */
    socket.on('disconnect', function () {
        leaveGame(socket);

        delete users[socket.id];
    });

    joinWaitingPlayers();


    /****************************************************************************/

    let j1 = new Game();

    let j2 = new Game();

    /*socket.on('test', function(){
        console.log(socket.handshake.session.player);
    })*/

    // // On Fire Received
    // socket.on('fire', id => {
    //   console.log('Shot fired at ', id)
    //
    //   // Emit the move to the other player
    //   socket.broadcast.emit('fire', id)
    // })

    // // on Fire Reply
    // socket.on('fire-reply', square => {
    //   console.log(square)
    //
    //   // Forward the reply to the other player
    //   socket.broadcast.emit('fire-reply', square)
    // })

    socket.on('ship', function (grid) {
        if (socket.handshake.session.player == 1) {
            games[socket.handshake.session.room].setGrilleJ1(grid);
            games[socket.handshake.session.room].setBatPlaceJ1(true);

            if (games[socket.handshake.session.room].getBatPlaceJ2() && games[socket.handshake.session.room].getBatPlaceJ1()) {
                games[socket.handshake.session.room].setCanPlayJ1(true);
                games[socket.handshake.session.room].setCanPlayJ2(false);
            }

        } else if (socket.handshake.session.player == 2) {
            games[socket.handshake.session.room].setGrilleJ2(grid);
            games[socket.handshake.session.room].setBatPlaceJ2(true);

            if (games[socket.handshake.session.room].getBatPlaceJ2() && games[socket.handshake.session.room].getBatPlaceJ1()) {
                games[socket.handshake.session.room].setCanPlayJ1(true);
                games[socket.handshake.session.room].setCanPlayJ2(false);
            }

        }

        //console.log("J1 = "+j1.getT()+" - J2 = "+j2.getT());

    })

    function missile(coord) {

        let grilleAdv;

        if (socket.handshake.session.player == 1) {
            grilleAdv = games[socket.handshake.session.room].getGrilleJ2();

            let destroy = false;
            let shoot = false;

            if (grilleAdv[coord[0]][coord[1]] != 0 && grilleAdv[coord[0]][coord[1]] != 1 && grilleAdv[coord[0]][coord[1]] != 2) {

                switch (grilleAdv[coord[0]][coord[1]]) {
                    case 3:
                        if (games[socket.handshake.session.room].getB3J2() != 0) {

                            games[socket.handshake.session.room].incB3J2(-1);
                            console.log("B3 = " + games[socket.handshake.session.room].getB3J2());
                            shoot = true;

                            if (games[socket.handshake.session.room].getB3J2() == 0) {
                                destroy = true;
                            }
                        }
                        break;
                    case 4:
                        if (games[socket.handshake.session.room].getB4J2() != 0) {

                            games[socket.handshake.session.room].incB4J2(-1);
                            shoot = true;

                            if (games[socket.handshake.session.room].getB4J2() == 0) {
                                destroy = true;
                            }
                        }
                        break;
                    case 5:
                        if (games[socket.handshake.session.room].getB5J2() != 0) {

                            games[socket.handshake.session.room].incB5J2(-1);
                            shoot = true;

                            if (games[socket.handshake.session.room].getB5J2() == 0) {
                                destroy = true;
                            }
                        }
                        break;
                    case 6:
                        if (games[socket.handshake.session.room].getB6J2() != 0) {

                            games[socket.handshake.session.room].incB6J2(-1);
                            shoot = true;

                            if (games[socket.handshake.session.room].getB6J2() == 0) {
                                destroy = true;
                            }
                        }
                        break;
                    case 7:
                        if (games[socket.handshake.session.room].getB7J2() != 0) {

                            games[socket.handshake.session.room].incB7J2(-1);
                            shoot = true;

                            if (games[socket.handshake.session.room].getB7J2() == 0) {
                                destroy = true;
                            }
                        }
                        break;
                }

                games[socket.handshake.session.room].resultAttack(coord, shoot, destroy, 1);
                console.log("m1");
                socket.emit("res", coord, shoot, destroy);
                // socket.broadcast.emit("res", coord, shoot, destroy)

            } else if (grilleAdv[coord[0]][coord[1]] == 0) {

                games[socket.handshake.session.room].resultAttack(coord, shoot, destroy, 1);
                socket.emit("res", coord, shoot, destroy);
                // socket.broadcast.emit("res", coord, shoot, destroy)
            }

        } else if (socket.handshake.session.player == 2) {
            grilleAdv = games[socket.handshake.session.room].getGrilleJ1();

            let destroy = false;
            let shoot = false;

            if (grilleAdv[coord[0]][coord[1]] != 0 && grilleAdv[coord[0]][coord[1]] != 1 && grilleAdv[coord[0]][coord[1]] != 2) {

                switch (grilleAdv[coord[0]][coord[1]]) {
                    case 3:
                        if (games[socket.handshake.session.room].getB3J1() != 0) {

                            games[socket.handshake.session.room].incB3J1(-1);
                            shoot = true;

                            if (games[socket.handshake.session.room].getB3J1() == 0) {
                                destroy = true;
                            }
                        }
                        break;
                    case 4:
                        if (games[socket.handshake.session.room].getB4J1() != 0) {

                            games[socket.handshake.session.room].incB4J1(-1);
                            shoot = true;

                            if (games[socket.handshake.session.room].getB4J1() == 0) {
                                destroy = true;
                            }
                        }
                        break;
                    case 5:
                        if (games[socket.handshake.session.room].getB5J1() != 0) {

                            games[socket.handshake.session.room].incB5J1(-1);
                            shoot = true;

                            if (games[socket.handshake.session.room].getB5J1() == 0) {
                                destroy = true;
                            }
                        }
                        break;
                    case 6:
                        if (games[socket.handshake.session.room].getB6J1() != 0) {

                            games[socket.handshake.session.room].incB6J1(-1);
                            shoot = true;

                            if (games[socket.handshake.session.room].getB6J1() == 0) {
                                destroy = true;
                            }
                        }
                        break;
                    case 7:
                        if (games[socket.handshake.session.room].getB7J1() != 0) {

                            games[socket.handshake.session.room].incB7J1(-1);
                            shoot = true;

                            if (games[socket.handshake.session.room].getB7J1() == 0) {
                                destroy = true;
                            }
                        }
                        break;
                }

                games[socket.handshake.session.room].resultAttack(coord, shoot, destroy, 2);
                console.log("m2");
                socket.emit("res", coord, shoot, destroy);
                // socket.broadcast.emit("res", coord, shoot, destroy)

            } else if (grilleAdv[coord[0]][coord[1]] == 0) {

                games[socket.handshake.session.room].resultAttack(coord, shoot, destroy, 2);
                console.log("m3");
                socket.emit("res", coord, shoot, destroy);
                // socket.broadcast.emit("res", coord, shoot, destroy)
            }
        }
    }

    function radar(coord) {

        let grilleAdv;
        let tabR = new Array();
        let l = 0;

        if (socket.handshake.session.player == 1) {

            if (games[socket.handshake.session.room].getRadarJ1() != true) {
                games[socket.handshake.session.room].setRadarJ1(true);

                grilleAdv = games[socket.handshake.session.room].getGrilleJ2();

                let x = coord[0] - 1;
                let y = coord[1] - 1;

                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        console.log("Case : " + grilleAdv[x + i][y + j]);
                        if (grilleAdv[x + i][y + j] != 0 && grilleAdv[x + i][y + j] != 1 && grilleAdv[x + i][y + j] != 2) {
                            console.log("y'a un bateau en " + [x + i] + "-" + [y + j]);
                            //Afficher sur le front les co
                            tabR[l] = [(x + i), (y + j)];
                            l++;
                        }
                    }
                }
                socket.emit("radar", tabR);
            }
            else {
                console.log("Radar déjà utilisé");
                tabR = 1;
                socket.emit("radar", tabR);
            }

        } else if (socket.handshake.session.player == 2) {

            if (games[socket.handshake.session.room].getRadarJ2() != true) {
                games[socket.handshake.session.room].setRadarJ2(true);

                grilleAdv = games[socket.handshake.session.room].getGrilleJ1();

                let x = coord[0] - 1;
                let y = coord[1] - 1;

                for (let i = 0; i <= 2; i++) {
                    for (let j = 0; j <= 2; j++) {
                        console.log("Case : " + grilleAdv[x + i][y + j]);
                        if (grilleAdv[x + i][y + j] != 0 && grilleAdv[x + i][y + j] != 1 && grilleAdv[x + i][y + j] != 2) {
                            console.log("y'a un bateau en " + [x + i] + "-" + [y + j]);
                            //Afficher sur le front les co
                            tabR[l] = [(x + i), (y + j)];
                            l++;
                        }
                    }
                }
                socket.emit("radar", tabR);
            }
            else {
                console.log("Radar déjà utilisé");
                //Afficher sur le front que le radar est déjà utilisé
            }
        }
    }

    function torpille(coord) {

        let grilleAdv;
        let tabCoord = new Array(2);
        let l = 0;

        if (socket.handshake.session.player == 1) {
            if (games[socket.handshake.session.room].getTorpilleJ1() == false) {
                games[socket.handshake.session.room].setTorpilleJ1(true);

                grilleAdv = games[socket.handshake.session.room].getGrilleJ2();

                if (grilleAdv[coord[0]][coord[1]] != 0 && grilleAdv[coord[0]][coord[1]] != 1 && grilleAdv[coord[0]][coord[1]] != 2) {

                    switch (grilleAdv[coord[0]][coord[1]]) {
                        case 3:
                            if (games[socket.handshake.session.room].getB3J2() <= 2) {

                                games[socket.handshake.session.room].setB3J2(0);

                                for (let i = 0; i < 10; i++) {
                                    for (let j = 0; j < 10; j++) {
                                        if (grilleAdv[i][j] == 3) {
                                            games[socket.handshake.session.room].setCase(i, j, 1, 1);
                                            tabCoord[l] = [i, j];
                                            l++;
                                        }
                                    }
                                }

                                socket.emit("torp", tabCoord);
                            }
                            break;
                        case 4:
                            if (games[socket.handshake.session.room].getB4J2() <= 2) {

                                games[socket.handshake.session.room].setB4J2(0);

                                for (let i = 0; i < 10; i++) {
                                    for (let j = 0; j < 10; j++) {
                                        if (grilleAdv[i][j] == 4) {
                                            games[socket.handshake.session.room].setCase(i, j, 1, 1);
                                            tabCoord[l] = [i, j];
                                            l++;
                                        }
                                    }
                                }
                                socket.emit("torp", tabCoord);
                            }
                            break;
                        case 5:
                            if (games[socket.handshake.session.room].getB5J2() <= 2) {

                                games[socket.handshake.session.room].setB5J2(0);

                                for (let i = 0; i < 10; i++) {
                                    for (let j = 0; j < 10; j++) {
                                        if (grilleAdv[i][j] == 5) {
                                            games[socket.handshake.session.room].setCase(i, j, 1, 1);
                                            tabCoord[l] = [i, j];
                                            l++;
                                        }
                                    }
                                }
                                socket.emit("torp", tabCoord);
                            }
                            break;
                        case 6:
                            if (games[socket.handshake.session.room].getB6J2() <= 2) {

                                games[socket.handshake.session.room].setB6J2(0);

                                for (let i = 0; i < 10; i++) {
                                    for (let j = 0; j < 10; j++) {
                                        if (grilleAdv[i][j] == 6) {
                                            games[socket.handshake.session.room].setCase(i, j, 1, 1);
                                            tabCoord[l] = [i, j];
                                            l++;
                                        }
                                    }
                                }
                                socket.emit("torp", tabCoord);
                            }
                            break;
                        case 7:
                            if (games[socket.handshake.session.room].getB7J2() <= 2) {

                                games[socket.handshake.session.room].setB7J2(0);

                                for (let i = 0; i < 10; i++) {
                                    for (let j = 0; j < 10; j++) {
                                        if (grilleAdv[i][j] == 7) {
                                            games[socket.handshake.session.room].setCase(i, j, 1, 1);
                                            tabCoord[l] = [i, j];
                                            l++;
                                        }
                                    }
                                }
                                socket.emit("torp", tabCoord);
                            }
                            break;
                    }
                }
            } else {
                console.log("Torpille déjà utlisé.");
                tabCoord = 1;
                socket.emit("radar", tabCoord);
            }
        } else if (socket.handshake.session.player == 2) {

            if (games[socket.handshake.session.room].getTorpilleJ2() == false) {
                games[socket.handshake.session.room].setTorpilleJ2(true);

                grilleAdv = games[socket.handshake.session.room].getGrilleJ1();

                if (grilleAdv[coord[0]][coord[1]] != 0 && grilleAdv[coord[0]][coord[1]] != 1 && grilleAdv[coord[0]][coord[1]] != 2) {

                    switch (grilleAdv[coord[0]][coord[1]]) {
                        case 3:
                            if (games[socket.handshake.session.room].getB3J1() <= 2) {

                                games[socket.handshake.session.room].setB3J1(0);

                                for (let i = 0; i < 10; i++) {
                                    for (let j = 0; j < 10; j++) {
                                        if (grilleAdv[i][j] == 3) {
                                            games[socket.handshake.session.room].setCase(i, j, 1, 2);
                                            tabCoord[l] = [i, j];
                                            l++;
                                        }
                                    }
                                }

                                socket.emit("torp", tabCoord);
                            }
                            break;
                        case 4:
                            if (games[socket.handshake.session.room].getB4J1() <= 2) {

                                games[socket.handshake.session.room].setB4J1(0);

                                for (let i = 0; i < 10; i++) {
                                    for (let j = 0; j < 10; j++) {
                                        if (grilleAdv[i][j] == 4) {
                                            games[socket.handshake.session.room].setCase(i, j, 1, 2);
                                            tabCoord[l] = [i, j];
                                            l++;
                                        }
                                    }
                                }
                                socket.emit("torp", tabCoord);

                            }
                            break;
                        case 5:
                            if (games[socket.handshake.session.room].getB5J1() <= 2) {

                                games[socket.handshake.session.room].setB5J1(0);

                                for (let i = 0; i < 10; i++) {
                                    for (let j = 0; j < 10; j++) {
                                        if (grilleAdv[i][j] == 5) {
                                            games[socket.handshake.session.room].setCase(i, j, 1, 2);
                                            tabCoord[l] = [i, j];
                                            l++;
                                        }
                                    }
                                }
                                socket.emit("torp", tabCoord);
                            }
                            break;
                        case 6:
                            if (games[socket.handshake.session.room].getB6J1() <= 2) {

                                games[socket.handshake.session.room].setB6J1(0);

                                for (let i = 0; i < 10; i++) {
                                    for (let j = 0; j < 10; j++) {
                                        if (grilleAdv[i][j] == 6) {
                                            games[socket.handshake.session.room].setCase(i, j, 1, 2);
                                            tabCoord[l] = [i, j];
                                            l++;
                                        }
                                    }
                                }
                                socket.emit("torp", tabCoord);
                            }
                            break;
                        case 7:
                            if (games[socket.handshake.session.room].getB7J1() <= 2) {

                                games[socket.handshake.session.room].setB7J1(0);

                                for (let i = 0; i < 10; i++) {
                                    for (let j = 0; j < 10; j++) {
                                        if (grilleAdv[i][j] == 7) {
                                            games[socket.handshake.session.room].setCase(i, j, 1, 2);
                                            tabCoord[l] = [i, j];
                                            l++;
                                        }
                                    }
                                }
                                socket.emit("torp", tabCoord);
                            }
                            break;
                            1
                    }
                } else {
                    console.log("Torpille déjà utlisé.");
                    tabCoord = 1;
                    socket.emit("radar", tabCoord);
                }
            }
        }
    }

    function bombe(coord) {

        let grilleAdv;
        let tabBmb = new Array();
        let l = 0;

        if (socket.handshake.session.player == 1) {
            if (games[socket.handshake.session.room].getBombeJ1() == false) {
                games[socket.handshake.session.room].setBombeJ1(true);

                grilleAdv = games[socket.handshake.session.room].getGrilleJ2();

                let x = coord[0];
                let y = coord[1];

                if (grilleAdv[x][y] != 0 && grilleAdv[x][y] != 1 && grilleAdv[x][y] != 2) {


                    switch (grilleAdv[x][y]) {
                        case 3:
                            games[socket.handshake.session.room].incB3J2(-1);
                            break;
                        case 4:
                            games[socket.handshake.session.room].incB4J2(-1);
                            break;
                        case 5:
                            games[socket.handshake.session.room].incB5J2(-1);
                            break;
                        case 6:
                            games[socket.handshake.session.room].incB6J2(-1);
                            break;
                        case 7:
                            games[socket.handshake.session.room].incB7J2(-1);
                            break;
                    }
                    tabBmb[l] = [x, y];
                    l++
                    games[socket.handshake.session.room].setCase(x, y, 1, 1);
                }

                if (grilleAdv[x + 1][y] != 0 && grilleAdv[x + 1][y] != 1 && grilleAdv[x + 1][y] != 2) {


                    switch (grilleAdv[x + 1][y]) {
                        case 3:
                            games[socket.handshake.session.room].incB3J2(-1);
                            break;
                        case 4:
                            games[socket.handshake.session.room].incB4J2(-1);
                            break;
                        case 5:
                            games[socket.handshake.session.room].incB5J2(-1);
                            break;
                        case 6:
                            games[socket.handshake.session.room].incB6J2(-1);
                            break;
                        case 7:
                            games[socket.handshake.session.room].incB7J2(-1);
                            break;
                    }
                    //console.log("x+1 : "+[x+1,y]);
                    tabBmb[l] = [x + 1, y];
                    l++;
                    games[socket.handshake.session.room].setCase(x + 1, y, 1, 1);
                }

                if (grilleAdv[x - 1][y] != 0 && grilleAdv[x - 1][y] != 1 && grilleAdv[x - 1][y] != 2) {


                    switch (grilleAdv[x - 1][y]) {
                        case 3:
                            games[socket.handshake.session.room].incB3J2(-1);
                            break;
                        case 4:
                            games[socket.handshake.session.room].incB4J2(-1);
                            break;
                        case 5:
                            games[socket.handshake.session.room].incB5J2(-1);
                            break;
                        case 6:
                            games[socket.handshake.session.room].incB6J2(-1);
                            break;
                        case 7:
                            games[socket.handshake.session.room].incB7J2(-1);
                            break;
                    }
                    //console.log("x-1 : "+[x-1,y]);
                    tabBmb[l] = [x - 1, y];
                    l++;
                    games[socket.handshake.session.room].setCase(x - 1, y, 1, 1);
                }

                if (grilleAdv[x][y + 1] != 0 && grilleAdv[x][y + 1] != 1 && grilleAdv[x][y + 1] != 2) {


                    switch (grilleAdv[x][y + 1]) {
                        case 3:
                            games[socket.handshake.session.room].incB3J2(-1);
                            break;
                        case 4:
                            games[socket.handshake.session.room].incB4J2(-1);
                            break;
                        case 5:
                            games[socket.handshake.session.room].incB5J2(-1);
                            break;
                        case 6:
                            games[socket.handshake.session.room].incB6J2(-1);
                            break;
                        case 7:
                            games[socket.handshake.session.room].incB7J2(-1);
                            break;
                    }
                    //console.log("y+1 : "+[x,y+1]);
                    tabBmb[l] = [x, y + 1];
                    l++;
                    games[socket.handshake.session.room].setCase(x, y + 1, 1, 1);
                }

                if (grilleAdv[x][y - 1] != 0 && grilleAdv[x][y - 1] != 1 && grilleAdv[x][y - 1] != 2) {


                    switch (grilleAdv[x][y - 1]) {
                        case 3:
                            games[socket.handshake.session.room].incB3J2(-1);
                            break;
                        case 4:
                            games[socket.handshake.session.room].incB4J2(-1);
                            break;
                        case 5:
                            games[socket.handshake.session.room].incB5J2(-1);
                            break;
                        case 6:
                            games[socket.handshake.session.room].incB6J2(-1);
                            break;
                        case 7:
                            games[socket.handshake.session.room].incB7J2(-1);
                            break;
                    }
                    //console.log("y-1 : "+[x,y-1]);
                    tabBmb[l] = [x, y - 1];
                    l++;
                    games[socket.handshake.session.room].setCase(x, y - 1, 1, 1);
                }

                //console.log(tabBmb);
                socket.emit("bomb", tabBmb);

            } else {
                //alert("Bombe à fragment déjà utilisé");
                console.log("Bombe déjà utilisé");
                tabBmb = 1;
                socket.emit("radar", tabBmb);
            }
        } else if (socket.handshake.session.player == 2) {
            if (games[socket.handshake.session.room].getBombeJ2() == false) {
                games[socket.handshake.session.room].setBombeJ2(true);

                grilleAdv = games[socket.handshake.session.room].getGrilleJ1();

                let x = coord[0];
                let y = coord[1];

                if (grilleAdv[x][y] != 0 && grilleAdv[x][y] != 1 && grilleAdv[x][y] != 2) {


                    switch (grilleAdv[x][y]) {
                        case 3:
                            games[socket.handshake.session.room].incB3J1(-1);
                            break;
                        case 4:
                            games[socket.handshake.session.room].incB4J1(-1);
                            break;
                        case 5:
                            games[socket.handshake.session.room].incB5J1(-1);
                            break;
                        case 6:
                            games[socket.handshake.session.room].incB6J1(-1);
                            break;
                        case 7:
                            games[socket.handshake.session.room].incB7J1(-1);
                            break;
                    }

                    tabBmb[l] = [x, y];
                    l++;
                    games[socket.handshake.session.room].setCase(x, y, 1, 2);
                }

                if (grilleAdv[x + 1][y] != 0 && grilleAdv[x + 1][y] != 1 && grilleAdv[x + 1][y] != 2) {


                    switch (grilleAdv[x + 1][y]) {
                        case 3:
                            games[socket.handshake.session.room].incB3J1(-1);
                            break;
                        case 4:
                            games[socket.handshake.session.room].incB4J1(-1);
                            break;
                        case 5:
                            games[socket.handshake.session.room].incB5J1(-1);
                            break;
                        case 6:
                            games[socket.handshake.session.room].incB6J1(-1);
                            break;
                        case 7:
                            games[socket.handshake.session.room].incB7J1(-1);
                            break;
                    }
                    //console.log("x+1 : "+[x+1,y]);
                    tabBmb[l] = [x + 1 + 1, y];
                    l++;
                    games[socket.handshake.session.room].setCase(x + 1, y, 1, 2);
                }

                if (grilleAdv[x - 1][y] != 0 && grilleAdv[x - 1][y] != 1 && grilleAdv[x - 1][y] != 2) {


                    switch (grilleAdv[x - 1][y]) {
                        case 3:
                            games[socket.handshake.session.room].incB3J1(-1);
                            break;
                        case 4:
                            games[socket.handshake.session.room].incB4J1(-1);
                            break;
                        case 5:
                            games[socket.handshake.session.room].incB5J1(-1);
                            break;
                        case 6:
                            games[socket.handshake.session.room].incB6J1(-1);
                            break;
                        case 7:
                            games[socket.handshake.session.room].incB7J1(-1);
                            break;
                    }
                    //console.log("x-1 : "+[x-1,y]);
                    tabBmb[l] = [x - 1, y];
                    l++;
                    games[socket.handshake.session.room].setCase(x - 1, y, 1, 2);
                }

                if (grilleAdv[x][y + 1] != 0 && grilleAdv[x][y + 1] != 1 && grilleAdv[x][y + 1] != 2) {


                    switch (grilleAdv[x][y + 1]) {
                        case 3:
                            games[socket.handshake.session.room].incB3J1(-1);
                            break;
                        case 4:
                            games[socket.handshake.session.room].incB4J1(-1);
                            break;
                        case 5:
                            games[socket.handshake.session.room].incB5J1(-1);
                            break;
                        case 6:
                            games[socket.handshake.session.room].incB6J1(-1);
                            break;
                        case 7:
                            games[socket.handshake.session.room].incB7J1(-1);
                            break;
                    }
                    //console.log("y+1 : "+[x,y+1]);
                    tabBmb[l] = [x, y + 1];
                    l++;
                    games[socket.handshake.session.room].setCase(x, y + 1, 1, 2);
                }

                if (grilleAdv[x][y - 1] != 0 && grilleAdv[x][y - 1] != 1 && grilleAdv[x][y - 1] != 2) {


                    switch (grilleAdv[x][y - 1]) {
                        case 3:
                            games[socket.handshake.session.room].incB3J1(-1);
                            break;
                        case 4:
                            games[socket.handshake.session.room].incB4J1(-1);
                            break;
                        case 5:
                            games[socket.handshake.session.room].incB5J1(-1);
                            break;
                        case 6:
                            games[socket.handshake.session.room].incB6J1(-1);
                            break;
                        case 7:
                            games[socket.handshake.session.room].incB7J1(-1);
                            break;
                    }
                    //console.log("y-1 : "+[x,y-1]);
                    tabBmb[l] = [x, y - 1];
                    l++;
                    games[socket.handshake.session.room].setCase(x, y - 1, 1, 2);
                }

                //console.log(tabBmb);
                socket.emit("bomb", tabBmb);

            } else {
                //alert("Bombe à fragment déjà utilisé");
                console.log("Bombe déjà utilisé");
                tabBmb = 1;
                socket.emit("radar", tabBmb);
            }
        }
    }

    function executeAttack(arme, coord){
      switch (arme) {
          case 1:
              missile(coord);
              break;
          case 2:
              torpille(coord);
              break;
          case 3:
              radar(coord);
              break;
          case 4:
              bombe(coord);
              break;
      };
    }

    socket.on("attack", (coord, arme) => {
        if (socket.handshake.session.player == 1 && games[socket.handshake.session.room].getCanPlayJ1()) {
          executeAttack(arme, coord)
        } else if(socket.handshake.session.player == 2 && games[socket.handshake.session.room].getCanPlayJ2()) {
          executeAttack(arme, coord)
        }

    })

    function finish(){
        
        if((games[socket.handshake.session.room].getB3J1() == 0) && (games[socket.handshake.session.room].getB4J1() == 0) && (games[socket.handshake.session.room].getB5J1() == 0) && (games[socket.handshake.session.room].getB6J1() == 0) && (games[socket.handshake.session.room].getB7J1() == 0)){
            return true;
        } else if ((games[socket.handshake.session.room].getB3J2() == 0) && (games[socket.handshake.session.room].getB4J2() == 0) && (games[socket.handshake.session.room].getB5J2() == 0) && (games[socket.handshake.session.room].getB6J2() == 0) && (games[socket.handshake.session.room].getB7J2() == 0)){
            return true;
        } else{
            return false;
        }
    }

    socket.on("tourFini", function (tabC) {


        if (socket.handshake.session.player == 1) {
            games[socket.handshake.session.room].setCanPlayJ1(false);
            games[socket.handshake.session.room].setCanPlayJ2(true);
            console.log("une atk vient d'être effectué par J1");
            io.emit('tour2',socket.handshake.session.username);

            socket.broadcast.emit('result', tabC);

        } else if (socket.handshake.session.player == 2) {
            games[socket.handshake.session.room].setCanPlayJ2(false);
            games[socket.handshake.session.room].setCanPlayJ1(true);
            console.log("une atk vient d'être effectué par J2");
            io.emit('tour1',socket.handshake.session.username);

            socket.broadcast.emit('result', tabC);
        }

        // Mettre faire la défense de celui à qui ce n'était pas le tour

        //Lancer fonction isfinish pour voir si la partie est terminé
        if(finish()){
            console.log("partie finie");
            io.emit("gameFinish");
        }
    })

    socket.on("canPlay", function () {

        if (socket.handshake.session.player == 1) {
            socket.emit("rep", games[socket.handshake.session.room].getCanPlayJ1());
        } else if (socket.handshake.session.player == 2) {
            socket.emit("rep", games[socket.handshake.session.room].getCanPlayJ2());
        }

    })

    /****************************************************************************/

});

/**
 * Rejoindre la salle d'attente
 */
function joinWaitingPlayers() {
    var players = getClientsInRoom('waitingRoom');

    if (players.length >= 1) {
        // Deux joueurs en attente -> créer un nouveau jeu
        var game = new Game(players[0].id, players[1].id);

        // Créez une nouvelle salle pour ce jeu
        players[0].leave('waitingRoom');
        players[1].leave('waitingRoom');
        players[0].join('game' + game.id);
        players[1].join('game' + game.id);

        users[players[0].id].player = 0;
        users[players[1].id].player = 1;
        users[players[0].id].inGame = game;
        users[players[1].id].inGame = game;

        io.to('game' + game.id).emit('join', game.id);

        // Mettre en place le jeu
        io.to(players[0].id).emit('update', game.getGameState(0, 0));
        io.to(players[1].id).emit('update', game.getGameState(1, 1));

        console.log((players[0].username + " and " + players[1].username + " have joined game ID " + game.id));
    };
};


/**
 * Trouver tous les sockets dans une salle
 * @param {type} room
 * @returns {Array}
 */
function getClientsInRoom(room) {
    var clients = [];
    for (var id in io.sockets.adapter.rooms[room]) {
        clients.push(io.sockets.adapter.nsp.connected[id]);
    }
    return clients;
}

/**
 * Si l'utilisateur quitte le jeu
 * @param {type} socket
 */
function leaveGame(socket) {
    if (users[socket.id].inGame !== null) {
        console.log((socket.handshake.session.username + ' left game ' + socket.handshake.session.room));

        // Notifier les joueurs
        socket.broadcast.to('game' + socket.handshake.session.room).emit('notification', {
            message: 'Opponent has left the game'
        });

        if (users[socket.id].inGame.gameStatus !== GameStatus.gameOver) {
            // Le jeu n'est pas terminé, annulez.
            users[socket.id].inGame.abortGame(users[socket.id].player);
            checkGameOver(users[socket.id].inGame);
        };

        socket.leave('game' + socket.handshake.session.room);

        users[socket.id].inGame = null;
        users[socket.id].player = null;

        io.to(socket.id).emit('leave');
    };
};

/**
 * Avertir le joueur quand le jeu est terminé.
 * @param {type} game
 */
function checkGameOver(game) {
    if (game.gameStatus === GameStatus.gameOver) {
        console.log(' Game ID ' + game.id + ' ended.');
        io.to(game.getWinnerId()).emit('gameover', true);
        io.to(game.getLoserId()).emit('gameover', false);
    };
};


app.post('/signin', body('login').isLength({ min: 3 }).trim().escape(), (req, res) => {
    const login = req.body.login
    // Error management
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw errors;
    }

    else {
        // Store login
        req.session.username = login;
        req.session.ready = undefined;
        req.session.save()
        res.redirect('/');
        console.log(login + ' connected.');
    }

});
