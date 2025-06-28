

var lang = [];

lang.alert_consent = "Vous devez cocher la case pour commencer l'étude"
lang.end_wait = "Redirection..."
lang.reject_message = "Désolé, votre appareil n'est pas compatible avec cette expérience. Veuillez utiliser un ordinateur de bureau ou un ordinateur portable...";
lang.waitbefore_continue = "Attendez avant de continuer...";
lang.end_screen = "Les données ont été transférées. <br>Merci pour votre participation! <br> <b>Appuyez sur n'importe quelle touche</b> et attendez d'être redirigé..."

lang.textFeedback = ["Incorrect", "Correct", "Correct", "Réponse invalide"];

// diapositive d'instruction
if (mobile_session) {
  var variable_text = "il suffit de les toucher pour valider votre réponse" ;
} else {
  var variable_text = "activez-les en appuyant sur la flèche gauche, bas ou droit de votre clavier"
}
lang.welcome1_title = "Bienvenue au jeu d'association Image-Réponse" ;
lang.welcome1_box1 = "Dans ce jeu, différentes images vous sont présentées. " +
  "Chaque image est associée à une seule <b>une</b> réponse correcte que vous devrez découvrir par essais et erreurs" ;
lang.welcome1_box2 = "Le jeu se présente comme suit :"
lang.welcome1_box3 = "Vous disposez de trois boutons de réponse : " + variable_text ;
lang.welcome1_box4 = "Votre but est de trouver le bon bouton pour chaque image."
if (mobile_session) {
  lang.welcome1_arrowleft = '' ;
  lang.welcome1_arrowleft = '' ;
  lang.welcome1_continue = "<b>Tapez ici pour continuer..</b>"
} else {
  lang.welcome1_arrowleft = '' ;
  lang.welcome1_arrowleft = '' ;
  lang.welcome1_continue = "<b>Flèche droite pour continuer...</b>"
}

//
lang.welcome2_box1 = "Le jeu sera divisé en plusieurs blocs impliquant différentes catégories d'images. " +
  "<br>Pour commencer, vous vous entraînerez dans un bloc comportant seulement 2 images. <br>Plus tard, pendant le jeu principal, les blocs pourront comporter 2, 3, 4 ou 5 images." ;
lang.welcome2_box2 = "Les blocs changeront une fois que vous aurez appris les bonnes réponses pour chaque image, il est donc essentiel d'être attentif !"
lang.welcome2_box3 = "Quatre choses importantes à garder à l'esprit :" +
  "<br>-Il n'y a qu'UNE seule bonne réponse par image." +
  "<br>-La réponse correcte de chaque image ne change JAMAIS dans un bloc." +
  "<br>-La MÊME réponse peut être la réponse correcte pour différentes images au sein d'un bloc." +
  "<br>-Vous n'avez que DEUX secondes pour donner une réponse une fois que les images apparaissent."

if (mobile_session) {
  lang.welcome2_continue = "<b>Tapez ici pour vous entraîner...</b>"
} else {
  lang.welcome2_continue = "<b>Flèche droite pour s'entraîner...</b>"
}

//
lang.beforemain_box1 = "Vous avez terminé l'entrainement!"
lang.beforemain_box2 = "Commencez l'expérience principale dès que vous êtes prêt !"
lang.beforemain_box3 = "Quatre choses importantes à garder à l'esprit :" +
  "<br>-Il n'y a qu'UNE seule réponse correcte par image." +
  "<br>-La réponse correcte de chaque image ne change JAMAIS au sein d'un bloc." +
  "<br>-La MÊME réponse peut être correcte une pour différentes images au sein d'un bloc." +
  "<br>-Vous avez seulement DEUX secondes pour donner une réponse une fois que les images apparaissent."
if (mobile_session) {
  lang.beforemain_continue = "<b>Tapez ici pour commencer...</b>"
} else {
  lang.beforemain_continue = "<b>Flèche droite pour commencer...</b>"
}

//
lang.preblock_box1 = "Vous êtes sur le point de commencer un nouveau bloc."
lang.preblock_box2 = "Restez concentré une fois que vous l'avez commencé ! "
if (mobile_session) {
  lang.preblock_continue = "<b>Tapez ici pour commencer...</b>"
} else {
  lang.preblock_continue = "<b>Flèche droite pour commencer...</b>"
}

