// mouvements possibles
const HAUT = "H";
const BAS = "B";
const DROITE = "D";
const GAUCHE = "G";

// nombre de cases par côté
let side = 3;

// On utilise turn pour créer notre condition de victoire
let turn = 0;

// changement de style css en fonction de "side"
document.documentElement.style.setProperty("--side", side);


// retient l'état courant du taquin
let current_state = [];
let winning_state = [];

let solution = [];

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
                $(".grid").append(`<div class="vide""></div>`);
            }

        }
    }

    console.log("current state : " + current_state);
}

// Au clique sur "Check" on verifie si les positions sont bonnes
$(".check").click(function () {
    console.log("Is winning? ", checkWin(current_state, winning_state));
    if (checkWin(current_state, winning_state)) {
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
    findSolution();
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


// Pour récupérer l'appui sur les flèches du clavier
document.onkeydown = checkKey;

function checkKey(e) {
    solution.push(e.keyCode)
    e = e || window.event;

    if (e.keyCode === 38) {
        // up arrow
        applyMove(current_state, empty_cell, HAUT);
    } else if (e.keyCode === 40) {
        // down arrow
        applyMove(current_state, empty_cell, BAS);
    } else if (e.keyCode === 37) {
        // left arrow
        applyMove(current_state, empty_cell, GAUCHE);
    } else if (e.keyCode === 39) {
        // right arrow
        applyMove(current_state, empty_cell, DROITE);
    }
    displayState(current_state);
    if (checkWin(current_state, winning_state)) {
        displayWin();
    }
        // console.log(solution);
    
}

function checkKeyShuffle(e) {
    solution.push(e);
    if (e == 38) {
        // up arrow
        applyMove(current_state, empty_cell, HAUT);
    } else if (e == 40) {
        // down arrow
        applyMove(current_state, empty_cell, BAS);
    } else if (e == 37) {
        // left arrow
        applyMove(current_state, empty_cell, GAUCHE);
    } else if (e == 39) {
        // right arrow
        applyMove(current_state, empty_cell, DROITE);
    }
    displayState(current_state);
    console.log("soluce = " + solution);
}

function distributeSolution(t) {
    sleep(400);
        if (t == 38) {
            // up arrow
            applyMoveSoluce(current_state, empty_cell, BAS);
        } else if (t == 40) {
            // down arrow
            applyMoveSoluce(current_state, empty_cell, HAUT);
        } else if (t == 37) {
            // left arrow
            applyMoveSoluce(current_state, empty_cell, DROITE);
        } else if (t == 39) {
            // right arrow
            applyMoveSoluce(current_state, empty_cell, GAUCHE);
        }
        console.log('t = ' + t)
        displayState(current_state)
}

function doRandomShuffle() {
    for (let i = 0; i < getRandomInt(40, 150); i++) {
        checkKeyShuffle(getRandomInt(37, 41))
    }
}

function sleep(millisecondsToWait) {
    let now = new Date().getTime();
    while (new Date().getTime() < now + millisecondsToWait) {
    }
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
    console.log('move = ' , move);
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


function checkWin(current_state, winning_state) {
    for (let i = 0; i < current_state.length; i++) {
        for (let j = 0; j < current_state[i].length; j++) {  // On verifie chaque case et on les compare
            if (current_state[i][j] !== winning_state[i][j]) {
                return false // Si au moins une case est fausse la victoire est fausse
            }
        }
    }
    return true;
}

function movePos(futurPos, ec) {
    if (futurPos.i < current_state.length && futurPos.j < current_state.length
        && futurPos.i >= 0 && futurPos.j >= 0) { // On verifie si toute les conditions sont vraies
        let oldValue = current_state[futurPos.i][futurPos.j] // On garde notre place precisement dans le tableau
        current_state[futurPos.i][futurPos.j] = 0 // Puis on la modifie et on la passe à zero pour quelle devienne vide visuellement
        current_state[ec.i][ec.j] = oldValue // l'ancienne position prend la valeur de la futur visuellement
        ec.i = futurPos.i;
        ec.j = futurPos.j; // On redefinie la case vide avec sa nouvelle position
    } else {
        solution.pop();
    }
}

function applyMoveSoluce(state, ec, move) {
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


function findSolution() {
    solution.reverse();
    for(let i = 0; i < solution.length; i++){
        setTimeout(() => {
            distributeSolution(solution[i]);
        }, 500);
        
    }
    
}

function reset() {
    setInitState();
    displayState(current_state);
}

function BFS(source){
 
 let vertex = function(position, moove) {
     this.position = position,
     this.moove = moove
 }   

 let frontier = [];
 frontier.push(source);
 let known = [];
    
    while (frontier.length > 0){
        let next = [];
        frontier.forEach((x)=>{
            if(checkWin(x, winning_state)){
                return true
            } else {
                known.push(x);
            }
        })
    }
}

// Affichage initial : on fait un reset
reset();
