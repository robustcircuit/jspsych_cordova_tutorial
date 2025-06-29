

var lang = {};

lang.alert_consent = 'You must tick the checkbox to continue with the study.'
lang.end_wait = 'Redirecting...'
lang.reject_message = 'Sorry, you need your device is not compatible with this experiment.<br> Please use a desktop or a laptop...';
lang.waitbefore_continue = "Wait before continuing...";
lang.end_screen = 'The data has been uploaded. <br>Thanks for your participation! <br> <b>Press any key</b> and wait to be redirected...'

lang.textFeedback = ["No valid response","Incorrect", "Correct", "Correct"];

// continue/back buttons
next_text = "Next →";
back_text = "← Back";
continue_text = "Continue →";

// welcome slide
var response_instruction
var tip_question
if (expdef.mobileSession) {
  response_instruction = "<p>Touch one of the three responses buttons below the image to select your response.</p>";
  tip_question="Tap twice on an option to confirm"
} else {
  if (expdef.keyMode=='mouse'){
    response_instruction = "<p>Click on one of the three responses buttons below the image to select your response.</p>";
    tip_question="Click twice on an option to confirm"
  } else {
    response_instruction = "<p>Use the <strong>left, down or right</strong> arrows of your keyboard to select your response.</p>";
    tip_question="Click twice on an option to confirm"
  }
}
lang.welcome1_show = {
  title: 'Welcome to the Image-Response association game',
  divs: [
    {
      html: "<p>In this game, you will be presented with various images. " +
      "Each image is associated with only <b>one</b> correct response that you will have to discover by trial and error.</p>" +
      "<p>The game will look like this:</p>",
      class: "jspsych-text-simple w-75"
    },
    {
      html: `<img src=${stimdef.pathInstructionImage}>`,
      class: "jspsych-image-simple w-25 mb-5"
    },
    {
      html: response_instruction,
      class: "jspsych-text-simple w-75"
    },
  ],
  next: next_text,
}

lang.welcome2_show = {
  divs: [
    {
      html: "<p>The game will be divided in several blocks involving different categories of images. " +
      "<br></p>Blocks may involve 2, 3, 4 or 5 images.</p>"+
      "Blocks will change once you have learned the good responses for each image, so being attentive is key!",
      class: "jspsych-text-simple w-75 fs-4 mb-5",
    },
    {
      html: "<p>Four important things to keep in mind:" +
      "<br>-There is only ONE correct response per image." +
      "<br>-The correct response of each image NEVER changes within a block." +
      "<br>-The SAME response can be the correct one for different images within a block." +
      "<br>-You have only TWO seconds to give a response once images appear.</p>",
      class: "jspsych-text-simple w-75 fs-4",
    },
  ],
  next: next_text,
  min_duration: 8000
}

lang.welcome_check = {
  prompt: 'Select the correct statement',
  prompt_class: 'jspsych-prompt-simple',
  options: [
    {
      html: "Different images can be associated with the same response",
    },
    {
      html: "Different images are always associated with different responses",
    },
  ],
  options_class: 'jspsych-answer-simple',
  correct_response: 0,
  tip: tip_question
}

lang.training_show = {
  divs: [
    {
      html: "<p>Great! You will now train a little before the main experiment." +
      "<br>Try to discover the correct response for each image!",
      class: "jspsych-text-simple w-75 fs-4"
    },
  ],
  next: continue_text,
  min_duration: 2000
}

lang.main_show = {
  divs: [
    {
      html: "<p>You are now ready to start the main experiment." +
      "<br>Try to discover the correct response for each image!",
      class: "jspsych-text-simple w-75 fs-4 mb-2"
    },
    {
      html: "<p>Remember:" +
      "<br>-There is only ONE correct response per image." +
      "<br>-The correct response of each image NEVER changes within a block." +
      "<br>-The SAME response can be the correct one for different images within a block." +
      "<br>-You have only TWO seconds to give a response once images appear.</p>",
      class: "jspsych-text-simple w-75 fs-4"
    },
  ],
  next: continue_text,
  min_duration: 4000
}

