

var lang = [];

lang.alert_consent = 'Je moet het selectievakje aanvinken om door te gaan met de studie.'
lang.end_wait = 'Doorverwijzen...'
lang.reject_message = 'Sorry, je apparaat is niet compatibel met dit experiment.<br> Gebruik alstublieft een desktop of een laptop...';
lang.waitbefore_continue = "Even wachten voordat je verdergaat...";
lang.end_screen = 'De gegevens zijn geüpload. <br>Bedankt voor je deelname! <br> <b>Druk op een willekeurige toets</b> en wacht tot je wordt doorgestuurd...'
lang.textFeedback = ["Incorrect", "Correct", "Correct", "Geen antwoord ontvangen"];

// instruction slide
if (mobile_session) {
  var variable_text = "raak ze gewoon aan om je antwoord te sturen.";
} else {
  var variable_text = "activeer ze door op de pijl naar links, de pijl naar beneden, of de pijl naar rechts op uw toetsenbord te drukken."
}

lang.welcome1_title = 'Welkom bij de associatie afbeelding-reactie taak';
lang.welcome1_box1 = "In dit spel krijg je verschillende beelden te zien. " +
  "Elke afbeelding is verbonden met slechts <b>één</b> correct antwoord dat je met vallen en opstaan moet ontdekken..";
lang.welcome1_box2 = 'Het spel zal er zo uitzien:'
lang.welcome1_box3 = "Je hebt drie antwoordknoppen: " + variable_text;
lang.welcome1_box4 = "Je doel is om de juiste knop te vinden voor elke afbeelding."
if (mobile_session) {
  lang.welcome1_arrowleft = '';
  lang.welcome1_arrowright = '';
  lang.welcome1_continue = "<b>Tik hier om verder te gaan..</b>"
} else {
  lang.welcome1_arrowleft = '';
  lang.welcome1_arrowright = '';
  lang.welcome1_continue = "<b>Klik hier of pijl naar rechts om verder te gaan...</b>"
}

// 
lang.welcome2_box1 = "Het spel wordt verdeeld in verschillende blokken met verschillende categorieën afbeeldingen. " +
  "<br>Eerst traint u in een blok met slechts 2 afbeeldingen. <br>Later, tijdens het hoofdspel, kunnen blokken bestaan uit 2, 3, 4 of 5 afbeeldingen.";
lang.welcome2_box2 = "Blokken zullen veranderen zodra je de goede reacties voor elk beeld hebt geleerd, dus opletten is de sleutel!"
lang.welcome2_box3 = "Vier belangrijke dingen om in gedachten te houden:" +
  "<br>-Er is maar EEN juist antwoord per afbeelding." +
  "<br>-Het juiste antwoord van elke afbeelding verandert NOOIT binnen een blok." +
  "<br>-Dezelfde reactie kan de juiste zijn voor verschillende afbeeldingen binnen een blok." +
  "<br>-Je hebt slechts TWEE seconden om een antwoord te geven zodra er afbeeldingen verschijnen."


if (mobile_session) {
  lang.welcome2_continue = "<b>Tik hier om te trainen..</b>"
} else {
  lang.welcome2_continue = "<b>Klik hier of pijl naar rechts om te trainen...</b>"
}

//
lang.beforemain_box1 = "Je bent klaar met de training!"
lang.beforemain_box2 = "Start het hoofdexperiment wanneer u klaar bent!"
lang.beforemain_box3 = "Vier belangrijke dingen om in gedachten te houden:" +
  "<br>-Er is maar EEN juist antwoord per afbeelding." +
  "<br>-Het juiste antwoord van elke afbeelding verandert NOOIT binnen een blok." +
  "<br>-Dezelfde reactie kan de juiste zijn voor verschillende afbeeldingen binnen een blok." +
  "<br>-U hebt slechts TWEE seconden om een antwoord te geven zodra er afbeeldingen verschijnen."
if (mobile_session) {
  lang.beforemain_continue = "<b>Tik hier om te beginnen..</b>"
} else {
  lang.beforemain_continue = "<b>Klik hier of pijl naar rechts op uw toetsenbord om te starten</b>"
}

// 
lang.preblock_box1 = "Je gaat een nieuw blok beginnen."
lang.preblock_box2 = "Blijf gefocust als je er eenmaal aan begonnen bent! "
if (mobile_session) {
  lang.preblock_continue = "<b>Tik hier om te beginnen..</b>"
} else {
  lang.preblock_continue = "<b>Klik hier of pijl naar rechts op uw toetsenbord om te starten</b>"
}

