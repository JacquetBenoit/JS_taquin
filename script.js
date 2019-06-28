// mouvements possibles
const HAUT = "H";
const BAS = "B";
const DROITE = "D";
const GAUCHE = "G";

// nombre de cases par côté
let side = 4;

// On utilise turn pour créer notre condition de victoire
let turn = 0;
let soluce = [];
let oldMouv;
let rightMove;
let leftMove;
let topMove;
let botMove;
// changement de style css en fonction de "side"
document.documentElement.style.setProperty("--side", side);


// retient l'état courant du taquin
let current_state = [];
let winning_state = [];

// position de la case vide
const empty_cell = {i: 0, j: 0};

// Initialisation de l'état courant


function setInitState() {
    current_state = [];     // on vide le tableau
    let l = side;           // l = nombre de cases par côté
    for (let i = 0; i < l; i++) {
        current_state[i] = [];
        for (let j = 0; j < l; j++) {
            if (i === l - 1 && j === l - 1) {
                val = 0;
            } else {
                val = i * l + j + 1;
            }
            current_state[i][j] = val;

        }
    }
    if (turn === 0) {
        for (let i = 0; i < current_state.length; i++) {
            winning_state[i] = current_state[i].slice(0); // On copie le tableau pour la methode checkWin
        }
        turn++;
    }

    console.log(" WIN " + winning_state)

    empty_cell.i = side - 1;
    empty_cell.j = side - 1;
}

// Methode d'affichage pour le visuel
function displayState(tab) {
    $(".grid").empty();
    for (let i = 0; i < tab.length; i++) {
        for (let j = 0; j < tab[i].length; j++) {
            const elem = tab[i][j];
            if (elem) {
                const item = $(`<div data-i="${i}" data-j="${j}" class="item" id="${elem}">${elem}</div>`);
                $(".grid").append(item);
            } else {
                if (leftMove == 1) {
                    $(".grid").append(`<div class="vide" id = "caseVide""><img src="images/car.png" alt="car" id="car"></div>`);
                    leftMove = 0
                } else if (rightMove == 1) {
                    $(".grid").append(`<div class="vide" id = "caseVide""><img src="images/carRight.png" alt="car" id="car"></div>`);
                    rightMove = 0
                } else {
                    $(".grid").append(`<div class="vide" id = "caseVide""><img src="images/car.png" alt="car" id="car"></div>`);

                }
            }

        }
    }
}

// Au clique sur "Check" on verifie si les positions sont bonnes
$(".check").click(function () {
    console.log("Is winning? ", checkWin());
    if (checkWin()) {
        displayWin();
    }
});


$(".reset").click(reset);

$(".shuffle").click(function () {
    // pas le temps de faire le shuffle
    doRandomShuffle(current_state, empty_cell);
    displayState(current_state);
});

$(".solution").click(function () {
    console.log("Solution demandée par l'utilisateur·ice")
    findSolution(current_state, empty_cell);
});


// Pour augmenter / diminuer la taille d'un côté.
$(".plus").click(function () {
    turn = 0
    document.documentElement.style.setProperty("--side", ++side);
    reset();
    console.log("Plus grand")
});

$(".minus").click(function () {
    turn = 0
    document.documentElement.style.setProperty("--side", --side);
    reset();
    console.log("Plus petit")
});


// Ici on gere l'ajout dynamique de .item
$(".grid").on('click', '.item', function () {
    console.log("J'existe et resisterai à ma mort dans un reset/ shuffle ",
        "Valeur:", $(this).html(),
        "Position i:", $(this).attr("data-i"),
        "Position j:", $(this).attr("data-j"),
        $(this).attr("id")
    )
});

// Avec le code ci-dessous, j'ai des problèmes à chaque reset car les item sont
// supprimés.
// Pas de gestion dynamique de .item
// $(".item").click(function(){
//   console.log("Je n'existe que jusqu'à ma mort dans un reset/ shuffle")
//


// Une jolie fenetre est prévue pour quand on gagne
var modal = document.getElementById("myModal");

// Pour fermer la fenetre avec un "X"
var span = document.getElementsByClassName("close")[0];

// Pour afficher la fenetre quand on a gagné, appeler cette fonction
function displayWin() {
    modal.style.display = "block";
    setTimeout(function () {
        modal.style.display = "none"
    }, 5000)
}

// Quand on clique sur <span> (x), on ferme
span.onclick = function () {
    modal.style.display = "none";
}

// On ferme aussi si on clique n'importe où
window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

function findSolution() {
    // TODO : Optimisatoin des mouvements
    // let uselessMove = [];
    // console.log(soluce)
    // for (let i = 0  ; i < soluce.length  ; i++){
    //     if (soluce[i] == 37 && soluce[i +1] == 38 ){
    //         soluce[i] = 0
    //         soluce[i+1] = 0
    //     } else if (soluce[i] == 38 && soluce[i +1] == 37 ){
    //         soluce[i] = 0
    //         soluce[i+1] = 0
    //     } else if (soluce[i] == 39 && soluce[i +1] == 40 ){
    //         soluce[i] = 0
    //         soluce[i+1] = 0
    //     } else if (soluce[i] == 40 && soluce[i +1] == 39 ){
    //         soluce[i] = 0
    //         soluce[i+1] = 0
    //     } else {
    //         console.log("next")
    //     }
    // }
    // for (let i = 0; i < uselessMove.length; i++){
    //     soluce.splice(uselessMove[i], 2)
    // }


    soluce.reverse();
    console.log("nouvelle taille : " + soluce)
    for (let i = 0; i < soluce.length; i++) {
        setTimeout(function () {
            doSoluce(soluce[i])
        }, (1500))
    }
}