//
lang.aftermain_title = "Vous avez terminer le test Finger Tapping!"
lang.aftermain_box1 = "Avant de continuer, nous voudrions savoir comment vous avez réalisé le test. "
lang.aftermain_box2 = "Ensuite, vous passerez un dernier test de mémoire."
if (mobile_session) {
  lang.aftermain_continue = "<b>Appuyez ici pour continuer..</b>"
} else {
  lang.aftermain_continue = "<b>Flèche de droite ou clic ici pour continuer...</b>"
}

/** 
lang.aftermain_title = "Félicitations, vous avez terminé le jeu principal !"
lang.aftermain_box1 = "Vous allez maintenant effectuer un dernier test de mémoire (5 minutes)."
lang.aftermain_box2 = "Commençons par les questions."
if (mobile_session) {
  lang.beforemain_continue = "<b>Tapez ici pour commencer...</b>"
} else {
  lang.beforemain_continue = "<b>Flèche droite pour commencer...</b>"
}
**/

// 
lang.post1_box1 = "Maintenant, vous allez effectuer le test de mémoire."
lang.post1_box2 = "Vous allez à nouveau voir toutes les images (3 fois chacune) et vous devrez simplement vous rappeler quel était le bon bouton pendant le jeu principal !" +
  "<br>Aucun retour ne sera donné concernant l'exactitude de vos réponses. Comme dans la phase d'apprentissage, utilisez le clavier pour donner la réponse dont vous vous souvenez."
if (mobile_session) {
  lang.post1_continue = "<b>Appuyez ici pour continuer...</b>"
} else {
  lang.post1_continue = "<b>Flèche droite ou clic ici pour continuer...</b>"
}

//
lang.post2_box1 = "Bien ! C'est maintenant l'heure du (dernier) test de mémoire. Il sera beaucoup plus court que le premier."
lang.post2_box2 = "Pendant le jeu, parfois vous obteniez +1 point et parfois vous obteniez +2 points.<br><br>Dans les prochaines minutes, vous allez revoir toutes les images que vous avez vues pendant le jeu." +
  "<br><br>Vous devrez dire si vous avez obtenu : <br><b>Bouton gauche</b>+1 plus souvent que +2" +
  "<br><b>Bouton du milieu</b> : +1 et +2 aussi souvent <br><b>Bouton droit</b> : +2 plus souvent que plus un <br><br><br>Tentez de faire de votre mieux pour vous en souvenir !" ;
if (mobile_session) {
  lang.post2_continue = "<b>Tap ici pour continuer...</b>"
} else {
  lang.post2_continue = "<b>Flèche droite pour continuer...</b>"
}


if (mobile_session) {
  lang.harvest_continue = "Tapez n'importe où pour continuer"
} else {
  lang.harvest_continue = "Appuyez sur n'importe quelle touche pour continuer"
}


// message d'aide sur l'essai de prédiction
if (mobile_session) {
  lang.helpmsg_1 = "Tapez sur la pièce que vous pourriez voir après avoir ouvert la <b>session</b>" ;
} else {
  lang.helpmsg_1 = "Utilisez les flèches pour sélectionner la pièce que vous pourriez voir après avoir ouvert la <b>session</b>" ;
}
lang.helpmsg_2 = " </b>porte dans la <b>pièce </b>" ;

//
lang.end_wait = "Veuillez patienter, les données sont en cours de téléchargement..."
lang.end_quit = "Merci pour votre participation ! <br>Vous pouvez maintenant fermer cette fenêtre..."

if (mobile_session) {
  lang.fullscreen_continue = "<b>Tap ici pour continuer..</b>"
  lang.fullscreen_msg = "<p>L'expérience passera en mode plein écran lorsque vous appuierez sur le bouton ci-dessous !" +
    "<br>Veuillez faire pivoter votre appareil dans l'orientation <b>landscape</b>.<br><br>" +
    "Pour maximiser la qualité des données, nous vous demandons de ne pas quitter le mode plein écran avant la fin de l'expérience.<br><br></p>"
} else {
  lang.fullscreen_continue = "<b>Cliquez ici pour continuer...</b>"
  lang.fullscreen_msg = "<p>L'expérience passera en mode plein écran lorsque vous appuierez sur le bouton ci-dessous !" +
    "<br>Vous pouvez quitter le mode plein écran à tout moment en utilisant la touche F11 (ou ESC), et y revenir en utilisant également la touche F11.<br><br>" +
    "Toutefois, pour maximiser la qualité des données, nous vous prions de ne pas quitter le mode plein écran avant la fin de l'expérience.<br><br></p>"
}

