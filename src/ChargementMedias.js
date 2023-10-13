//Utiliser un mode strict
"use strict";

//Création ou récupération de l'espace de nom pour le jeu : CasseBrique
var CasseBrique = CasseBrique || {};

/**
 * Classe permettant de définir l'écran (state)
 * pour le chargement des médias
 */

CasseBrique.ChargementMedias = function () {};

CasseBrique.ChargementMedias.prototype = {
		init : function () {
			//Dessiner une rondelle      
			var leGraphique = this.make.graphics(0, 0);
			leGraphique.lineStyle(15, 0xFE9102);
			leGraphique.arc(64,64, 64, 0, this.math.degToRad(320));

            this.rondelle = this.add.sprite(this.game.width/2, this.game.height/4, leGraphique.generateTexture());

			this.rondelle.anchor.set(0.5);

			//Créer et afficher le texte
			this.pourcentTxt = this.add.text(this.game.width/2, this.game.height/2, "0 %", {font: "bold 64px Arial",fill: "#FE9102",align: "center"});
			this.pourcentTxt.anchor.set(0.5, -1);        
		},
		
		
        preload : function(){
            //Chargement des images
			
			//URL commun à toutes les images
			this.load.path = "medias/img/";
			
			//Chargement des images pour les écrans d'intro et de fin du jeu
			this.load.spritesheet("pleinEcranBtn", "bouton-pleinEcran.png", 50, 50);
            this.load.image("introImg", "introJeu.jpg", 960, 640);
            this.load.spritesheet("jouerBtn", "bouton-jouer.png", 360, 80);
            this.load.spritesheet("rejouerBtn", "bouton-rejouer.png", 465, 80);
            this.load.image("fenetreInstructions", "FenetreInstructions.jpg", 800, 560)
            this.load.image("finImg", "finJeu.jpg", 960, 640);
		
            //Chargement des feuilles de sprites pour les éléments du jeu
            this.load.image("arrierePlanImg", "arriere-plan-Jeu.jpg");
            this.load.image("barreImg", "barre.png", 121, 23);
            this.load.spritesheet("briquesImg", "briques-spriteSheet.png", 46, 20);
            this.load.spritesheet("balleImg", "balle_spriteSheet.png", 16, 16); 

            //Chargement des sons du jeu
			this.load.path = "medias/sons/";
            this.load.audio("sonMenu", ["menu.mp3", "menu.ogg"]);
            this.load.audio("sonApplaudissement", ["Applaudissement.mp3", "Applaudissement.ogg"]);
            this.load.audio("sonJeu1", ["musicJeu1.mp3", "musicJeu1.ogg"]);
            this.load.audio("sonJeu2", ["musicJeu2.mp3", "musicJeu2.ogg"]);
            this.load.audio("sonJeu3", ["musicJeu3.mp3", "musicJeu3.ogg"]);
            this.load.audio("sonJeu4", ["musicJeu4.mp3", "musicJeu4.ogg"]);
            this.load.audio("sonJeu5", ["musicJeu5.mp3", "musicJeu5.ogg"]);
            this.load.audio("sonJeu6", ["musicJeu6.mp3", "musicJeu6.ogg"]);
            this.load.audio("sonMusicTriste", ["musicTriste.mp3", "musicTriste.ogg"]);
            this.load.audio("sonCollisionBrique", ["briqueCasse.mp3", "briqueCasse.ogg"]);

			
		    //Afficher les images de la barre de chargement
			var barreChargementLimite = this.add.sprite(0, this.game.height/ 2, "limiteImg");
            barreChargementLimite.anchor.setTo(0, 0.5);
            barreChargementLimite.x = (this.game.width - barreChargementLimite.width)/2;
			
			var barreChargement = this.add.sprite(0, this.game.height/ 2, "barreChargementImg");
            barreChargement.anchor.setTo(0, 0.5);
            barreChargement.x = (this.game.width - barreChargement.width)/ 2;
			this.load.setPreloadSprite(barreChargement);

			//Afficher le pourcentage chargé après le chargement de chaque média
    		this.load.onFileComplete.add(this.afficherPourcentage, this);

        },
		
		/**
		* Pour afficher le pourcentage de téléchargement des médias
		* @param {Integer} progression Chiffre compris entre 1 et 100 (inclusivement) et représente le    pourcentage du chargement réalisé.
		*/		
		afficherPourcentage: function(progression){
	        this.pourcentTxt.text = progression + " %";
		}, 

		loadUpdate: function(){
			//console.log("loadUpdate");
	        this.rondelle.angle += 2;
		}, 

        create: function(){
            //Quand le chargement des actifs est complété - on affiche l'écran du jeu
            this.game.state.start("IntroJeu");
        }
    }; // Fin CasseBrique.ChargementMedias