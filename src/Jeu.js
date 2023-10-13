//Utiliser un mode strict
"use strict";

//Création ou récupération de l'espace de nom pour le jeu : CasseBrique
var CasseBrique = CasseBrique || {};

/**
 * Classe permettant de définir l'écran (state)
 * pour la scène du jeu
 */

CasseBrique.Jeu = function () {
	//La barre où la balle va rebondir
    this.barre = null;

    //Indique si la balle est lancée ou non
    this.balleSurBarre = null;

    //Le nombre de balles restantes
    this.ballesRestantes = null;
        
    //Le groupe physique pour la balle
    this.balle = null;

    //Le groupe physique pour les briques
    this.lesBriques = null;
        
    //Le texte pour afficher le score du jeu
    this.scoreTxt = null;

    //Tableau pour enregistrer les sons
    this.tableauSons = [];
};

CasseBrique.Jeu.prototype = {

	init:function(){
        //Initialiser le score
        CasseBrique.score = 0;
        this.ballesRestantes = 3;
        CasseBrique.tempsJeu = 0;
        CasseBrique.nbNiveau = 1;
        this.balleSurBarre = true;
    }, 
		
    create: function(){
        //Afficher l'arrière-plan
        this.add.image(0,0, "arrierePlanImg");

        //Enregistrer les sons du jeu
        this.tableauSons[0] = this.add.audio("sonJeu1", 1);
        this.tableauSons[1] = this.add.audio("sonJeu2", 1);
        this.tableauSons[2] = this.add.audio("sonJeu3", 1);
        this.tableauSons[3] = this.add.audio("sonJeu4", 1);
        this.tableauSons[4] = this.add.audio("sonJeu5", 1);
        this.tableauSons[5] = this.add.audio("sonJeu6", 1);

        //Le son en arrière-plan du jeu est choisi au hasard...
        this.choisirSonJeu();

        //Tous les éléments du jeu utilisent la physique... on va donc le préciser ici
        //Ajout de la physique pour l'ensemble du jeu
        this.physics.startSystem(Phaser.Physics.ARCADE);

        // La collision avec le bas du contour du jeu est désactivée
        this.physics.arcade.checkCollision.down = false;
        
        //Initialiser et afficher le score
        this.scoreTxt = this.add.text(50, this.game.height, 'Score: 0', { font: "15px Arial", fill: "#ffffff", align: "left" });
        this.scoreTxt.anchor.set(0.5, 1);

        //Initialiser et afficher le temps
        this.tempsTxt = this.add.text(20, 10, 'Temps: 0', { font: "15px Arial", fill: "#ffffff", align: "left" });

        //Initialiser et afficher le nombre de balles restantes
        this.ballesRestantesTxt = this.add.text(this.game.width - 75,this.game.height, 'Balls left : 3', { font: "15px Arial", fill: "#ffffff", align: "left" });
        this.ballesRestantesTxt.anchor.set(0.5, 1);

        //La barre          
        this.barre = this.add.sprite(this.world.centerX, 585, "barreImg");
        
        //Ajout de la physique pour notre barre
        this.physics.enable(this.barre, Phaser.Physics.ARCADE);
        this.barre.body.immovable = true;
        this.barre.anchor.setTo(0.5, 0);

        this.barre.inputEnabled = true;
        this.barre.input.useHandCursor = true;
        this.barre.input.enableDrag();
        //Limiter son déplacement à l'axe horizontal - Donc on empêche les mouvements à la verticale
        this.barre.input.allowVerticalDrag = false;

        //S'assurer que la barre ne sort pas entièrement des limites gauche et droite de l'écran lors du drag
        this.barre.events.onDragUpdate.add(this.verifierPositionBarre, this);

        //Créer les éléments du jeu et leurs animations
        this.creerBriques();
        this.creerBalle();

        var style = {
                font: "45px Calibri",
                fill: "#ffffff",
                align: "center"
            }
        //Instancier la classe CompteurNiveaux qui affiche le numéro du niveau 1
        this.compteurNiveaux = new CompteurNiveaux(this.game, this.world.centerX, 0, 'Level 1', style);

        //Placer le bouton pour le mode en plein écran - pour Android et desktop
        if (this.game.device.desktop || this.game.device.android) {

            var leBoutonPleinEcran = this.add.button(this.game.width - 5, 5, "pleinEcranBtn", this.gererPleinEcran, this);
            //Mettre la bonne image selon que le jeu est déjà ou non en mode plein-écran
            (!this.game.scale.isFullScreen) ? leBoutonPleinEcran.frame = 0: leBoutonPleinEcran.frame = 1;

            leBoutonPleinEcran.anchor.set(1, 0);
        }

        //On joue pendant le temps du jeu spécifié
        this.time.events.loop(Phaser.Timer.SECOND, this.augmenterTemps, this);
                   
    }, // Fin create

    /**
     * Gère le mode plein-écran (fullScreen) - le met ou l'enlève...
     * @param {Phaser.Button} boutonPleinEcran Le bouton sur lequel le joueur a cliqué
     */
    gererPleinEcran: function (boutonPleinEcran) {
        if (!this.game.scale.isFullScreen) {
            Ecran.mettrePleinEcran();
            boutonPleinEcran.frame = 1;
        } else {
            Ecran.enleverPleinEcran();
            boutonPleinEcran.frame = 0;

        }
        //Si on est sur un périphérique mobile Android on va bloquer l'orientation si c'est possible, soit si l'API Orientation est disponible
        if (this.game.device.android) {
            Ecran.verrouillerEcran(Ecran.PAYSAGE);
        }
    },

    //Choisi un son au hasard lors du lancement d'une partie, et lorsqu'un son se termine pendant la partie
    choisirSonJeu : function(){
        // Le son est choisi au hasard
        var sonChoisi = this.rnd.between(0,5);

        // Le son choisi est joué
        this.tableauSons[sonChoisi].play();

        // À la fin du son, on rapelle la fonction pour choisir à nouveau un son
        this.tableauSons[sonChoisi].onStop.add(this.choisirSonJeu, this);
    },

    //La minuterie du jeu
    augmenterTemps : function (){
        // Incrémenter et afficher le temps écoulé
        CasseBrique.tempsJeu++;
        this.tempsTxt.text = "Time : " + CasseBrique.tempsJeu;
    },

    /**
     * Vérifie et ajuste la position de la barre pour l'empêcher de sortir des limites gauche/droite de la scène
     */
    verifierPositionBarre: function () {
        if (this.barre.x <= 0) {
            this.barre.x = 0;
        } else if ((this.barre.x + (this.barre.width - 125)) >= this.game.width) {
            this.barre.x = (this.game.width - this.barre.width) + 121;
        }
    },

    //Creer la balle et configure son physique
    creerBalle : function () {
        //la balle
        this.balle = this.add.sprite(this.world.centerX, this.barre.y - 8, 'balleImg');
        this.balle.anchor.set(0.5);
        this.balle.animations.add('rotationBalle', null, 6, true, false);

        this.balle.checkWorldBounds = true;

        //Ajout de la physique pour notre balle
        this.game.physics.enable(this.balle, Phaser.Physics.ARCADE);

        this.balle.body.collideWorldBounds = true;
        this.balle.body.bounce.set(1);

        this.balle.body.setSize(16, 16, 0, 0);

        //Lorsque la balle tombe, la fonction gererBallePerdue est appelée
        this.balle.events.onOutOfBounds.add(this.gererBallePerdue, this);

        //Lors du clic de la souris, la fonction lancerBalle est appelée
        this.input.onTap.add(this.lancerBalle, this);
    },    

    //Creer les briques pour chaque niveau, et ajoute des animations au fil des niveaux
    creerBriques : function(){ 
        //Les briques
        this.lesBriques = this.add.physicsGroup(Phaser.Physics.ARCADE);
        var lesPositions=[
                          [80,324], [134,324], [188,324], [242,324], [296,324], [350,324], [404,324], [458,324], [512,324], [566,324], [620,324], [674,324], [728,324], [782,324], [836,324],
                          [80,243], [134,243], [188,243], [242,243], [296,243], [350,243], [404,243], [458,243], [512,243], [566,243], [620,243], [674,243], [728,243], [782,243], [836,243],
                          [80,162], [134,162], [188,162], [242,162], [296,162], [350,162], [404,162], [458,162], [512,162], [566,162], [620,162], [674,162], [728,162], [782,162], [836,162],
                          [80,81], [134,81], [188,81], [242,81], [296,81], [350,81], [404,81], [458,81], [512,81], [566,81], [620,81], [674,81], [728,81], [782,81], [836,81]      
                         ];

        // Les briques sont animées selon leur couleur
        var lesAnims = [[0,1,2,3,4],[5,6,7,8,9],[10,11,12,13,14],[15,16,17,18,19]];

        var posX, posY, uneBrique;           
        for( var i=0 ; i < 60 ; i++){
            posX = lesPositions[i][0];
            posY = lesPositions[i][1];
            uneBrique = this.lesBriques.create(posX, posY, "briquesImg");
            if(this.game.device.desktop){
                uneBrique.animations.add("disparitionBriqueBleu", lesAnims[0], 20, false );
                uneBrique.animations.add("disparitionBriqueJaune", lesAnims[1], 20, false );
                uneBrique.animations.add("disparitionBriqueRouge", lesAnims[2], 20, false );
                uneBrique.animations.add("disparitionBriqueVerte", lesAnims[3], 20, false );
            }

            //Chaque ligne a des briques de couleurs différentes
            //Chaque niveau augmente en difficulté, les briques se mettent à bouger et s'accélèrent au fil des niveaux...
            if(i < 15){
                //console.log(uneBrique);
                uneBrique.frame = 10; 
                if(CasseBrique.nbNiveau > 1){
                    this.animBrique1 = this.add.tween(uneBrique).to({x:uneBrique.x, y:365}, 3000, Phaser.Easing.Linear.None, true, 0, -1, true);
                }
                if(CasseBrique.nbNiveau >= 3){
                    this.animBrique1.timeScale = 3;
                }
                if(CasseBrique.nbNiveau >= 4){
                    if(i%2 == 0){
                        this.animBrique1 = this.add.tween(uneBrique).from({x:uneBrique.x, y:325}, 1000, Phaser.Easing.Linear.None, true, 0, -1, true);
                    }
                }
                if(CasseBrique.nbNiveau == 5){
                    if(i%2 != 0){
                        this.animBrique1 = this.add.tween(uneBrique).from({x:uneBrique.x, y:405}, 1000, Phaser.Easing.Linear.None, true, 0, -1, true);
                    }
                } 
            }

            if(i >= 15 && i < 30){
                uneBrique.frame = 5;
                if(CasseBrique.nbNiveau > 1){
                    this.animBrique2 = this.add.tween(uneBrique).to({x:uneBrique.x, y:243}, 2000, Phaser.Easing.Linear.None, true, 0, -1, true);
                }
                if(CasseBrique.nbNiveau >= 3){
                    this.animBrique2.timeScale = 3;
                }
                if(CasseBrique.nbNiveau >= 4){
                    if(i%2 == 0){
                        this.animBrique2 = this.add.tween(uneBrique).from({x:uneBrique.x, y:203}, 1000, Phaser.Easing.Linear.None, true, 0, -1, true);
                    }
                }
                if(CasseBrique.nbNiveau == 5){
                    if(i%2 != 0){
                        this.animBrique1 = this.add.tween(uneBrique).from({x:uneBrique.x, y:283}, 1000, Phaser.Easing.Linear.None, true, 0, -1, true);
                    }
                }
            }   

            if(i >= 30 && i < 45){
                uneBrique.frame = 15;
                if(CasseBrique.nbNiveau > 1){
                    this.animBrique3 = this.add.tween(uneBrique).to({x:uneBrique.x, y:182}, 2000, Phaser.Easing.Linear.None, true, 0, -1, true);
                } 
                if(CasseBrique.nbNiveau >= 3){
                    this.animBrique3.timeScale = 3;
                }
                if(CasseBrique.nbNiveau >= 4){
                    if(i%2 == 0){
                        this.animBrique3 = this.add.tween(uneBrique).from({x:uneBrique.x, y:122}, 1000, Phaser.Easing.Linear.None, true, 0, -1, true);
                    }
                }
                if(CasseBrique.nbNiveau == 5){
                    if(i%2 != 0){
                        this.animBrique1 = this.add.tween(uneBrique).from({x:uneBrique.x, y:202}, 1000, Phaser.Easing.Linear.None, true, 0, -1, true);
                    }
                }
            }

            if(i >= 45 && i < 60){
                uneBrique.frame = 0;
                if(CasseBrique.nbNiveau > 1){ 
                    this.animBrique4 = this.add.tween(uneBrique).to({x:uneBrique.x, y:50}, 3000, Phaser.Easing.Linear.None, true, 0, -1, true);
                }
                if(CasseBrique.nbNiveau >= 3){
                    this.animBrique4.timeScale = 3;
                }
                if(CasseBrique.nbNiveau >= 4){
                    if(i%2 == 0){
                       this.animBrique4 = this.add.tween(uneBrique).from({x:uneBrique.x, y:30}, 1000, Phaser.Easing.Linear.None, true, 0, -1, true);
                    }
                }
                if(CasseBrique.nbNiveau == 5){
                    if(i%2 != 0){
                        this.animBrique1 = this.add.tween(uneBrique).from({x:uneBrique.x, y:110}, 1000, Phaser.Easing.Linear.None, true, 0, -1, true);
                    }
                }
            }   
        };

        //Toutes les briques resteront immobiles lors des collisions
        this.lesBriques.setAll("body.immovable", true);      
    }, // Fin creerBriques
    
    //faire bouger la barre à la position x de la souris, gère la position de la balle
    //lorsqu'elle est sur la barre et lorsqu'elle est lancée, gère ses collisions
    update: function(){

        //La barre suit la position sur l'axe des x de la souris sur ordinateur
        if(this.game.device.desktop){
            this.barre.x = this.input.x; 
        }

        //La balle est posée sur la barre et y reste collée jusqu'a ce qu'elle soit lancée
        if(this.balleSurBarre === true){
            this.balle.body.x = this.barre.x;
        }else{
            //Lorsque la balle est lancée, elle détecte les collisions avec la barre et les briques
            this.game.physics.arcade.collide(this.balle, this.barre, this.gererCollisionEntreBarreEtBalle, null, this);
            this.game.physics.arcade.collide(this.balle, this.lesBriques, this.gererCollisionEntreBalleEtBrique, null, this);
        }

    }, // Fin update

    //Lors du click de la souris, cette fonction est appelée. Elle règle la vélocité de la balle et lance son animation
    lancerBalle : function() {
        // Régler la vitesse de la balle lorsqu'elle est lancée , sa vitesse s'accélère au fil des niveaux
        if (this.balleSurBarre == true){
            if(CasseBrique.nbNiveau == 5){
                this.balle.body.velocity.y = -500;
                this.balle.body.velocity.x = -200;
            }
            else if(CasseBrique.nbNiveau == 4){
                this.balle.body.velocity.y = -450;
                this.balle.body.velocity.x = -200;
            }
            else if(CasseBrique.nbNiveau == 3){
                this.balle.body.velocity.y = -400;
                this.balle.body.velocity.x = -120;
            }else{ 
                this.balle.body.velocity.y = -300;
                this.balle.body.velocity.x = -75; 
            }
                this.balleSurBarre = false;
                this.balle.animations.play('rotationBalle');
        }
    }, // Fin lancerBalle

    /**
     * Gère le rebond de la balle lorsqu'elle rentre en collision avec la barre
     * @param {Phaser.Sprite} balle
     * @param {Phaser.Sprite} barre
     */
    gererCollisionEntreBarreEtBalle : function(balle, barre){           
        //Instancier une variable qui permettra de renvoyer la balle dans une certaine direction lors de la collision selon la partie de la barre où elle atterrit
        var directionRenvoi = 0;
        
        if (balle.x < barre.x){
            // La balle est sur la côté gauche de la barre
            directionRenvoi = barre.x - balle.x;
            balle.body.velocity.x = (-10 * directionRenvoi);
        }
        else if (balle.x > barre.x){
            // La balle est sur le côté droit de la barre
            directionRenvoi = balle.x - barre.x;
            balle.body.velocity.x = (10 * directionRenvoi);
        }
    }, // Fin gererCollisionEntreBarreEtBalle

    /**
     * Lance l'animation de la brique touchée par la balle et la détruit juste aprés, s'il ne reste plus de briques, on passe au niveau suivant
     * @param {Phaser.Sprite} balle
     * @param {Phaser.Sprite} brique qui est touchée par la balle
     */
    gererCollisionEntreBalleEtBrique : function(balle, brique){           
        //On ajoute 10 points au score et on associe les animations de destructions de briques aux briques adéquats 
        this.add.audio("sonCollisionBrique",1).play();
        CasseBrique.score += 10;
        this.scoreTxt.text = 'Score: ' + CasseBrique.score;
        switch (brique.frame) {
            case 0:
                if(this.game.device.desktop){
                    var anim = brique.play("disparitionBriqueBleu");
                    anim.killOnComplete = true;
                }else{
                    brique.destroy();
                }
                break;
            case 5:
                if(this.game.device.desktop){
                    anim = brique.play("disparitionBriqueJaune");
                    anim.killOnComplete = true;
                }else{
                    brique.destroy();
                }
                break;
            case 10:
                if(this.game.device.desktop){    
                    anim = brique.play("disparitionBriqueRouge");
                    anim.killOnComplete = true;
                }else{
                    brique.destroy();
                }
                break;
            case 15:
                if(this.game.device.desktop){
                    anim = brique.play("disparitionBriqueVerte");
                    anim.killOnComplete = true;
                }else{
                    brique.destroy();
                }
                break;
        }
        if(this.game.device.desktop){
            if (this.lesBriques.countLiving() == 1){
                this.accederNiveauSuivant();
            }
        }else{
            if (this.lesBriques.countLiving() == 0){
                this.accederNiveauSuivant();
            }
        }
        
    }, // Fin gererCollisionEntreBalleEtBrique

    //Enlève 1 au nombre de balles restantes, et renvoie la balle sur la barre. Si il ne reste plus de balle, c'est la fin du jeu
    gererBallePerdue : function() {
        //this.balle.destroy();
        //Lorsque de la perte d'une balle on retire une balle au compteur des balles restantes, si il n'y en a plus, c'est la fin du jeu
        this.ballesRestantes--;
        this.ballesRestantesTxt.text = 'Balls left : ' + this.ballesRestantes;

        if (this.ballesRestantes === 0){
            this.allerFinJeu();
        }else{
            this.balleSurBarre = true;

            this.balle.reset(this.barre.body.x, this.barre.y - 8);
                
            this.balle.animations.stop();
        }
    }, // Fin gererBallePerdue

    //Ajoute 1 un numéro du niveau. La balle est renvoyée sur la barre, son animation est stoppée et la fonction creerBriques est appelée pour creer le prochain niveau, si c'était le dernier niveau, c'est la fin du jeu
    accederNiveauSuivant : function () {
        //On ajoute 1 au numéro du niveau
        CasseBrique.nbNiveau += 1;

        // Si il reste des niveaux la partie continue et un bonus de 250 points s'ajoute au score
        if(CasseBrique.nbNiveau <6){
            CasseBrique.score += 250;
            this.scoreTxt.text = 'Score: ' + CasseBrique.score;

            //Instancier la classe CompteurNiveaux qui affiche le numéro de chaque niveau
            var style = {
                font: "45px Calibri",
                fill: "#ffffff",
                align: "center"
            }
            var texte = 'Level ' + CasseBrique.nbNiveau;
            this.compteurNiveaux = new CompteurNiveaux(this.game, this.world.centerX, 0, texte, style);

            //  On renvoie la balle sur la barre
            this.balleSurBarre = true;

            this.balle.reset(this.barre.body.x, this.barre.y - 8);
                
            this.balle.animations.stop();

            // Les briques se crééent en prenant compte du niveau atteint
            this.creerBriques();
        }
        //sinon, la partie est terminée
        else{
            this.allerFinJeu();
        }        
    }, // Fin allerFinJeu

    //Arrête le son du jeu et lance l'écran de fin de jeu
    allerFinJeu : function () {
        //Arrêter le son d'arrière-plan du jeu
        for(var i = 0; i < 6; i++){
            this.tableauSons[i].pause();
        }
        //Aller à la fin du jeu
        this.game.state.start("FinJeu");           
    }, // Fin allerFinJeu
		
}; // Fin Jeu.prototype
