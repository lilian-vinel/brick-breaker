//Utiliser un mode strict
"use strict";

//Création ou récupération de l'espace de nom pour le jeu : CasseBrique
var CasseBrique = CasseBrique || {};

/**
 * Classe permettant de définir l'écran (state)
 * pour les ajustements au démarrage du jeu
 */

CasseBrique.Demarrage = function () {};

CasseBrique.Demarrage.prototype = {
	init: function () {
	    //Ajuster l'échelle du jeu et le centrer dans l'écran
	    this.scale.pageAlignHorizontally = true;
	    this.scale.pageAlignVertically = true;
	    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

	    //Mode pour le plein écran
		this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

		//Si on est sur un appareil mobile iOS, on va "verrouiller" l'orientation en mode portrait
		//Ces commandes demeureront actives dans les autres écrans (state) du jeu
		if (this.game.device.iOS) {
			Ecran.verrouillerEcran(Ecran.PAYSAGE);
		}

		//on limite le nombre de points tactiles ou de contact à 1
        this.input.maxPointers = 1;
	},

	preload : function () {
	    //Chargement des images pour la barre de chargement
		//URL commun à toutes les images
		this.load.path = "medias/img/";
	    this.load.image("barreChargementImg", "barreChargement.png");
	    this.load.image("limiteImg", "barreLimite.png");
	},

	create: function () {
		//Quand les ajustements sont faits - on charge les médias
	    this.game.state.start("ChargementMedias");
	}
}; //Fin CasseBrique.Demarrage