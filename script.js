// ============================================================
// VARIABLES — état du jeu
// ============================================================

let nom = 0; // nombre de joueurs (entré par l'utilisateur)
let joueurs = []; // tableau des noms des joueurs
let chambre = [1, 2, 3, 4, 5, 6]; // les 6 chambres du barillet
let joueurActuel = 0; // index du joueur qui tire en ce moment
let regle = "";
let premierTour = true;
let nomVoyant = "";
let voyantActif = false;
let nombreTentatives = 0;
let touches = [];
let sens = 1;
let timerInterval
let compteurTimer = 0;
let dureeInitiale = 0
let sonClic = new Audio("sound/clic.wav");
let sonTir = new Audio("sound/tir.mp3");
let sonReload = new Audio("sound/reload.wav");
let effet = [
  { nom: "Bombe Nucléaire", description: "Tout le monde boit 3 gorgées.", icone: "fa-solid fa-bomb" },
  { nom: "Fusil à pompe", description: "Le joueur touché boit 4 gorgées.", icone: "fa-solid fa-mars-double" },
  { nom: "dé", description: "Le joueur distribue autant de gorgées que le dé affiche, à qui il veut.", icone: "fa-solid fa-dice" },
  { nom: "pile ou face", description: "Le joueur choisit pile ou face. S'il perd il boit 3 gorgées, s'il gagne il en distribue 3.", icone: "fa-solid fa-coins" },
  { nom: "Le retraité", description: "Le joueur le plus âgé distribue 3 gorgées à qui il veut.", icone: "fa-solid fa-person-cane" },
  { nom: "La recrue", description: "Le joueur le plus jeune boit 2 gorgées avec toi.", icone: "fa-solid fa-person-cane" },
  { nom: "Le flic", description: "Les joueurs les plus bronzés boivent 2 gorgées avec toi.", icone: "fa-solid fa-handcuffs" },
  { nom: "La gâchette", description: "Le joueur le plus gay boit 2 gorgées avec toi.", icone: "fa-solid fa-rainbow" },
  { nom: "Katana", description: "S'il y a un asiatique dans la partie, il boit 2 gorgées avec toi. Sinon tu bois seul.", icone: "fa-solid fa-dog" },
  { nom: "Le colon", description: "S'il y a un blanc dans la partie, il boit 2 gorgées avec toi. Sinon tu bois seul.", icone: "fa-brands fa-jenkins" },
  { nom: "Le flashball", description: "Les minorités boivent 2 gorgées avec toi.", icone: "fa-solid fa-scale-unbalanced" },
  { nom: "Le tribunal", description: "Les autres joueurs te choisissent un gage. Si tu échoues, tu bois 3 gorgées.", icone: "fa-solid fa-gavel" },
  { nom: "Le sénat", description: "Votez haut ou bas, la minorité boit 2 gorgées.", icone: "fa-solid fa-thumbs-up" },
  { nom: "Les mains en l'air", description: "Le dernier à lever les mains boit 2 gorgées.", icone: "fa-solid fa-people-robbery" },
  { nom: "Le pacifique", description: "Embrasse ton voisin de gauche. Si tu refuses, tu bois 3 gorgées.", icone: "fa-solid fa-peace" },
  { nom: "Le jeu du thème", description: "Chaîne de mots sur un thème, le premier qui bloque boit 2 gorgées.", icone: "fa-solid fa-suitcase" },
  { nom: "Le voyant", description: "Parie à voix haute sur qui va être touché au prochain effet. Si t'as raison tu distribues 3 gorgées, sinon tu les bois.", icone: "fa-solid fa-eye" },
  { nom: "L'Arabe", description: "Insulte ton voisin de droite, trouve 5 insultes en 15 secondes, sinon tu bois 3 gorgées.", duree: 15, icone: "fa-solid fa-person-harassing" },
  { nom: "Le médecin", description: "Complimente ton voisin de gauche, trouve 5 compliments en 15 secondes, sinon tu bois 3 gorgées.", duree: 15, icone: "fa-solid fa-hand-holding-medical" },
  { nom: "Fou du roi", description: "Fais-nous rire en 20 secondes, sinon tu bois 3 gorgées.", duree: 20, icone: "fa-solid fa-face-grin-tongue-wink" },
  { nom: "Le cartographe", description: "Indique le nord, si tu te trompes tu bois 2 gorgées.", icone: "fa-solid fa-compass" },
  { nom: "Le miroiteur", description: "Imite quelqu'un en 20 secondes, si personne ne trouve tu bois 3 gorgées.", duree: 20, icone: "fa-solid fa-clone" },
  { nom: "Mr le président", description: "Crée une règle et sa punition, elle s'applique pour le reste de la partie.", icone: "fa-solid fa-crown" },
  { nom: "Zeimer", description: "Quelle était la dernière règle? Si tu te trompes tu bois 3 gorgées.", icone: "fa-solid fa-list" },
  { nom: "Garde du corps", description: "Croise les bras, tu peux les décroiser seulement pour boire, sinon tu bois 3 gorgées.", icone: "fa-solid fa-user-shield" },
  { nom: "L'imitateur", description: "Répète tout ce que dit ton voisin de droite, sinon tu bois 3 gorgées.", icone: "fa-solid fa-masks-theater" },
  { nom: "Le traducteur", description: "Tu dois parler avec un accent, sinon tu bois 3 gorgées.", icone: "fa-solid fa-language" },
  { nom: "Le transporteur", description: "La prochaine fois que tu dois boire, tu peux donner les gorgées à quelqu'un d'autre.", icone: "fa-solid fa-truck" },
  { nom: "Le protecteur", description: "Tu bois toutes les gorgées de ton voisin de droite.", icone: "fa-solid fa-shield-heart" },
  { nom: "Le tsunami", description: "Le sens du tour change. Tu bois la tasse au passage.", icone: "fa-solid fa-person-drowning" },
  { nom: "Le professeur", description: "Convaincs-nous pourquoi boire c'est cool en 30 secondes, sinon tu bois 3 gorgées.", duree: 30, icone: "fa-solid fa-person-chalkboard" },
  { nom: "Le maître du freeze", description: "Tu es le maître du freeze, le dernier à rester immobile boit 2 gorgées.", icone: "fa-solid fa-snowflake" },
];
let pile = [...effet]; // copie du tableau des effets pour éviter de le modifier directement
// ============================================================
// VALIDER — génère les champs de saisie selon le nombre de joueurs
// ============================================================