function sleep(millisecondsToWait) {
    let now = new Date().getTime();
    while (new Date().getTime() < now + millisecondsToWait) {
    }
}

// Pour récupérer l'appui sur les flèches du clavier
document.onkeydown = checkKey;

function checkKey(e) {
    soluce.push(e.keyCode)
    e = e || window.event;

    if (e.keyCode === 38) {
        // up arrow
        topMove = 1
        applyMove(current_state, empty_cell, HAUT);
    } else if (e.keyCode === 40) {
        // down arrow
        botMove = 1
        applyMove(current_state, empty_cell, BAS);
    } else if (e.keyCode === 37) {
        // left arrow
        leftMove = 1;
        applyMove(current_state, empty_cell, GAUCHE);
    } else if (e.keyCode === 39) {
        // right arrow
        rightMove = 1;
        applyMove(current_state, empty_cell, DROITE);
    }
    setTimeout(function () {
        displayState(current_state);
    }, 2000)
    if (checkWin()) {
        displayWin();
    }
}


function checkKeyShuffle(e) {
    if (empty_cell)
        soluce.push(e)
    if (e == 38) {
        // up arrow
        topMove = 1
        applyMove(current_state, empty_cell, HAUT);
    } else if (e == 40) {
        // down arrow
        botMove = 1
        applyMove(current_state, empty_cell, BAS);
    } else if (e == 37) {
        // left arrow
        leftMove = 1
        applyMove(current_state, empty_cell, GAUCHE);
    } else if (e == 39) {
        // right arrow
        rightMove = 1
        applyMove(current_state, empty_cell, DROITE);
    }
    displayState(current_state);
}


function doRandomShuffle() {
    let x = 25 * side;
    let y = 40 * side;
    soluce = []
    for (let i = 0; i < getRandomInt(x, y); i++) {
        let x = getRandomInt(37, 41)
        checkKeyShuffle(x)
        oldMouv = x;
    }
    console.log(soluce)
}


function movePos(futurPos, ec) {
    if (futurPos.i < current_state.length && futurPos.j < current_state.length
        && futurPos.i >= 0 && futurPos.j >= 0) { // On verifie si toute les conditions sont vraies
        let oldValue = current_state[futurPos.i][futurPos.j] // On garde notre place precisement dans le tableau
        current_state[futurPos.i][futurPos.j] = 0 // Puis on la modifie et on la passe à zero pour quelle devienne vide visuellement
        current_state[ec.i][ec.j] = oldValue // l'ancienne position prend la valeur de la futur visuellement
        ec.i = futurPos.i;
        ec.j = futurPos.j; // On redefinie la case vide avec sa nouvelle position
        if (topMove == 1){
            document.getElementById("caseVide").className = "vide animateTop"
            document.getElementById(oldValue).className = "item animateBot"
            topMove = 0
        } else if (botMove == 1){
            document.getElementById("caseVide").className = "vide animateBot"
            document.getElementById(oldValue).className = "item animateTop"
            botMove = 0

        } else if (rightMove == 1){
            document.getElementById(oldValue).className = "item animateRight"
            document.getElementById("caseVide").className = "vide animateLeft"
            document.getElementById("caseVide").setAttribute('src', 'images/carRight.png')
        } else if (leftMove == 1) {
            document.getElementById(oldValue).className = "item animateLeft"
            document.getElementById("caseVide").className = "vide animateRight"

        }

    } else {
        soluce.pop()
    }
}


function doSoluce(e) {
    sleep(400)
    console.log(soluce.length)
    if (e == 38) {
        // up arrow
        botMove = 1
        applyMove(current_state, empty_cell, BAS);
    } else if (e == 40) {
        // down arrow
        topMove = 1
        applyMove(current_state, empty_cell, HAUT);
    } else if (e == 37) {
        // left arrow
        rightMove = 1;
        applyMove(current_state, empty_cell, DROITE);
    } else if (e == 39) {
        // right arrow
        leftMove = 1
        applyMove(current_state, empty_cell, GAUCHE);
    }
    displayState(current_state);
}


// On renvoie un nombre aléatoire entre une valeur min (incluse)
// et une valeur max (exclue)
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}


function applyMove(state, ec, move) {
    let futurPos = {i: ec.i, j: ec.j} // On garde notre position pour les prochaines verifs et avant de modifier notre position actuelle
    switch (move) {
        case HAUT :
            futurPos.i--;
            movePos(futurPos, ec)
            break
        case BAS :
            futurPos.i++;
            movePos(futurPos, ec)
            break
        case DROITE :
            futurPos.j++;
            movePos(futurPos, ec)
            break
        case GAUCHE :
            futurPos.j--;
            movePos(futurPos, ec)
            break

    }
}


function checkWin() {
    for (let i = 0; i < current_state.length; i++) {
        for (let j = 0; j < current_state[i].length; j++) {  // On verifie chaque case et on les compare
            if (current_state[i][j] !== winning_state[i][j]) {
                return false // Si au moins une case est fausse la victoire est fausse
            }
        }
    }
    return true;
}


function reset() {

    setInitState();
    displayState(current_state);
}

// Affichage initial : on fait un reset
reset();
let test = [
    37,
    38,
    37,
    39,
    40,
    37,
    38,
    40,
    37,
]

