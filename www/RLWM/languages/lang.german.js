var lang = [];

lang.alert_consent = 'Sie müssen das Kontrollkästchen aktivieren, um mit der Studie fortzufahren.';
lang.end_wait = 'Leite weiter...';
lang.reject_message = 'Entschuldigung, Ihr Gerät ist nicht mit diesem Experiment kompatibel.<br> Verwenden Sie bitte einen Desktop-Computer oder Laptop...';
lang.waitbefore_continue = "Warten Sie, bevor Sie fortfahren...";
lang.end_screen = 'Die Daten wurden hochgeladen. <br>Danke für Ihre Teilnahme! <br> <b>Drücken Sie eine beliebige Taste</b> und warten Sie auf die Weiterleitung...';

lang.textFeedback = ["Falsch", "Richtig", "Richtig", "Keine gültige Antwort"];
// instruction slide
var variable_text;
if (mobile_session) {
  variable_text = "berühren Sie sie einfach, um Ihre Antwort zu senden.";
} else {
  variable_text = "aktivieren Sie sie, indem Sie die linke, untere oder rechte Pfeiltaste auf Ihrer Tastatur drücken."
}
lang.welcome1_title = 'Willkommen beim Bild-Antwort-Zuordnungsspiel';
lang.welcome1_box1 = "In diesem Spiel werden Ihnen verschiedene Bilder gezeigt. " +
  "Jedes Bild ist mit nur <b>einer</b> richtigen Antwort verbunden, die Sie durch Ausprobieren herausfinden müssen.";
lang.welcome1_box2 = 'Das Spiel wird so aussehen:';
lang.welcome1_box3 = "Sie haben drei Antworttasten: " + variable_text;
lang.welcome1_box4 = "Ihr Ziel ist es, die richtige Taste für jedes Bild zu finden.";
if (mobile_session) {
  lang.welcome1_arrowleft = '';
  lang.welcome1_arrowright = '';
  lang.welcome1_continue = "<b>Hier tippen, um fortzufahren...</b>";
} else {
  lang.welcome1_arrowleft = '';
  lang.welcome1_arrowright = '';
  lang.welcome1_continue = "<b>Rechte Pfeiltaste oder klicken Sie hier, um fortzufahren...</b>";
}

// 
lang.welcome2_box1 = "Das Spiel wird in mehrere Blöcke unterteilt, die verschiedene Bildkategorien beinhalten. " +
  "<br>Zuerst trainieren Sie in einem Block mit nur 2 Bildern. <br>Später können in den Hauptspielblöcken 2, 3, 4 oder 5 Bilder vorkommen.";
lang.welcome2_box2 = "Blöcke werden gewechselt, sobald Sie die richtigen Antworten für jedes Bild gelernt haben, also ist Aufmerksamkeit wichtig!";
lang.welcome2_box3 = "Vier wichtige Dinge, die Sie beachten sollten:" +
  "<br>- Es gibt nur EINE richtige Antwort pro Bild." +
  "<br>- Die richtige Antwort jedes Bildes ändert sich NIE innerhalb eines Blocks." +
  "<br>- DIE GLEICHE Antwort kann für verschiedene Bilder innerhalb eines Blocks richtig sein." +
  "<br>- Sie haben nur ZWEI Sekunden Zeit, um eine Antwort zu geben, sobald die Bilder erscheinen.";

if (mobile_session) {
  lang.welcome2_continue = "<b>Hier tippen, um zu trainieren...</b>";
} else {
  lang.welcome2_continue = "<b>Rechte Pfeiltaste oder klicken Sie hier, um zu trainieren...</b>";
}

//