function valider() {
  nom = document.getElementById("nomJoueurs").value;
  if (nom == 0 || nom === "") {
    document.getElementById("erreur").textContent = "Veuillez entrer le nombre de joueurs !";
    return;
  }
  if (nom < 2 || nom > 6) {
    document.getElementById("erreur").textContent = "Le nombre de joueurs doit être entre 2 et 6 !";
    return;
}
  for (let i = 0; i < nom; i++) {
    document.getElementById("inputs").innerHTML +=
      "<input type='text' id='joueur" + i + "' placeholder='Nom du joueur " + (i + 1) + "'><br>";
  }
  document.getElementById("btnValider").disabled = true;
  document.getElementById("startGame").disabled = false;
}
// ============================================================
// START GAME — démarre la partie et affiche l'écran de jeu
// ============================================================

function startGame() {
  joueurs = []; // remet le tableau à vide avant de le remplir
for (let i = 0; i < nom; i++) {
    if (document.getElementById("joueur" + i).value === "") {
        document.getElementById("erreur").textContent = "Veuillez remplir tous les champs !";
        return;
    }
    joueurs.push(document.getElementById("joueur" + i).value);
    touches.push(0);
}
document.getElementById("btnOptions").style.display = "block";
  console.log("Joueurs inscrits : " + joueurs.join(", ")); // affiche les joueurs dans la console (debug)
  document.getElementById("jeu").style.display = "block"; // affiche l'écran de jeu
  document.getElementById("setup").style.display = "none"; // cache l'écran de configuration
  document.getElementById("message").innerHTML =
    "Le pistolet est chargé, c'est à <strong>" +
    joueurs[0] +
    "</strong> de tirer !"; // premier message
    sonReload.play()
}

// ============================================================
// TIRER — action principale du joueur
// ============================================================