lang.preblock_show = {
  divs: [
    {
      html: "<p>You are about to start a new block with the following images.</p>",
      class: "jspsych-text-simple w-75 text-center"
    },
    {
      inputArrayIdx: 0,
      class: "jspsych-row-simple w-75"
    },    
    {
      html: "<p>Stay focused until it is done.</p>",
      class: "jspsych-text-simple w-75 text-center"
    },
  ],
  next: next_text,
  min_duration: expdef.timings.preblock.timerDur,
}

lang.final_show = {
  divs: [
    {
      html: "Please wait, the data is being uploaded...",
      class: "jspsych-text-simple w-75 text-center"
    },
  ],
  min_duration: 20000
}

lang.end_show = {
  divs: [
    {
      html: "Thank you for you partipation, you may close this window",
      class: "jspsych-text-simple w-75 text-center"
    },
  ],
  max_duration: 2000
}

/*
lang.welcome1_title = 'Welcome to the Image-Response association game';
lang.welcome1_box1 = "In this game, you will be presented with various images. " +
  "Each image is associated with only <b>one</b> correct response that you will have to discover by trial and error.";
lang.welcome1_box2 = 'The game will look like this:'
lang.welcome1_box3 = "You have three response buttons: " + variable_text;
lang.welcome1_box4 = "Your goal is to find the correct button for each image."
if (expdef.mobileSession) {
  lang.welcome1_arrowleft = '';
  lang.welcome1_arrowright = '';
  lang.welcome1_continue = "<b>Tap here to continue..</b>"
} else {
  lang.welcome1_arrowleft = '';
  lang.welcome1_arrowright = '';
  lang.welcome1_continue = "<b>Right arrow or click to continue...</b>"
}

// 
lang.welcome2_box1 = "The game will be divided in several blocks involving different categories of images. " +
  "<br>First, you will train in a block with only 2 images. <br>Later, during the main game, blocks may involve 2, 3, 4 or 5 images.";
lang.welcome2_box2 = "Blocks will change once you have learned the good responses for each image, so being attentive is key!"
lang.welcome2_box3 = "Four important things to keep in mind:" +
  "<br>-There is only ONE correct response per image." +
  "<br>-The correct response of each image NEVER changes within a block." +
  "<br>-The SAME response can be the correct one for different images within a block." +
  "<br>-You have only TWO seconds to give a response once images appear."


if (expdef.mobileSession) {
  lang.welcome2_continue = "<b>Tap here to train..</b>"
} else {
  lang.welcome2_continue = "<b>Right arrow or click to train...</b>"
}

//
lang.beforemain_box1 = "You are done with the training!"
lang.beforemain_box2 = "Start the main experiment whenever you are ready!"
lang.beforemain_box3 = "Four important things to keep in mind:" +
  "<br>-There is only ONE correct response per image." +
  "<br>-The correct response of each image NEVER changes within a block." +
  "<br>-The SAME response can be correct one for different images within a block." +
  "<br>-You have only TWO seconds to give a response once images appear."
if (expdef.mobileSession) {
  lang.beforemain_continue = "<b>Tap here to start..</b>"
} else {
  lang.beforemain_continue = "<b>Right arrow or click to start...</b>"
}
*/
// 
lang.preblock_box1 = "You are about to start a new block with the following images."
lang.preblock_box2 = "Stay focused once you have started it! "
if (expdef.mobileSession) {
  lang.preblock_continue = "<b>Tap here to start..</b>"
} else {
  lang.preblock_continue = "<b>Right arrow or click to start...</b>"
}

// 
lang.end_wait = "Please wait, the data is being uploaded..."
lang.end_quit = "Thank you! Do not close this window. <br> Press any key to return to the main screen."