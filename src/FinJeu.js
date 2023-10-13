//Utiliser un mode strict
"use strict";

//Création ou récupération de l'espace de nom pour le jeu : CasseBrique
var CasseBrique = CasseBrique || {};

/**
 * Classe permettant de définir l'écran (state)
 * pour la fin du jeu
 */

CasseBrique.FinJeu = function () {
    //Le son se joue si les 4 niveaux ont été complétés
    this.sonVictoire = null;

    //sinon, ce son va jouer
    this.sonDefaite = null;
};

CasseBrique.FinJeu.prototype = {
	create: function(){
        this.add.image(0,0,"finImg");
            
		//Vérification d'un meilleur score antérieur enregistré
        CasseBrique.meilleurScore = localStorage.getItem(CasseBrique.NOM_LOCAL_STORAGE_SCORE) === null ? 0 : localStorage.getItem(CasseBrique.NOM_LOCAL_STORAGE_SCORE);
            
        CasseBrique. meilleurScore = Math.max(CasseBrique.score, CasseBrique.meilleurScore);

        //Si les 5 niveaux sont complétés, on affiche un écran de fin de félicitation qui affiche le score, le meilleur score, le temps et le meilleur temps
        if(CasseBrique.nbNiveau > 5){
            // Le meilleur temps se sauvegarde seulement si la partie est gagnée
            CasseBrique.meilleurTemps = localStorage.getItem(CasseBrique.NOM_LOCAL_STORAGE_TEMPS) == null ? 0 : localStorage.getItem(CasseBrique.NOM_LOCAL_STORAGE_TEMPS);
            //console.log(nbNiveau);

            //Vérification et enregistrement du meilleur temps
            CasseBrique.meilleurTemps = Math.max(CasseBrique.tempsJeu, CasseBrique.meilleurTemps);
            localStorage.setItem(CasseBrique.NOM_LOCAL_STORAGE_TEMPS, CasseBrique.meilleurTemps);

            var leTitre = "Congratulations !!\n";

            var annonce = "You have completed all 5 levels! Amazing!\n";

            var leScore = "Your score: "+ CasseBrique.score;
            var leTemps = "Time: "+ CasseBrique.tempsJeu + "s";
            var leMeilleurScore = "Highest score: "+ CasseBrique.meilleurScore;
            var leMeilleurTemps = "Best time: "+ CasseBrique.meilleurTemps + " seconds";

            //Des applaudissements retentissent
            this.sonVictoire = this.add.audio("sonApplaudissement",1).play();
        }
        //sinon, un écran de fin d'encouragement qui affiche seulement le score et le meilleur score
        else{
            var leTitre = "You failed";

            annonce = "You lost all your balls at level "+ CasseBrique.nbNiveau +" . Try again !";
    			
    		var leScore = "Your score: "+ CasseBrique.score;
            var leMeilleurScore = "Highest score: "+ CasseBrique.meilleurScore;
            //Une musique triste se met à jouer
            this.sonDefaite = this.add.audio("sonMusicTriste",1).play();
        }

        //Le style pour le titre
        var styleTitre = {font: "bold 60px Arial", fill: "#FFFFFF", align: "center"};
        var titreTxt = this.add.text(this.game.width / 2, 10, leTitre, styleTitre);
        titreTxt.anchor.set(0.5,0);
        //Le style de l'annonce qui félicite le joueur si il a complété le jeu ou lui indique à quel niveau il a échoué
        var styleAnnonce = {font: "bold 38px ARIAL", fill: "#FFFFFF", align: "center"};
        var annonceTxt = this.add.text(this.game.width / 2, this.game.height*0.30, annonce, styleAnnonce);
        annonceTxt.anchor.set(0.5,1);
        //Le style pour leTexte
        var styleScoreEtTemps = {font: "bold 30px ARIAL", fill: "#FFFFFF", align: "center"};

        if(this.game.device.desktop){
            // Les textes qui affichent le temps, le score, le meilleur temps et le meilleur score sont animés, et arrivent l'un aprés l'autre 
            var tempsTxt = this.add.text(-180, this.game.height*0.40, leTemps, styleScoreEtTemps);
            this.add.tween(tempsTxt).to({x:this.game.width/2, y:tempsTxt.y}, 2000, Phaser.Easing.Exponential.InOut, true, 250, 0, false); 

            var scoreTxt = this.add.text(-180, this.game.height*0.50, leScore, styleScoreEtTemps);
            this.add.tween(scoreTxt).to({x:this.game.width/2, y:scoreTxt.y}, 2000, Phaser.Easing.Exponential.InOut, true, 0, 0, false);

            var meilleurTempsTxt = this.add.text(-180, this.game.height*0.60, leMeilleurTemps, styleScoreEtTemps);
            this.add.tween(meilleurTempsTxt).to({x:this.game.width/2, y:meilleurTempsTxt.y}, 2000, Phaser.Easing.Exponential.InOut, true, 750, 0, false); 

            var meilleurScoreTxt = this.add.text(-180, this.game.height*0.70, leMeilleurScore, styleScoreEtTemps);
            this.add.tween(meilleurScoreTxt).to({x:this.game.width/2, y:meilleurScoreTxt.y}, 2000, Phaser.Easing.Exponential.InOut, true, 500, 0, false);

            //Bouton qui apparait par animation
            var boutonRejouer= this.add.button(this.game.width/2, this.game.height*1.1, "rejouerBtn",this.rejouer, this,1,0,2,0);
            this.add.tween(boutonRejouer).to({x:boutonRejouer.x, y:this.game.height*0.88}, 2000, Phaser.Easing.Exponential.InOut, true, 1250, 0, false);
        }else{

            // Les textes qui affichent le temps, le score, le meilleur temps et le meilleur score s'affichent pour les mobiles sans animations
            var tempsTxt = this.add.text(this.game.width/2, this.game.height*0.40, leTemps, styleScoreEtTemps); 

            var scoreTxt = this.add.text(this.game.width/2, this.game.height*0.50, leScore, styleScoreEtTemps);

            var meilleurTempsTxt = this.add.text(this.game.width/2, this.game.height*0.60, leMeilleurTemps, styleScoreEtTemps); 

            var meilleurScoreTxt = this.add.text(this.game.width/2, this.game.height*0.70, leMeilleurScore, styleScoreEtTemps);

            //Bouton qui apparait par animation
            var boutonRejouer= this.add.button(this.game.width/2, this.game.height*0.88, "rejouerBtn",this.rejouer, this,1,0,2,0);
        }

        tempsTxt.anchor.set(0.5);
        scoreTxt.anchor.set(0.5);
        meilleurTempsTxt.anchor.set(0.5);
        meilleurScoreTxt.anchor.set(0.5);
        boutonRejouer.anchor.set(0.5);

        //Vérification et enregistrement du meilleur score
        CasseBrique.meilleurScore = Math.max(CasseBrique.score, CasseBrique.meilleurScore);
        localStorage.setItem(CasseBrique.NOM_LOCAL_STORAGE_SCORE, CasseBrique.meilleurScore);
    },

    rejouer: function(){
        //Aller à l'écran de jeu
        this.game.state.start("Jeu");

        //Les sons sont stoppés pour ne pas continuer à jouer quand le joueur recommence une partie 
        if(CasseBrique.nbNiveau > 5){
            this.sonVictoire.stop();
        }else{
            this.sonDefaite.stop();
        }
                 
    } //Fin rejouer
}; //Fin CasseBrique.FinJeu.prototype
