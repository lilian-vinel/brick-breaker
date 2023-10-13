//Utiliser un mode strict
"use strict";

//Création ou récupération de l'espace de nom pour le jeu : CasseBrique
var CasseBrique = CasseBrique || {};

//Propriétés et/ou constantes pour le jeu
CasseBrique = {
    //Constantes et variables du jeu
	NOM_LOCAL_STORAGE_SCORE: "scoreCasseBrique", //Sauvegarde et enregistrement du meilleur score 
    NOM_LOCAL_STORAGE_TEMPS: "tempsCasseBrique", //Sauvegarde et enregistrement du meilleur temps
	
	//Variables pour le jeu 
    score: 0, // Le score du jeu
    tempsJeu: 0,// Le temps écoulé depuis le lancement de la partie
    nbNiveau: 0,// Le numero du niveau que le joueur commence
    meilleurScore: 0, //Meilleur score antérieur enregistré
    meilleurTemps: 0, //Meilleur temps antérieur enregistré
};

//On crééra le jeu quand la page HTML sera chargée
window.addEventListener("load", function (pEvt) {
	//Création du jeu
	var leJeu = new Phaser.Game(960, 640, Phaser.CANVAS);

	//Ajout des états du jeu
	leJeu.state.add("Demarrage", CasseBrique.Demarrage);
	leJeu.state.add("ChargementMedias", CasseBrique.ChargementMedias);
	leJeu.state.add("IntroJeu", CasseBrique.IntroJeu);
	leJeu.state.add("Jeu", CasseBrique.Jeu);
	leJeu.state.add("FinJeu", CasseBrique.FinJeu);

	//Vérification d'un meilleur score antérieur enregistré
	CasseBrique.meilleurScore = localStorage.getItem(CasseBrique.NOM_LOCAL_STORAGE) === null ? 0 : localStorage.getItem(CasseBrique.NOM_LOCAL_STORAGE);

	//Vérification d'un meilleur temps antérieur enregistré
	CasseBrique.meilleurTemps = localStorage.getItem(CasseBrique.NOM_LOCAL_STORAGE_TEMPS) == null ? 0 : localStorage.getItem(CasseBrique.NOM_LOCAL_STORAGE_TEMPS);

	//Définir l'écran au démarrage
	leJeu.state.start("Demarrage");

}, false);