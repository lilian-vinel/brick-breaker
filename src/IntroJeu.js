//Utiliser un mode strict
"use strict";

//Création ou récupération de l'espace de nom pour le jeu : CasseBrique
var CasseBrique = CasseBrique || {};

/**
 * Classe permettant de définir l'écran (state)
 * pour la scène de l'intro du jeu
 */

CasseBrique.IntroJeu = function () {};

CasseBrique.IntroJeu.prototype = {

	create: function(){
        //Image d'intro
        this.add.image(0,0, "introImg");
            
        //Son d'intro
        this.sonMenu = this.add.audio("sonMenu",.90);
        this.sonMenu.loop = true;
        this.sonMenu.play();

        //Bouton
        var boutonJouer= this.add.button(this.game.width/2, this.game.height*0.85, "jouerBtn",this.afficherInstructions, this,1,0,2,0);
        boutonJouer.anchor.set(0.5);
    },

    //Fait apparaître l'écran d'instructions
    afficherInstructions: function(){
        this.add.button(80, 50, "fenetreInstructions",this.allerEcranJeu, this);
    },

    //arrête le son d'intro et lance le jeu
    allerEcranJeu: function(){
        //Démarrer l'écran du jeu
        this.game.state.start("Jeu");
        //arrête le son d'intro
        this.sonMenu.stop();
    }
}; //Fin CasseBrique.IntroJeu.prototype