// misc
lang.fixation_instructions = ['Exploration', 'Prediction']
lang.exclusion_message = 'Vous devez utiliser un ordinateur de bureau/portable pour participer à cette expérience' ;
lang.choicewarning_message = 'Sélectionnez la porte disponible.' ;
lang.alert_consent = "Vous devez cocher la case pour continuer l'étude"

lang.attn_check_tip = 'Cliquez sur une réponse pour continuer...' ;
// contrôles d'attention
lang.attn_check = [{
  prompt : "Combien de boutons de réponse pouvez-vous utiliser ?",
  buttons : ['2', '3', '4', '5']
},
{
  prompt : 'Quel est le but du jeu?',
  buttons : ['Dire quelles images vous aimez', 'Répondre toujours avec le même bouton', 'Trouver le bouton correct pour chaque image']
},
{
  prompt : "Choisissez l'affirmation vraie",
  buttons : ['Deux images peuvent avoir la même réponse correcte', "Parfois deux images apparaîtront à l'écran", "La même image ne sera jamais répétée"]
},
{
  prompt : "L'expérience était-elle difficile ?",
  buttons : ["trop facile", "facile", "équilibré", "difficile", "trop difficile"]
},
{
  prompt : "Quel est le but de ce premier test de mémoire?",
  buttons : ['Répondre uniquement à des catégories spécifiques', 'Se souvenir de la bonne réponse pour chaque image']
},
{
  prompt : "Quel est l'objectif de ce deuxième test de mémoire ?",
  buttons : ['Se souvenir du nombre de points souvent associé à une image', 'Répondre seulement pour des catégories spécifiques de stimuli']
},
]

lang.gender_stimulus = 'Quel est votre sexe ?'
lang.gender_choices = ['Je préfère ne pas le dire', 'Femme', 'Homme', 'Non-binaire', 'Autre']
lang.gender_continue = 'Sélectionnez une réponse pour continuer...' ;

lang.age_prompt = "Quel est votre âge ?"
lang.age_continue = 'Cliquez ici pour continuer...' ;


// Final questionnaires

// iLOC4
lang.ieLOC = {
  preamble : "Les affirmations suivantes peuvent s'appliquer plus ou moins à vous. Dans quelle mesure pensez-vous que chaque affirmation s'applique ou s'est appliquée à vous personnellement ?",
  labels : ["pas du tout", "un peu", "quelque peu", "surtout", "complètement"],
  questions : ["Je suis mon propre patron.", "Si je travaille dur, je réussirai.",
    "Que ce soit au travail ou dans ma vie privée : Ce que je fais est principalement déterminé par les autres",
    "Le destin se met souvent en travers de mes plans."
  ]
}


lang.medications = {
  preamble : "Êtes-vous actuellement traité avec un ou plusieurs des médicaments suivants ?",
  labels : ["non", "préfère ne pas dire<br>je ne sais pas", "oui"],
  questions : ["Antidépresseurs (exemple : Zoloft, Celexa, Prozac)", "Anxiolytiques (exemple : Xanax, Valium, Klonopin)",
    "Antipsychotiques (exemple : Risperdal, Zyprexa, Abilify, Clozaril), Psychostimulants (exemple : Ritalin, Adderall)",
    "Antiparkinsoniens (exemple : L-DOPA, Selegiline)"
  ]
}

lang.drugs = {
  preamble : ' Consommez-vous les substances suivantes... ',
  labels : ["jamais", "parfois", "préfère ne pas dire", "souvent", "tous les jours"],
  questions : ["Caféine", "Tabac", "Alcool", "Marijuana"]
}

lang.additional_questions = [{
  prompt : 'En voiture, préférez-vous être le conducteur ou le passager?',
  buttons : ['driver, completely', 'driver, slighty', 'indifferent', 'passenger, slightly', 'passenger, completely']
},
{
  prompt : 'Préférez-vous vous informer en surfant sur le Web ou en regardant la télévision?', // inversé après _highnoise et _lownoise (première exp inversée : '_short')
  buttons : ["regarder la TV, complètement", "regarder la TV, légèrement", "indifférent", "surfer sur le Web, légèrement", "surfer sur le Web, complètement"],
},
{
  invite : 'Dans un casino, préférez-vous jouer au poker ou aux machines à sous?',
  buttons : ["machine à sous, complètement", "machine à sous, un peu", "indifférent", "poker, un peu", "poker, complètement"], 
},
{
  prompt : "En général, diriez-vous que vous êtes meilleur pour parler ou écouter ?",
  buttons : ["parler, complètement", "parler, légèrement", "indifférent", "écouter, légèrement", "écouter, complètement"]
}
]