//
lang.aftermain_title = "Gefeliciteerd, je bent klaar met het hoofdspel!"
lang.aftermain_box1 = "“We gaan nu opnieuw de taak doen die je hiervoor hebt gedaan om te kijken wat je hebt onthouden (de afbeelding-reactie taak). Laten we beginnen met deze geheugentest."
lang.aftermain_box2 = "Laten we beginnen met deze geheugentest."
if (mobile_session) {
  lang.aftermain_continue = "<b>Klik hier om te beginnen.</b>"
} else {
  lang.aftermain_continue = "<b>Klik hier of pijl naar rechts op uw toetsenbord om te starten</b>"
}

// 
lang.post1_box1 = "Nu voert u een eerste korte geheugentest uit."
lang.post1_box2 = "Je krijgt opnieuw alle afbeeldingen te zien (3 keer elk) en je hoeft je alleen maar te herinneren wat de juiste knop was tijdens het hoofdspel!" +
  "<br>Er wordt geen feedback gegeven over de juistheid van uw antwoorden."
if (mobile_session) {
  lang.post1_continue = "<b>Tik hier om verder te gaan..</b>"
} else {
  lang.post1_continue = "<b>Klik hier of pijl naar rechts op uw toetsenbord om te starten</b>"
}


// 
lang.post2_box1 = "Goed! Het is nu tijd voor de (laatste) geheugentest. Deze zal veel korter zijn dan de eerste.."
lang.post2_box2 = "Tijdens het spel kreeg je soms +1 punten en soms +2 punten.<br><br>In de volgende minuten zie je alle beelden die je tijdens het spel hebt gezien." +
  "<br><br>Je moet zeggen of je: <br><b>Linker</b> toets+1 vaker dan +2" +
  "<br><b>Middenknop</b>: +1 en +2 even vaak <br><b>Rechts</b> knop: +2 vaker dan plus één <br><br><br>Probeer je best te onthouden!";
if (mobile_session) {
  lang.post2_continue = "<b>Tik hier om verder te gaan..</b>"
} else {
  lang.post2_continue = "<b>Klik hier of pijl naar rechts op uw toetsenbord om te starten</b>"
}


if (mobile_session) {
  lang.harvest_continue = "Tap anywhere to continue"
} else {
  lang.harvest_continue = "Press any key to continue"
}


// help message on prediction trial
if (mobile_session) {
  lang.helpmsg_1 = "Tik op de kamer die je zou kunnen zien na het openen van de <b>";
} else {
  lang.helpmsg_1 = "Gebruik de pijlen om de kamer te selecteren die je te zien krijgt na het openen van de <b>";
}
lang.helpmsg_2 = " </b>deur in de <b>";

//
lang.end_wait = "Even geduld, de gegevens worden geüpload..."
lang.end_quit = "Dank je wel! Sluit dit venster niet. <br>Druk op een willekeurige toets om terug te keren naar het hoofdscherm.."

if (mobile_session) {
  lang.fullscreen_continue = "<b>Tik hier om verder te gaan..</b>"
  lang.fullscreen_msg = "<p>Het experiment schakelt over op volledig scherm wanneer u op de onderstaande knop drukt!" +
    "<br>Roteer uw apparaat in de <b>landschap</b> oriëntatie.<br><br>" +
    "Om de kwaliteit van de gegevens te maximaliseren, willen we u vriendelijk vragen de volledig scherm modus niet te verlaten totdat het experiment is afgelopen.<br><br></p>"
} else {
  lang.fullscreen_continue = "<b>Klik hier om verder te gaan...</b>"
  lang.fullscreen_msg = "<p>Het experiment schakelt over op volledig scherm als u op de onderstaande knop drukt!" +
    "<br>U kunt de fullscreen modus op elk moment verlaten met de toets F11 (of ESC), en ook weer terugkeren met F11.<br><br>" +
    "Echter, om de kwaliteit van de data te maximaliseren, willen we u vriendelijk vragen om de fullscreen modus niet te verlaten totdat het experiment is afgelopen.<br><br></p>"
}

