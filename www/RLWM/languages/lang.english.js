
function getLanguage(expdef,stimdef){

  var lang = {};

  lang.alert_consent = 'You must tick the checkbox to continue with the study.'
  lang.end_wait = 'Redirecting...'
  lang.reject_message = 'Sorry, you need your device is not compatible with this experiment.<br> Please use a desktop or a laptop...';
  lang.waitbefore_continue = "Wait before continuing...";
  lang.end_screen = 'The data has been uploaded. <br>Thanks for your participation! <br> <b>Press any key</b> and wait to be redirected...'

  lang.textFeedback = ['No valid response', 'Incorrect', `Correct +${expdef.feedbackValues[0]}`, `Correct +${expdef.feedbackValues[1]}`];

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
    min_duration: 8000*expdef.decimateDurations
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
    min_duration: 2000*expdef.decimateDurations
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
    min_duration: 4000*expdef.decimateDurations
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
    min_duration: expdef.timings.preblock.timerDur*expdef.decimateDurations,
    max_duration: (expdef.decimateDurations<1) ? 100000000 : (expdef.timings.preblock.timerDur*expdef.decimateDurations)+100
  }

  lang.final_show = {
    divs: [
      {
        html: "Please wait, the data is being uploaded...",
        class: "jspsych-text-simple w-75 text-center"
      },
    ],
    min_duration: 20000*expdef.decimateDurations
  }

  lang.end_show = {
    divs: [
      {
        html: "Thank you for you partipation, you may close this window",
        class: "jspsych-text-simple w-75 text-center"
      },
    ],
    max_duration: 2000*expdef.decimateDurations
  }

  return lang

}
