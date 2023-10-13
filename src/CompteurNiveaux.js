/**
 * Classe CompteurNiveaux
 * pour le cours 582-448-MA
 * @author Lilian Vinel
 * @version 2017-05-25
 */

(function () { //IFFE
	//Usage d'un mode strict
	"use strict";

	/**
	 * Crée une instance de CompteurNiveaux
	 * 
	 * @class CompteurNiveaux
	 * @extends Phaser.Text
	 * @constructor
	 * @param {Phaser.Game} leJeu	L'instance du jeu en cours
	 * @param {Number} posX			La position de l'instance sur l'axe des x
	 * @param {Number} posY			La position de l'instance sur l'axe des y
	 * @param {String} texte		Le texte à afficher
	 * @param {Object} style		Le style du texte à afficher
	 */
	function CompteurNiveaux(leJeu, posX, posY, texte, style) {
		//Appel du constructeur parent pour cet instance
		//Phaser.Text(game, x, y, texte, style)
        Phaser.Text.call(this, leJeu, posX, posY, texte, style);

		//Ajuster le point d'ancrage
		this.anchor.set(0.5, 1);

		//Mettre ce point dans l'affichage du jeu
        leJeu.add.existing(this);

		//Animer ce point
		this.animerTexte();
	};

	//Ajustements pour l'héritage
    CompteurNiveaux.prototype = Object.create(Phaser.Text.prototype);
    CompteurNiveaux.prototype.constructor = CompteurNiveaux;

	//Méthodes d'instance

	/**
	 * Anime l'instance et appel la fonction detruire texte à la fin de l'animation
	 */
	CompteurNiveaux.prototype.animerTexte = function () {

		//Animation qui affiche le texte
		var animPosition = this.game.add.tween(this).to({x:this.world.centerX, y:160}, 4000, Phaser.Easing.Exponential.InOut, true, 0, 0, true);

		//Quand l'animation est terminée, on détruit le texte
		animPosition.onComplete.add(this.detruireTexte, this);

	};

	/**
	 * Détruit l'instance quand son animation est terminée
	 */
	CompteurNiveaux.prototype.detruireTexte = function () {
        this.destroy();
	};

	//Rendre la classe publique
    window.CompteurNiveaux = CompteurNiveaux;

})(); //Fin IIFE