// misc
lang.fixation_instructions = ['Exploration', 'Prediction']
lang.exclusion_message = "Je moet een desktop/laptop computer gebruiken om deel te nemen aan dit experiment";
lang.choicewarning_message = "Selecteer de beschikbare deur.";
lang.alert_consent = "U moet het selectievakje aanvinken om verder te gaan met het onderzoek."

lang.attn_check_tip = "Klik op een antwoord om verder te gaan."

// attention checks
lang.attn_check = [{
  prompt: "Hoeveel antwoordknoppen kun je gebruiken?",
  buttons: ['2', '3', '4', '5']
},
{
  prompt: 'Wat is het doel van het spel?',
  buttons: ['Vertellen welke beelden je leuk vindt', 'Steeds met dezelfde knop reageren', 'De juiste knop vinden voor elk beeld']
},
{
  prompt: 'Kies het juiste antwoord?',
  buttons: ['Twee beelden kunnen hetzelfde juiste antwoord hebben', 'Soms verschijnen er twee beelden op het scherm', 'Hetzelfde beeld zal nooit herhaald worden']
},
{
  prompt: 'Hoe moeilijk was het "Vinger tikken" experiment?',
  buttons: ["te gemakkelijk", "gemakkelijk", "evenwichtig", "moeilijk", "te moeilijk"]
},
{
  prompt: 'Wat is het doel van deze eerste geheugentest?',
  buttons: ["Reageer alleen voor specifieke categorieën", "Onthoud het juiste antwoord voor elke afbeelding"]
},
{
  prompt: 'Wat is het doel van deze tweede geheugentest?',
  buttons: ["Onthoud de gemiddelde punten van elke afbeelding", "Reageer alleen voor specifieke categorieën"]
},
]

lang.gender_stimulus = 'Wat is uw geslacht?'
lang.gender_choices = ['Liever niet zeggen', 'Vrouw', 'Man', 'Niet-binaire', 'Andere']
lang.gender_continue = "Selecteer een antwoord om verder te gaan...";

lang.age_prompt = "Wat is uw leeftijd?"
lang.age_continue = "Klik hier om verder te gaan...";


// Final questionnaires

// iLOC4
lang.ieLOC = {
  preamble: "De volgende uitspraken kunnen meer of minder op u van toepassing zijn. In hoeverre denkt u dat elke uitspraak op u persoonlijk van toepassing is of was?",
  labels: ["helemaal niet", "een beetje", "enigszins", "meestal", "helemaal"],
  questions: ["Ik ben mijn eigen baas.", "Als ik hard werk, zal ik slagen.",
    "Of het nu op mijn werk is of in mijn privéleven: Wat ik doe wordt voornamelijk bepaald door anderen.",
    "Het lot staat mijn plannen vaak in de weg."
  ]
}


lang.medications = {
  preamble: "Wordt u momenteel behandeld met een of meer van de volgende geneesmiddelen?",
  labels: ["nee", "liever niet zeggen<br>ik weet het niet", "ja"],
  questions: ["Antidepressiva (voorbeeld: Zoloft, Celexa, Prozac)", "Anxiolytica (voorbeeld: Xanax, Valium, Klonopin)",
    "Antipsychotica (voorbeeld: Risperdal, Zyprexa, Abilify, Clozaril)", "Psychostimulantia (voorbeeld: Ritalin, Adderall)",
    "Anti-Parkinsonmiddelen (voorbeeld: L-DOPA, Selegiline)"
  ]
}

lang.drugs = {
  preamble: " Gebruikt u de volgende stoffen... ",
  labels: ["nooit", "soms", "liever niet zeggen", "vaak", "elke dag"],
  questions: ["Cafeïne", "Tabak", "Alcohol", "Marihuana"]
}

lang.additional_questions = [{
  prompt: "Ben je in een auto liever de bestuurder of de passagier?",
  buttons: ["bestuurder, volledig", "bestuurder, enigszins", "onverschillig", "passagier, enigszins", "passagier, volledig"]
},
{
  prompt: 'Informeert u zich liever door op het web te surfen of TV te kijken?', // inverted after _highnoise and _lownoise (first exp inverted:'_short')
  buttons: ["TV kijken, volledig", "TV kijken, enigszins", "onverschillig", "surfen op het web, enigszins", "surfen op het web, volledig"]
},
{
  prompt: 'Speel je in een casino liever poker of een gokkast?',
  buttons: ["gokkast, volledig", "gokkast, enigszins", "onverschillig", "poker, enigszins", "poker, volledig"]
},
{
  prompt: "Zou u in het algemeen zeggen dat u beter bent in spreken of luisteren?",
  buttons: ["spreken, volledig", "spreken, enigszins", "onverschillig", "luisteren, enigszins", "luisteren, volledig"]
}
]