//
lang.beforemain_box1 = "Sie haben das Training abgeschlossen!"
lang.beforemain_box2 = "Starten Sie das Hauptexperiment, wenn Sie bereit sind!"
lang.beforemain_box3 = "Vier wichtige Dinge, die Sie beachten sollten:" +
  "<br>- Es gibt nur EINE richtige Antwort pro Bild." +
  "<br>- Die richtige Antwort jedes Bildes ändert sich NIE innerhalb eines Blocks." +
  "<br>- DIE GLEICHE Antwort kann für verschiedene Bilder innerhalb eines Blocks richtig sein." +
  "<br>- Sie haben nur ZWEI Sekunden Zeit, um eine Antwort zu geben, sobald die Bilder erscheinen."
if (mobile_session) {
  lang.beforemain_continue = "<b>Hier tippen, um zu starten...</b>"
} else {
  lang.beforemain_continue = "<b>Rechte Pfeiltaste oder klicken Sie hier, um zu starten...</b>"
}

// 
lang.preblock_box1 = "Sie sind dabei, einen neuen Block zu starten."
lang.preblock_box2 = "Bleiben Sie konzentriert, sobald Sie ihn gestartet haben! "
if (mobile_session) {
  lang.preblock_continue = "<b>Hier tippen, um zu starten...</b>"
} else {
  lang.preblock_continue = "<b>Rechte Pfeiltaste oder klicken Sie hier, um zu starten...</b>"
}

//
lang.aftermain_title = "Sie haben die Finger-Tapping-Aufgabe abgeschlossen!"
lang.aftermain_box1 = "Zuerst möchten wir wissen, wie Sie die Finger-Tapping-Aufgabe gemacht haben."
lang.aftermain_box2 = "Dann führen Sie einen abschließenden Gedächtnistest durch (5 Minuten)."
if (mobile_session) {
  lang.aftermain_continue = "<b>Hier tippen, um fortzufahren...</b>"
} else {
  lang.aftermain_continue = "<b>Rechte Pfeiltaste oder klicken Sie hier, um fortzufahren...</b>"
}

// 
lang.post1_box1 = "Jetzt führen Sie den kurzen Gedächtnistest durch."
lang.post1_box2 = "Sie sehen wieder alle Bilder (jeweils 3-mal), die Sie im Spiel zur Bild-Antwort-Zuordnung gesehen haben. Sie müssen sich einfach für jedes Bild merken, welche Taste während des Hauptspiels richtig war!" +
  "<br>Diesmal wird <b>kein Feedback</b> zur Genauigkeit Ihrer Antworten gegeben. Verwenden Sie wie zuvor einfach die <strong>Tastaturpfeile</strong>, um so gut wie möglich zu antworten."
if (mobile_session) {
  lang.post1_continue = "<b>Hier tippen, um fortzufahren...</b>"
} else {
  lang.post1_continue = "<b>Rechte Pfeiltaste oder klicken Sie hier, um fortzufahren...</b>"
}

// 
lang.post2_box1 = "Gut! Es ist jetzt Zeit für den (endgültigen) Gedächtnistest. Dieser wird viel kürzer sein als der erste."
lang.post2_box2 = "Während des Spiels haben Sie manchmal +1 Punkte und manchmal +2 Punkte bekommen.<br><br>In den nächsten Minuten sehen Sie wieder alle Bilder, die Sie während des Spiels gesehen haben." +
  "<br><br>Sie müssen angeben, ob Sie:<br><b>Linke</b> Taste +1 öfter als +2 erhalten haben" +
  "<br><b>Mittlere</b> Taste: +1 und +2 gleich häufig<br><b>Rechte</b> Taste: +2 öfter als +1<br><br><br>Geben Sie Ihr Bestes, um sich zu erinnern!";
if (mobile_session) {
  lang.post2_continue = "<b>Hier tippen, um fortzufahren...</b>"
} else {
  lang.post2_continue = "<b>Rechte Pfeiltaste oder klicken Sie hier, um fortzufahren...</b>"
}


if (mobile_session) {
  lang.harvest_continue = "Tippen Sie überall, um fortzufahren"
} else {
  lang.harvest_continue = "Drücken Sie eine beliebige Taste, um fortzufahren"
}