function tirer() {
  clearInterval(timerInterval);
  document.getElementById("message").innerHTML = "";
  document.getElementById("carte").style.display = "none";
  nombreTentatives++;
  let index = Math.floor(Math.random() * chambre.length); // choisit un index aléatoire dans le tableau des chambres
  let position = chambre[index]; // lit la valeur de la chambre à cet index
  chambre.splice(index, 1); // retire cette chambre du barillet
  console.log(chambre.length); // affiche le nombre de chambres restantes (debug)

  if (position === 1) {
    touches[joueurActuel]++;
    console.log(touches)
    // la balle était là — le joueur boit
    premierTour = false;
    chambre = [1, 2, 3, 4, 5, 6]; // recharge le barillet
    document.getElementById("message").innerHTML =
      "BANG ! <strong>" + joueurs[joueurActuel] + "</strong> est touché ! ";
sonTir.currentTime = 0;
sonTir.play();
   if (tirerEffet()) return; // applique un effet spécial aléatoire
  } else {
    // chambre vide — le joueur est sauvé
    document.getElementById("message").innerHTML =
      "Click ! <strong>" + joueurs[joueurActuel] + "</strong> est sauvé.";
      sonClic.currentTime = 0;
sonClic.play();
  }
  joueurActuel = (joueurActuel + sens + joueurs.length) % joueurs.length; // passe au joueur suivant — revient à 0 après le dernier
  document.getElementById("message").innerHTML +=
    "<br>C'est à <strong>" + joueurs[joueurActuel] + "</strong> de tirer !"; // annonce le prochain joueur
    document.getElementById("info").innerHTML = "Chambres : " + chambre.length + "<br>Tentatives :" + nombreTentatives ;
}

function tirerEffet() {
  if (pile.length === 0) {
    document.getElementById("jeu").style.display = "none";
document.getElementById("fin").style.display = "block";
document.getElementById("btnOptions").style.display = "none";
document.getElementById("fin").innerHTML = "<h1> Partie terminée !</h1><p>Pariez 3 gorgées sur qui a été le plus touché !</p><button onclick='revelerStats()'>Révéler</button><div id='stats'></div>";
return true;
  }
  if (voyantActif === true) {
    document.getElementById("message").innerHTML +=
      "<br>Si <strong>" +
      nomVoyant +
      "</strong> avait parié sur le joueur touché, il distribue 3 gorgées. Sinon il les boit.";
    voyantActif = false;
  }
let index = Math.floor(Math.random() * pile.length);
let effetChoisi = pile[index];
if (premierTour && effetChoisi.nom === "Zeimer") {
    pile.push(effetChoisi);
    return tirerEffet();
}
pile.splice(index, 1);
document.getElementById("carte").style.display = "block";
document.getElementById("carteContenu").innerHTML = "<i class='" + effetChoisi.icone + "'></i><br><strong>" + effetChoisi.nom + "</strong><br>" + effetChoisi.description;
  if (effetChoisi.nom === "pile ou face") {
    document.getElementById("carteContenu").innerHTML += "<br><button onclick='lancerPileOuFace()'>🪙 Lancer</button><br><span id='pileouface'></span>";
    document.getElementById("tirer").disabled = true;
  }
if (effetChoisi.nom === "Mr le président") {
    document.getElementById("carteContenu").innerHTML +=
      "<br><input type='text' id='regle'><button id='btnRegle' onclick='validerRegle()'>Validez la règle</button>";
    document.getElementById("tirer").disabled = true;
}
if (
    effetChoisi.nom === "L'Arabe" ||
    effetChoisi.nom === "Le médecin" ||
    effetChoisi.nom === "Fou du roi" ||
    effetChoisi.nom === "Le miroiteur" ||
    effetChoisi.nom === "Le professeur"
  ) {
    document.getElementById("carteContenu").innerHTML +=
    "<br><button id='btnPret' onclick='jeSuisPret(" + effetChoisi.duree + ")'>Je suis prêt.</button>";
  }
  if (effetChoisi.nom === "Le voyant") {
    voyantActif = true;
    nomVoyant = joueurs[joueurActuel];
  }
  if (effetChoisi.nom === "Le tsunami") {
  sens *= -1;
  }
  if (effetChoisi.nom === "dé") {
document.getElementById("carteContenu").innerHTML += "<br><button onclick='lancerDe()'>🎲 Lancer le dé</button><br><span id='de'></span>";
document.getElementById("tirer").disabled = true;
  }
}


function validerRegle() {
  if (document.getElementById("regle").value === "") {
    document.getElementById("erreurJeu").textContent =
      "Veuillez remplir tous les champs !";
    return;
  }
  regle = document.getElementById("regle").value;
  pile.push({
    nom: "règle créée",
    description: regle,
    icone: "fa-solid fa-scroll"
  });
  document.getElementById("btnRegle").disabled = true;
  document.getElementById("carteContenu").innerHTML +=
    "<br><span style='color:green'>Règle enregistrée !</span>";
  document.getElementById("tirer").disabled = false;
  console.log(pile);
}