lang.feedback_questions = [{
  prompt: 'In het algemeen, hoe leuk vond je dit experiment?',
  buttons: ['verschrikkelijk', 'slecht', 'gemiddeld', 'goed', 'geweldig']
},
{
  prompt: 'Zou je het eens zijn om het een andere dag opnieuw te doen?',
  buttons: ["nee", "waarschijnlijk niet", "ik weet het niet", "waarschijnlijk", "zeker"]
},
]

lang.ftp_start = {
  divs: [
    {
      text: "Geweldig! We komen over een paar minuten terug naar het leerspel om te testen of je de zojuist geleerde associaties kunt herinneren.",
    },
    {
      text: "Maar voor nu gaan we een heel eenvoudige 'Vinger tikken' test doen.<br>In deze test gebruik je 4 toetsen van je toetsenbord: de toetsen 1, 5, 6 en 0 die zich <u>boven de letters</u> bevinden zoals in blauw aangegeven in de afbeelding hieronder (gebruik niet het numerieke pad)",
      image: "./FTP_assets/FTP_keyboardNumbers.png"
    },
    {
      text: "U doet 8 proeven die elk 30 seconden duren. Tijdens elke proef gebruikt u de <u>wijsvinger</u> van uw linker <u>of</u> rechterhand. <br>Gebruik niet beide handen, noch een andere vinger dan de wijsvinger, want dat zou het experiment ongeldig maken.<br>Een <b>biep geluid signaleert het einde</b> van elke proef, dus u hoeft niet naar het scherm te kijken.",
    },
    {
      text: "Afhankelijk van de proef zal je <b>doel</b> zijn om zo snel mogelijk te wisselen tussen de toetsen 0 en 1, 5 en 6. Gebruik ofwel je linker <u>of</u> rechter wijsvinger.",
    },
  ],
  continue: 'Klik hier voor een korte demo'
}

lang.ftp_prompt = 'Gebruik alleen je rechter wijsvinger'
lang.ftp_time = 'Resterende tijd'
lang.ftp_targets = 'Doelen'

lang.ftp_prompt = 'Gebruik alleen uw rechter wijsvinger'
lang.ftp_spacebar = 'Druk op de spatiebalk om door te gaan' // new
lang.ftp_alternate = "U zult moeten blijven afwisselen tussen de toetsen totdat de tijd op de tijdbalk is verstreken" // new
lang.ftp_demo_msg = 'Demonstratie (om een beter beeld te krijgen van de taak)' // new
lang.ftp_demo_multi = ["Als je wordt gevraagd om ", " en ", " met je "," vinger in te drukken"]
lang.ftp_multi1=['Voor deze proef, wissel af tussen de toetsen ', ' en ']
lang.ftp_multi2=["Met slechts uw ","vinger"]
lang.ftp_fingernames=[" linker "," rechter "]

lang.medState = [
  { prompt: "Hoe lang geleden nam je je laatste dosis? (anti-Parkinson behandeling)", name: 'timeSinceMed', labels: ["minder dan 1u", "1-2u", "2-3u", "3-4u","4-5u","5-6u","7-8u","meer dan 8u"] },
  { prompt: "Hoe beweeg en handel je?", name: 'motorMed', labels:  ["Erg ondergedoseerd<br>(Stijf, traag of trillend)", "Iets ondergedoseerd", "Precies goed", "Iets overdreven","Erg overdreven<br>(overbeweeglijk)"]},
  { prompt: "Hoe voel en denk je?", name: 'cognitiveMed', labels:  ["Erg ondergedoseerd<br>(Traag in denken)", "Iets ondergedoseerd", "Precies goed", "Iets overdreven","Erg overdreven<br>(chaotisch, impulsief)"]},
]
lang.medStateContinue='Volgende'

lang.end_wait = "Even geduld, de gegevens worden geüpload..."
lang.end_quit = "Dank je wel! Sluit dit venster niet. <br> Druk op een willekeurige toets om terug te keren naar het hoofdscherm."