// Hilfe-Nachricht für die Vorhersageprüfung
if (mobile_session) {
  lang.helpmsg_1 = "Tippen Sie auf den Raum, den Sie nach dem Öffnen der <b>";
} else {
  lang.helpmsg_1 = "Verwenden Sie die Pfeiltasten, um den Raum auszuwählen, den Sie nach dem Öffnen der <b>";
}
lang.helpmsg_2 = " </b>Tür im <b>";

// 
lang.end_wait = "Bitte warten, die Daten werden hochgeladen..."
lang.end_quit = "Vielen Dank! Schließen Sie dieses Fenster nicht. <br> Drücken Sie eine beliebige Taste, um zum Hauptbildschirm zurückzukehren."

if (mobile_session) {
  lang.fullscreen_continue = "<b>Hier tippen, um fortzufahren...</b>"
  lang.fullscreen_msg = "<p>Das Experiment wechselt in den Vollbildmodus, wenn Sie auf den Button unten tippen!" +
    "<br>Bitte drehen Sie Ihr Gerät in die <b>Querformat</b>-Ausrichtung.<br><br>" +
    "Um die Datenqualität zu maximieren, bitten wir Sie höflich, den Vollbildmodus nicht zu verlassen, bis das Experiment abgeschlossen ist.<br><br></p>"
} else {
  lang.fullscreen_continue = "<b>Hier klicken, um fortzufahren...</b>"
  lang.fullscreen_msg = "<p>Das Experiment wechselt in den Vollbildmodus, wenn Sie auf den Button unten klicken!" +
    "<br>Sie können den Vollbildmodus jederzeit mit der Taste F11 (oder ESC) verlassen und mit F11 wieder zurückkehren.<br><br>" +
    "Um jedoch die Datenqualität zu maximieren, bitten wir Sie höflich, den Vollbildmodus nicht zu verlassen, bis das Experiment abgeschlossen ist.<br><br></p>"
}

// Verschiedenes
lang.fixation_instructions = ['Erkundung', 'Vorhersage']
lang.exclusion_message = 'Sie müssen einen Desktop-/Laptop-Computer verwenden, um an diesem Experiment teilzunehmen.';
lang.choicewarning_message = 'Wählen Sie die verfügbare Tür aus.';
lang.alert_consent = 'Sie müssen das Kontrollkästchen aktivieren, um mit der Studie fortzufahren.'

lang.attn_check_tip = 'Klicken Sie auf eine Antwort, um fortzufahren..'

// Aufmerksamkeitsprüfungen
lang.attn_check = [{
  prompt: 'Wie viele Antworttasten können Sie verwenden?',
  buttons: ['2', '3', '4', '5']
},
{
  prompt: 'Was ist das Ziel des Spiels?',
  buttons: ['Feststellen, welche Bilder Ihnen gefallen', 'Immer mit derselben Taste antworten', 'Die richtige Taste für jedes Bild finden']
},
{
  prompt: 'Wählen Sie die wahre Aussage aus?',
  buttons: ['Zwei Bilder können dieselbe richtige Antwort haben', 'Manchmal erscheinen zwei Bilder auf dem Bildschirm', 'Dasselbe Bild wird nie wiederholt']
},
{
  prompt: 'Haben Sie manchmal einen zweiten Finger oder eine zweite Hand bei der Finger-Tapping-Aufgabe verwendet?',
  buttons: ["Nein, niemals", "Nur bei den schwierigsten Versuchen", "Nur bei den einfachsten Versuchen", "Ja, fast immer"]
},
{
  prompt: 'Was ist das Ziel dieses ersten Gedächtnistests?',
  buttons: ['Nur für bestimmte Kategorien antworten', 'Sich an die richtige Antwort für jedes Bild erinnern']
},
{
  prompt: 'Was ist das Ziel dieses zweiten Gedächtnistests?',
  buttons: ['Sich an die durchschnittlichen Punkte für jedes Bild erinnern', 'Nur für bestimmte Kategorien antworten']
},
]