lang.feedback_questions = [{
  prompt : "Dans l'ensemble, dans quelle mesure avez-vous aimé cette expérience?",
  buttons : ["pas du tout", "peu", "moyennement", "assez", "énormément"]
},
{
  prompt : "Seriez-vous d'accord pour la refaire un autre jour?",
  buttons : ["non", "probablement pas", "je ne sais pas", "probablement", "certainement"]
},
]

lang.medState = [
  { prompt: "Quand avez-vous pris votre traitement pour la dernière fois? (anti-Parkinsonien)", name: 'timeSinceMed', labels: ["moins d'1h", "1-2h", "2-3h", "3-4h","4-5h","5-6h","7-8h","plus de 8h"] },
  { prompt: "Par rapport à vos mouvements et actions, vous vous sentez..", name: 'motorMed', labels:  ["Vraiment pas assez médiqué(e)<br>(Rigide, lent ou tremblant)", "Pas assez médiqué(e)", "Comme il faut", "Un peu trop médiqué","Trop médiqué<br>(nerveux, remuant)"]},
  { prompt: "Par rapport à vos pensées et vos sentiments, vous vous sentez..", name: 'cognitiveMed', labels:  ["Vraiment pas assez médiqué(e)<br>(Pensées lentes)","Pas assez médiqué(e)", "Comme il faut", "Un peu trop médiqué", "Trop médiqué (impulsif, chaotique)"]},
]
lang.medStateContinue='Continuez'


lang.ftp_start = {
  divs : [
    {
      text: "Super. Nous reviendrons au jeu d'apprentissage dans quelques minutes pour vérifier si vous pouvez vous souvenir des associations que vous venez d'apprendre.",
    },
    {
      text: "Mais pour l'instant, nous allons faire un test très simple de 'Finger tapping'.<br>Dans ce test, vous allez utiliser 4 touches de votre clavier : les touches 1, 5, 6 et 0 situées <u>au-dessus des lettres</u> comme indiqué en bleu dans l'image ci-dessous (n'utilisez pas le pavé numérique)",
      image : "./FTP_assets/FTP_keyboardNumbers.png",
    },
    {
      text: " Vous allez effectuer 8 essais d'une durée de 30s chacun. Pendant chaque essai, vous utiliserez le <u>doigt d'index</u> de votre main gauche <u>ou</u> droite. <br>Ne vous servez pas des deux mains, ni d'un autre doigt que l'index, car cela rendrait l'expérience invalide.<br>Un <b>bip sonore signale la fin</b> de chaque essai, vous n'aurez donc pas besoin de regarder l'écran.",
    },
    {
      text: "Selon l'épreuve, votre <b>but</b> sera d'<b>alterner le plus rapidement possible</b> entre les touches 0 et 1, ou 5 et 6. En utilisant soit votre index gauche <u>ou</u> droit.",
    },
  ],
  continue: 'Cliquez ici pour voir une courte démo'
}

lang.ftp_prompt = 'Utilisez seulement votre index droit'
lang.ftp_spacebar = 'Appuyez sur la touche espace pour continuer' // new
lang.ftp_alternate = "Vous devrez alterner entre les deux touches jusqu'à ce que la jauge temporelle soit finie" // new
lang.ftp_demo_msg = 'Essai de démonstration' // new
lang.ftp_demo_multi = ["Si le jeu vous demande d'appuyer sur ", " et ", " avec votre index ",""]
lang.ftp_multi1=['Pour cet essai, alternez entre les touches ', ' et ']
lang.ftp_multi2=["avec votre index "," seulement"]
lang.ftp_fingernames=["gauche", "droit"]

lang.ftp_time = 'Temps restant'
lang.ftp_targets = 'Cibles'

lang.end_wait = "Veuillez patienter, les données sont en train d'être téléchargées..."
lang.end_quit = "Merci ! Ne fermez pas cette fenêtre. <br> Appuyez sur n'importe quelle touche pour revenir à l'écran principal."