function jeSuisPret(duree) {
  dureeInitiale = duree
  document.getElementById("btnPret").disabled = true;
  compteurTimer = duree; // on commence à la durée de l'effet

 document.getElementById("carteContenu").innerHTML +=
    "<br><span id='timer'>" + compteurTimer + "</span> secondes<br><button id='btnStop' onclick='resetTimer()'> Reset</button>"
  timerInterval = setInterval(function () {
    compteurTimer--; // on enlève 1 chaque seconde
    document.getElementById("timer").textContent = compteurTimer;

    if (compteurTimer <= 0) {
      clearInterval(timerInterval); // on arrête le timer
      document.getElementById("timer").textContent = "TEMPS ÉCOULÉ !";
      document.getElementById("tirer").disabled = false;
    }
  }, 1000); // toutes les 1000ms = 1 seconde
  document.getElementById("tirer").disabled = true;
}

function recommencer() {
  nom = 0;
  joueurs = [];
  chambres = [1, 2, 3, 4, 5, 6];
  joueurActuel = 0;
  pile = [...effet];
  touches = []
  premierTour = true;
  document.getElementById("jeu").style.display = "none";
  document.getElementById("setup").style.display = "block";
  document.getElementById("inputs").innerHTML = "";
  document.getElementById("btnValider").disabled = false;
  document.getElementById("nomJoueurs").value = "";
  document.getElementById("stats").innerHTML = "";
  document.getElementById("fin").style.display = "none";
  document.getElementById("startGame").disabled = true;
}

function toggleMenu() {
  if (document.getElementById("menu").style.display === "none") {
    document.getElementById("menu").style.display = "block";
  } else {
    document.getElementById("menu").style.display = "none";
  }
}

function demarrer(){
      document.getElementById("avestissement").style.display = "none";
    document.getElementById("setup").style.display = "block";
        document.getElementById("btnOptions").style.display = "none";
}

function lancerDe() {
    let resultat = Math.floor(Math.random() * 6) + 1;
    let compteur = 0;
    document.getElementById("tirer").disabled = true;
    let interval = setInterval(function() {
        compteur += 100;
        document.getElementById("de").textContent = Math.floor(Math.random() * 6) + 1;
        if (compteur >= 1000) {
            clearInterval(interval);
            document.getElementById("de").textContent = resultat;
            document.getElementById("tirer").disabled = false;
        }
    }, 100);
}

function lancerPileOuFace() {
    let resultat = Math.random() < 0.5 ? "pile" : "face";
    let compteur = 0;
    let interval = setInterval(function() {
        compteur += 100;
        document.getElementById("pileouface").textContent = Math.random() < 0.5 ? "pile" : "face";
        if (compteur >= 1000) {
            clearInterval(interval);
            document.getElementById("pileouface").textContent = resultat;
            document.getElementById("tirer").disabled = false;
        }
    }, 100);
}

function reinitialiser() {
    document.getElementById("inputs").innerHTML = "";
    document.getElementById("btnValider").disabled = false;
    document.getElementById("startGame").disabled = true;
    document.getElementById("erreur").textContent = "";
}

function revelerStats() {
    for (let i = 0; i < joueurs.length; i++) {
        document.getElementById("stats").innerHTML += "<br>" + joueurs[i] + " touché " + touches[i];
    }
    document.getElementById("stats").innerHTML += "<br><button onclick='recommencer()'>Rejouer</button>";
    document.getElementById("stats").innerHTML += "<br><br><a href='https://ko-fi.com/theblacksheep471' target='_blank'><button>Offrez-moi une bière 🍺</button></a>";
}

function resetTimer() {
  console.log(dureeInitiale);
    clearInterval(timerInterval);
    compteurTimer = dureeInitiale;
    document.getElementById("timer").textContent = compteurTimer;
    timerInterval = setInterval(function() {
        if (!document.getElementById("timer")) {
            clearInterval(timerInterval);
            return;
        }
        compteurTimer--;
        document.getElementById("timer").textContent = compteurTimer;
        if (compteurTimer <= 0) {
            clearInterval(timerInterval);
            document.getElementById("timer").textContent = "TEMPS ÉCOULÉ !";
            document.getElementById("tirer").disabled = false;
        }
    }, 1000);
}

function reglerVolume(valeur) {
    sonClic.volume = valeur;
    sonTir.volume = valeur;
    sonReload.volume = valeur;
}