lang.gender_stimulus = 'Was ist Ihr Geschlecht?'
lang.gender_choices = ['Möchte ich nicht sagen', 'Weiblich', 'Männlich', 'Nicht-binär', 'Andere']
lang.gender_continue = 'Wählen Sie eine Antwort, um fortzufahren...';

lang.age_prompt = 'Wie alt sind Sie?    '
lang.age_continue = 'Klicken Sie hier, um fortzufahren...';


// Abschließende Fragebögen

// iLOC4
lang.ieLOC = {
  preamble: 'Die folgenden Aussagen können mehr oder weniger auf Sie zutreffen. Inwieweit glauben Sie, dass jede Aussage auf Sie persönlich zutrifft?',
  labels: ["überhaupt nicht", "ein bisschen", "etwas", "meistens", "vollständig"],
  questions: ["Ich bin mein eigener Chef.", "Wenn ich hart arbeite, werde ich Erfolg haben.",
    "Ob bei der Arbeit oder im Privatleben: Was ich tue, wird hauptsächlich von anderen bestimmt",
    "Das Schicksal kommt oft meinen Plänen in die Quere."
  ]
}

lang.medications = {
  preamble: 'Werden Sie derzeit mit einem oder mehreren der folgenden Medikamente behandelt?',
  labels: ["nein", "möchte nicht angeben<br>Ich weiß es nicht", "ja"],
  questions: ["Antidepressiva (Beispiel: Zoloft, Celexa, Prozac)", "Angstlösende Mittel (Beispiel: Xanax, Valium, Klonopin)",
    "Antipsychotika (Beispiel: Risperdal, Zyprexa, Abilify, Clozaril)", "Psychostimulanzien (Beispiel: Ritalin, Adderall)",
    "Antiparkinson-Mittel (Beispiel: L-DOPA, Selegilin)"
  ]
}

lang.medState = [
  { prompt: "Wie lange ist es her, seit Sie Ihre letzte Dosis eingenommen haben? (Anti-Parkinson-Behandlung)", name: 'timeSinceMed', labels: ["weniger als 1 Stunde", "1-2 Stunden", "2-3 Stunden", "3-4 Stunden", "4-5 Stunden", "5-6 Stunden", "7-8 Stunden", "mehr als 8 Stunden"] },
  { prompt: "Wie fühlen Sie sich auf der <b>motorischen</b> Ebene?", name: 'motorMed', labels: ["Sehr untermediziert", "Etwas untermediziert", "Genau richtig", "Etwas übermediziert", "Sehr übermediziert"] },
  { prompt: "Wie fühlen Sie sich auf der <b>kognitiven</b> Ebene?", name: 'cognitiveMed', labels: ["Sehr untermediziert", "Etwas untermediziert", "Genau richtig", "Etwas übermediziert", "Sehr übermediziert"] },
]
lang.medStateContinue='Fortsetzen'

lang.drugs = {
  preamble: 'Verwenden Sie derzeit die folgenden Substanzen...',
  labels: ["nie", "manchmal", "möchte nicht angeben", "oft", "jeden Tag"],
  questions: ["Koffein", "Tabak", "Alkohol", "Marihuana"]
}

lang.additional_questions = [{
  prompt: 'Im Auto sind Sie lieber der Fahrer oder der Beifahrer?',
  buttons: ['Fahrer, völlig', 'Fahrer, leicht', 'gleichgültig', 'Beifahrer, leicht', 'Beifahrer, völlig']
},
{
  prompt: 'Informieren Sie sich lieber im Internet oder sehen Sie fern?',
  buttons: ["Fernsehen, völlig", "Fernsehen, leicht", "gleichgültig", "Im Internet surfen, leicht", "Im Internet surfen, völlig"]
},
{
  prompt: 'In einem Casino würden Sie lieber Poker oder Spielautomaten spielen?',
  buttons: ["Spielautomat, völlig", "Spielautomat, leicht", "gleichgültig", "Poker, leicht", "Poker, völlig"]
},
{
  prompt: "Im Allgemeinen würden Sie sagen, dass Sie besser im Sprechen oder Zuhören sind?",
  buttons: ["Sprechen, völlig", "Sprechen, leicht", "gleichgültig", "Zuhören, leicht", "Zuhören, völlig"]
}
]

lang.feedback_questions = [{
  prompt: 'Wie sehr hat Ihnen dieses Experiment insgesamt gefallen?',
  buttons: ['schrecklich', 'schlecht', 'mittel', 'gut', 'großartig']
},
{
  prompt: 'Wären Sie bereit, es an einem anderen Tag wieder zu machen?',
  buttons: ["nein", "wahrscheinlich nicht", "Ich weiß es nicht", "wahrscheinlich", "sicherlich"]
},
]

lang.ftp_start = {
  divs: [
    {
      text: "Großartig. Wir werden in wenigen Minuten zum Lernspiel zurückkehren, um zu testen, ob Sie sich an die gerade gelernten Verknüpfungen erinnern können.",
    },
    {
      text: "Aber jetzt machen wir einen sehr einfachen 'Finger Tapping'-Test.<br>In diesem Test verwenden Sie 4 Tasten Ihrer Tastatur: die Tasten 1, 5, 6 und 0 über den Buchstaben <u>wie in blau in der Abbildung unten angegeben</u> (verwenden Sie nicht das Ziffernfeld).",
      image: "./FTP_assets/FTP_keyboardNumbers.png"
    },
    {
      text: "Sie werden 8 Versuche von jeweils 30 Sekunden machen. Während jedes Versuchs verwenden Sie den <u>Zeigefinger</u> Ihrer linken <u>oder</u> rechten Hand. <br>Verwenden Sie weder beide Hände noch einen anderen Finger als den Zeigefinger, da dies das Experiment ungültig machen würde.<br>Ein <b>Ton signalisiert das Ende</b> jedes Versuchs, sodass Sie nicht auf den Bildschirm schauen müssen.",
    },
   {
      text: "Je nach Versuch wird Ihr <b>Ziel</b> sein, <b>so schnell wie möglich zwischen den Tasten 0 und 1</b> oder 5 und 6 zu <b>wechseln</b>. Dabei verwenden Sie entweder Ihren linken <u>oder</u> rechten Zeigefinger.",
    },
  ],
  continue: 'Klicken Sie hier, um eine kurze Demo anzusehen'
}

lang.ftp_prompt = 'Verwenden Sie nur Ihren rechten Zeigefinger'
lang.ftp_spacebar = 'Drücken Sie die Leertaste, um fortzufahren' // neu
lang.ftp_alternate = "Sie müssen weiterhin zwischen den Tasten wechseln, bis die Zeitleiste abgelaufen ist" // neu
lang.ftp_demo_msg = 'Demo-Versuch (schauen Sie einfach hin)' // neu
lang.ftp_demo_multi = ["Wenn Sie aufgefordert werden, ", " und ", " mit Ihrem "," Finger zu drücken"]
lang.ftp_multi1=['Für diesen Versuch wechseln Sie zwischen den Tasten ', ' und ']
lang.ftp_multi2=["nur mit Ihrem "," Finger"]
lang.ftp_fingernames=["linken", "rechten"]

lang.ftp_time = 'Verbleibende Zeit'
lang.ftp_targets = 'Ziele'

lang.end_wait = "Bitte warten Sie, die Daten werden hochgeladen..."
lang.end_quit = "Vielen Dank! Schließen Sie dieses Fenster nicht. <br> Drücken Sie eine beliebige Taste, um zum Hauptbildschirm zurückzukehren."
