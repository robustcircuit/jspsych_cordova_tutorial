
// Get location with respect to main process
/*
const currentScript = document.currentScript;
const scriptUrl = new URL(currentScript.src);
const scriptPath = scriptUrl.pathname;
console.log('Full script path:', scriptPath);
console.log('Base URL:', baseUrl);
const parts = scriptPath.split('/');
const selfFolder = parts[parts.length - 2];
*/
function runExperiment(){

  var selfFolder='RLWM'

  if (typeof socket === 'undefined') {
    let socket
  }

  ///////
  const consoleLog=true

  var runMode="normal"
  //
  if (urlParams.has('RUN_MODE')) {
    runMode = urlParams.get('RUN_MODE');
  }

  try {
    document.getElementById('auth-container').classList.add('d-none');
    document.getElementById('nav-bar').classList.add('d-none');
    document.getElementById('jspsych-body').classList.remove('d-none');
  } catch {console.error}

  ////////////////////////////////////////////////////////////////////
  //// Experiment settings
  ////////////////////////////////////////////////////////////////////
  var expdef={
    // identifiers (may be replaced later)
    sessionId: uuid16Base64(),
    studyId: uuid16Base64(),
    subjectId: uuid16Base64(),
    experimentName: 'RLWM',
    env: {CONTEXT: 'web'},
    sent: 0,
    // general settings
    nrepeats:10,
    toleranceAvgDistanceRepetition:0.25,
    feedbackValues: [1,2],
    keyMode: 'keyboard',
    instructionMouse: true,
    keyCodes: ['ArrowLeft', 'ArrowDown', 'ArrowRight'],
    keyBack: 'ArrowLeft',
    keyNext: 'ArrowRight',
    screen: {
      width: 1920,
      height: 1080
    },
    timings: {
      preblock: {
        timerDur: 4000
      },
      fixation: {
        fixDur: [500,1000],
      },
      RLWMlearning: {
        postResponseDur: 200,
        feedbackDur: 100,
        fadeInDur: 100, // fade in of learning trials
        responseTimeout: 2500,
      },
      progress: {
        updateDur: 800
      }
    },
    language: "english",
    mobileSession: false,
    jspsychParentDiv:'jspsych-body',
    tags2save: ["RLWMlearning","browserinfo"],
    runMode: runMode,
    decimateDurations: 1.0,
    sendInterval: 5000,
    type: 'expdef'
  }


  ////////////////////////////////////////////////////////////////////
  //// Experiment settings
  ////////////////////////////////////////////////////////////////////

  var jsPsych = initJsPsych({
    display_element: expdef.jspsychParentDiv,
    on_trial_finish: function(data) {

    },
  });



  const progress_init={
    // identifiers (may be replaced by URLparameters)
    sessionId: expdef.sessionId,
    studyId: expdef.studyId,
    experimentName: 'RLWM',
    sent: 0,
    // 
    sumCorrect: 0,
    doneFraction: 0,
    guessedAccuracy: 0.75,
    expectedAccuracy: 0.75,
    accumulatedAccuracy: 0.75,
    cumreward: 0,
    tNum:0,
    tTestNum: 0,
    tblockNum:0,
    bNum:0,
    barUpdate:false,
    currentBarWidth:0.01,
    fetched: {images: false, language: false},
    currentSVG: undefined,
    type: 'progress'
  }

  var progress = structuredClone(progress_init);

  // check platform
  if (typeof cordova!=='undefined' && cordova?.platformId=='android'){
    const accelDisplay = d3.select('#'+expdef.jspsychParentDiv)
    .append("div")
    .attr("id", "accel-display")
    .style("position", "fixed")
    .style("top", "10px")
    .style("left", "10px")
    .style("background", "rgba(0, 0, 0, 0.7)")
    .style("color", "white")
    .style("padding", "10px")
    .style("font-family", "monospace")
    .style("border-radius", "4px")
    .style("z-index", "9999");
    setInterval(async ()=>{
      const result = await reportAcceleration();
      if (result.status=='data'){
        // Update the div content using D3
        d3.select("#accel-display").html(
            `X: ${result.x.toFixed(2)}<br>
              Y: ${result.y.toFixed(2)}<br>
              Z: ${result.z.toFixed(2)}`
        );
      }
    },500)
  }

  ////////////////////////////////////////////////////////////////////
  //// Stimulus definition
  ////////////////////////////////////////////////////////////////////

  var stimdef = {
    // identifiers (may be replaced by URLparameters)
    sessionId: expdef.sessionId,
    studyId: expdef.studyId,
    experimentName: 'RLWM',
    sent: 0,
    // Paths
    imagesFolder:`${selfFolder}/imgsets`,
    pathLearningTrial: `${selfFolder}/assets/learningtrial_${expdef.screen.width}x${expdef.screen.height}.svg`,
    pathProgressbar: `${selfFolder}/assets/progressbar_overall.svg`,
    pathInstructionImage: `${selfFolder}/assets/instruction_example.svg`,
    // SVG General
    idMain: '#svgview',
    idFixation: "#fixation",
    // SVG Progress bar
    idProgress: '#progressbar',
    idProgressFrame: '#progressframe',
    // RLWMlearning plugin
    RLWMlearning: {
      idRespBoxes: ['#leftresp', '#centerresp', '#rightresp'],
      idRespBoxesText: ['#lefttext', '#centertext', '#righttext'],
      idFeedback: ['#noresponse','#incorrect', '#correctNormal', '#correctExtra'],
      idFeedbackText: ['#noresponseText','#incorrectText', '#correctNormalText', '#correctExtraText'],
      idFeedbackRect: ['#noresponseRect','#incorrectRect', '#correctNormalRect', '#correctExtraRect'],
      idTargetLearning:'#targetimage',
      // Dynamic SVG properties
      idRespBoxesColor: ['#6a6a6a','#c64040', '#badc66', '#66dc6a'],
      idRespBoxesOpacity: ['0.2', '0.6'],
    },
    type: 'stimdef'
  }

  // set and randomize categories included in the experiment
  let categories
  if (expdef.runMode=='quicktest'){
      categories = ["bird"]
  } else {
      categories = ["bird","sports", "kitchen","lighting","watercraft","container", "construction","dessert", "fruit", "instrument", "vegetable", "vehicle", "electronic"]
  }

  stimdef.categories = jsPsych.randomization.repeat(categories, 1);

  // set blockTypes
  var blockTypes = [
    {"setSize": 2,"correctAction": [0,1],"phase": "learn"},
    {"setSize": 2,"correctAction": [1,2],"phase": "learn"},
    {"setSize": 3,"correctAction": [0,1,2],"phase": "learn"},
    {"setSize": 3,"correctAction": [1,1,2],"phase": "learn"},
    {"setSize": 3,"correctAction": [0,0,2],"phase": "learn"},
    {"setSize": 4,"correctAction": [0,1,2,2],"phase": "learn"},   
    {"setSize": 4,"correctAction": [0,1,1,2],"phase": "learn"},    
    {"setSize": 4,"correctAction": [0,0,1,2],"phase": "learn"},
    {"setSize": 5,"correctAction": [0,0,1,2,2],"phase": "learn"},    
    {"setSize": 5,"correctAction": [0,1,1,2,2],"phase": "learn"},
    {"setSize": 5,"correctAction": [0,0,1,1,2],"phase": "learn"},
    {"setSize": 6,"correctAction": [0,0,1,1,2,2],"phase": "learn"},    
    {"setSize": 6,"correctAction": [0,0,1,1,2,2],"phase": "learn"},
  ]

  blockTypes=blockTypes.slice(0,categories.length)

  stimdef.blockTypes = jsPsych.randomization.repeat(blockTypes, 1);

  // ensure that blockTypes and categories have the same length
  if (stimdef.categories.length !== stimdef.blockTypes.length) {
    throw new Error(`Mismatch: categories (${stimdef.categories.length}) and blockTypes (${stimdef.blockTypes.length}) must be the same length.`);
  }
  // assign categories of images to blocks
  stimdef.categories.forEach((catname,catidx)=>{
    stimdef.blockTypes[catidx]["category"]=catname
  })

  // add training block to the array of blocks
  trainingBlock=[{
    "setSize": 2,
    "correctAction": [0,2],
    "category": "hardware",
    "phase": "train",
  }]
  expdef.totalTrainNum=trainingBlock[0]["setSize"]*expdef.nrepeats

  stimdef.blockTypes = trainingBlock.concat(stimdef.blockTypes); // join them back

  // assign images to each block, create path array for preloading and construct pseudorandomized trial list for each block)
  stimdef.imagesPreloadPaths=[]
  expdef.totaltrialNum=0
  expdef.maxReward=0
  fetch(`${baseUrl}/api/getEnv`)
  .then(res=>res.json())
  .then(async (env) => {
    expdef.env=env
    for (let blockidx = 0; blockidx < stimdef.blockTypes.length; blockidx++) {
      block=stimdef.blockTypes[blockidx]
      var catname=block.category
      folder_path=`${stimdef.imagesFolder}/${catname}`
      await fetch(`${baseUrl}/api/getFiles?folder=${folder_path}`)
      .then(res => res.json())
      .then(images => {
        var shuffledImages = jsPsych.randomization.repeat(images, 1);
        block.images=[]
        shuffledImages.forEach((imgfile,imgidx)=>{
          if (imgidx<block.setSize){
            block.images.push(`${stimdef.imagesFolder}/${catname}/${imgfile}`)
            stimdef.imagesPreloadPaths.push(`${stimdef.imagesFolder}/${catname}/${imgfile}`)
          }
        })
        // randomize image sequence until the average spacing
        // between image repetitions matches setSize+-tolerance
        var spacingCondition=false
        var tryImages=[]
        while (!spacingCondition){
          tryImages=[]
          block.images.forEach((img,imgidx)=>{
          for (let i = 0; i < expdef.nrepeats; i++) {
              tryImages.push(imgidx)
            }
          })
          tryImages = jsPsych.randomization.repeat(tryImages, 1);
          let lastSeen = {};
          let gaps = {};
          tryImages.forEach((imgidx, i) => {
            if (lastSeen[imgidx] !== undefined) {
              let gap = i - lastSeen[imgidx];
              if (!gaps[imgidx]) gaps[imgidx] = [];
              gaps[imgidx].push(gap);
            }
            lastSeen[imgidx] = i;
          });
          // Check if all average gaps are within setSize ± 0.25
          spacingCondition = Object.values(gaps).every(gapList => {
            let avgGap = gapList.reduce((a, b) => a + b, 0) / gapList.length;
            return avgGap >= (block.setSize - expdef.toleranceAvgDistanceRepetition) && avgGap <= (block.setSize + expdef.toleranceAvgDistanceRepetition);
          });
        }
        // Build trial array based on pseudorandomized image sequence
        tryTrials = tryImages.map((imgidx,tblockNum) => ({
          image: block.images[imgidx],
          correctAction: block.correctAction[imgidx],
          tblockNum: tblockNum,
          tNum: expdef.totaltrialNum+tblockNum,
          correctFeedback: imgidx % 2,
          setSize: block.images.length,
          imgIdx:imgidx,
          phase: block.phase
        }));
        expdef.totaltrialNum+=tryTrials.length
        block.trials=tryTrials
        block.trials.forEach((trial,tidx)=>{
          if (block.phase=="learn"){
            expdef.maxReward+=expdef.feedbackValues[trial.correctFeedback],
            stimdef.blockTypes[blockidx].trials[tidx].maxReward=expdef.maxReward
          } else {
            stimdef.blockTypes[blockidx].trials[tidx].maxReward=0       
          }
        })
      });
      if (blockidx==stimdef.blockTypes.length-1){
        // log to console if requested
        consoleLog && console.log('Blocks\n', stimdef.blockTypes);
        progress.fetched.images=true
      }
    }
  })

  ////////////////////////////////////////////////////////////////////
  //// Gather URL parameters
  ////////////////////////////////////////////////////////////////////
  //
  if (urlParams.has('LANGUAGE')) {
    expdef.language = urlParams.get('LANGUAGE');
  }
  //
  if (urlParams.has('SUBJECT_ID')) {
    expdef.subjectId = urlParams.get('SUBJECT_ID');
    stimdef.subjectId = urlParams.get('SUBJECT_ID');
    progress.subjectId = urlParams.get('SUBJECT_ID');
  } 
  
  if (urlParams.has('PROLIFIC_PID')) {
    expdef.prolificId = urlParams.get('PROLIFIC_PID');
    stimdef.prolificId = expdef.prolificId
    progress.prolificId = expdef.prolificId
  }
  //
  if (urlParams.has('SESSION_ID')) {
    expdef.sessionId = urlParams.get('SESSION_ID');
    stimdef.sessionId = urlParams.get('SESSION_ID');
    progress.sessionId = urlParams.get('SESSION_ID');
  }
  //
  if (urlParams.has('STUDY_ID')) {
    expdef.studyId = urlParams.get('STUDY_ID');
    stimdef.studyId = urlParams.get('STUDY_ID');
    progress.studyId = urlParams.get('STUDY_ID');
  }

  ////////////////////////////////////////////////////////////////////
  //// Trial definitions
  ////////////////////////////////////////////////////////////////////

  // preload trial
  var trial_preload = {
      type: jsPsychPreload,
      images: stimdef.imagesPreloadPaths,
  }

  var trial_consent = {
    type: jsPsychExternalHtml,
    url: function () {
      return `${selfFolder}/html/simple_consent_${expdef.language}.html`
    },
    cont_btn: 'start',
    check_fn: function () {
      if (document.getElementById('consent_checkbox').checked) {
        return true;
      } else {
        alert(lang.alert_consent)
      }
    },
    on_finish: function () {
      jsPsych
        .data
        .get()
        .addToLast({
          trialTag: 'consent'
      })
    }
  };

  // load SVG
  var loadSVG_func = {
    type: jsPsychCallFunction,
    async: true,
    func: function (done) {
      var mainsvg = undefined
      if (!d3.select("#jspsych-svg").empty()) {
        d3.select("#jspsych-svg").remove()
      }
      Promise
        .all([
          d3.select('#'+expdef.jspsychParentDiv)
          .append('div')
          .attr('id', 'jspsych-svg')
          .style('position', 'absolute')
          .style('top', '0px')
          .style('left', '0px')
          .style('width', '100%')
          .style('height', '100%')
          .style('z-index', '1000'),
          mainsvg = d3.select("#jspsych-svg").append("svg")
            .attr("viewBox", `0 0 ${expdef.screen.width} ${expdef.screen.height}`)
            .attr("width", "100%").attr("height", "100%")
            .style("top", "0%").style('left', '0%')
            .style('position', 'absolute')
            .attr("id", "globalsvg")
            .attr("stimpath", progress.currentSVG),
          d3.xml(progress.currentSVG)
          .then(data => {
            mainsvg.node().append(data.documentElement)
            d3.select(stimdef.idMain).attr('opacity', '0')
            d3.select(stimdef.idFixation).attr('opacity', '0')
            stimdef.RLWMlearning.idFeedbackRect.forEach((rectId,rectIdx)=>{
              const rect = d3.select(rectId);
              const rectX = +rect.attr("x");
              const rectWidth = +rect.attr("width");
              const centerX = rectX + rectWidth / 2;
              rect.style('fill', stimdef.RLWMlearning.idRespBoxesColor[rectIdx])
              d3.select(stimdef.RLWMlearning.idFeedbackText[rectIdx])
                .text(lang.textFeedback[rectIdx])
                .attr("x", centerX)
                .attr("text-anchor", "middle"); // Ensures text is centered around its x
            })
            d3.select(stimdef.idFixation).attr('opacity', '0')
            if (!progress.barUpdate){
              d3.select(stimdef.idProgress).attr('opacity', '0')
              d3.select(stimdef.idProgressFrame).attr('opacity', '0')
            } else {
              d3.select(stimdef.idProgress).attr('opacity', '1')
              d3.select(stimdef.idProgressFrame).attr('opacity', '1')
            }
            d3.select(stimdef.idProgress).attr('width', progress.currentBarWidth.toString())
          })
        ])
        .then(() => {
          done()
        })
    },
  }

  // unloadSVG
  var unloadSVG = {
      type: jsPsychCallFunction,
      async: true,
      func: function (done) {
        d3.select("#globalsvg").remove();
        done();
      },
      on_timeline_finish: function () {},
  };

  var updateProgress = {
    type: jsPsychCallFunction,
    async: true,
    func: function (done) {
      async function progressBarUpdate(trialdata) {
        var current_width = Number(d3.select(stimdef.idProgress).attr('width'));
        var progressbar_fullLength = Number(d3.select(stimdef.idProgressFrame).attr('width'))

        var expectedMaxRewards=(1-progress.doneFraction)*(expdef.maxReward*progress.expectedAccuracy)+progress.doneFraction*(expdef.maxReward*progress.accumulatedAccuracy)

        var point2bar = progressbar_fullLength / expectedMaxRewards;

        var expected_width = point2bar*expectedMaxRewards*progress.doneFraction;

        if (trialdata.feedback>0){
          expected_width+=expdef.feedbackValues[trialdata.feedback-1]*point2bar
        }

        var delta_width = expected_width - current_width;

        var next_width = current_width + delta_width;

        progress.currentBarWidth=next_width

        await new Promise(resolve => {
          d3.select(stimdef.idProgress)
            .transition().duration(100*expdef.decimateDurations).attr('width', next_width.toString())
            .transition().duration(expdef.timings.progress.updateDur - 200*expdef.decimateDurations)
            .style('fill', stimdef.RLWMlearning.idRespBoxesColor[trialdata.feedback + 1])
            .on("end", () => {
              d3.select(stimdef.idProgress)
                .transition().duration(100)
                .style('fill', "#ffffffff")
                .on("end", resolve); // Resolve after the final fill transition
            });
        });
      }
      var trialdata = jsPsych.data.getLastTrialData().trials[0]
      if ((progress.barUpdate && trialdata.correct>0) | (progress.tNum>=expdef.totaltrialNum-1)){
        progressBarUpdate(trialdata).then(done)
      } else {
        jsPsych.pluginAPI.setTimeout(()=>{
          done()
        }, expdef.timings.progress.updateDur)
      }
    },
  }

  // enter fullscreen
  var enter_fullscreen = {
    type: jsPsychFullscreen,
    fullscreen_mode: true,
    message: function () {
      return lang.fullscreen_msg;
    },
    button_label: function () {
      return lang.fullscreen_continue;
    },
    on_start: function () {
      document.body.addEventListener("wheel", (e) => {
        if (e.ctrlKey) e.preventDefault(); //prevent zoom
      });
      window.addEventListener(
        "mousewheel",
        function (e) {
          e.preventDefault();
        },
        {
          passive: false,
        }
      );
      document.body.addEventListener("contextmenu", (e) => {
        e.preventDefault();
      });
    },
    on_finish: function () {
      if (expdef.mobileSession) {
        expdef.screen.width=1080
        expdef.screen.height=1920
        screen.orientation.lock("portrait");
      }
    },
  };
  // exit fullscreen
  var exit_fullscreen = {
    type: jsPsychFullscreen,
    fullscreen_mode: false,
    on_finish: function () {
      if (expdef.mobileSession) {
        screen.orientation.unlock();
      }
    },
  };

  // browser check
  var browsercheck_trial = {
    type: jsPsychBrowserCheck,
    on_finish: function (data) {
      expdef.mobileSession = data.mobile;      
      if (expdef.mobileSession) {
        expdef.keyMode = 'touch'
      }
      stimdef.pathLearningTrial=`${selfFolder}/assets/learningtrial_${expdef.screen.width}x${expdef.screen.height}.svg`
      progress.currentSVG=stimdef.pathLearningTrial
      jsPsych
        .data
        .get()
        .addToLast({ trialTag: 'browserinfo' })
      if (expdef.mobileSession) {
        screen.orientation.lock("portrait");
      }
    }
  };

  // fixation cross
  var fixation_trial = {
    type: jsPsychSVGfixation,
    expdef: function(){
      return expdef
    },
    stimdef: function(){
      return stimdef
  },
    fix_duration: function(){
      if (typeof expdef.timings.fixation.fixDur === 'number') {
        return expdef.timings.fixation.fixDur
      } else if (Array.isArray(expdef.timings.fixation.fixDur) && expdef.timings.fixation.fixDur.length === 2){
        return jsPsych.randomization.randomInt(expdef.timings.fixation.fixDur[0],expdef.timings.fixation.fixDur[1])
      }
    }
  };

  // learning trial
  var learning_trial = {
    type: jsPsychRLWMlearning,
    expdef: function(){
      return expdef
    },
    stimdef: function(){
      return stimdef
    },
    name: "learningtrial",
    correctResponse: function () {
      return stimdef.blockTypes[progress.bNum].trials[progress.tblockNum].correctAction
    },
    correctFeedback: function () {
      return stimdef.blockTypes[progress.bNum].trials[progress.tblockNum].correctFeedback
    },
    trialMode: function () {
      return stimdef.blockTypes[progress.bNum].phase
    },
    imagePath: function () {
      return stimdef.blockTypes[progress.bNum].trials[progress.tblockNum].image
    },
    on_finish: function (trialdata) {
      //
      trialdata.tNum=progress.tNum
      addItem('trials', trialdata)
      progress.tblockNum += 1;
      progress.tNum += 1;
      if (stimdef.blockTypes[progress.bNum].phase=="learn"){
        progress.tTestNum += 1;
        if (trialdata.correct > 0) {
          progress.sumCorrect += 1
        }
        progress.accumulatedAccuracy = (progress.sumCorrect / (progress.tTestNum));
        progress.expectedAccuracy = (1 - progress.doneFraction) * progress.guessedAccuracy + progress.doneFraction * progress.accumulatedAccuracy;
        if (trialdata.correct > 0) {
          progress.cumreward = progress.cumreward + expdef.feedbackValues[trialdata.correct_feedback];
        }
        progress.doneFraction = (progress.tTestNum) / (expdef.totaltrialNum-expdef.totalTrainNum);
      }

    }
  }
  var learning_block = {
    name: "learningblock",
    timeline: [
      fixation_trial,learning_trial, updateProgress,
    ],
    on_timeline_start: function(){
      if (expdef.keyMode!="mouse"){
        document.body.style.cursor = 'none';
      }
    },
    loop_function: function () {
      if (progress.tblockNum == stimdef.blockTypes[progress.bNum].trials.length-1) {
        progress.bNum+=1
        progress.tblockNum=0
        return false
      } else {
        progress.tblockNum+1
        return true
      }
    }
  }


  var instruction_show = {
    type: jsPsychFlexInstruction,
    expdef: function(){
      return expdef
    },
    stimdef: function(){
      return stimdef
    },
    content: function () {
      return instruction_list[instruction_idx];
    },
    trialTag: function () {
      return "instruction-show";
    },
    on_finish: function(){
      if (instruction_idx<instruction_list.length){
        instruction_idx+=1
      }
    },
    on_start: function(){
      if (instruction_list[instruction_idx].min_duration){
        createD3Timer(instruction_list[instruction_idx].min_duration/1000, ()=>{d3.select("#d3-timer").remove()},{selector:"#"+expdef.jspsychParentDiv})
      }
    }
  };

  var instruction_check = {
    type: jsPsychFlexQuestion,
    expdef: function(){
      return expdef
    },
    stimdef: function(){
      return stimdef
    },
    content: function () {
      return lang.welcome_check;
    },
    trialTag: function () {
      return "instruction-check";
    },
    on_finish: function(trialdata){
      if (trialdata.correct==1){
        instruction_checked=true
      }
    },
  };

  var instruction_list
  var instruction_idx=0;
  var instruction_checked=false;
  var instructions_timeline={
    timeline:[instruction_show,instruction_show,instruction_check],
    on_timeline_start: function(){
      instruction_list=[lang.welcome1_show, lang.welcome2_show]
    },
    loop_function: function(){
      if (instruction_checked){
        return false
      } else {
        instruction_idx=0
        return true
      }
    }
  }
  var training_show = {
    type: jsPsychFlexInstruction,
    expdef: function(){
      return expdef
    },
    stimdef: function(){
      return stimdef
    },
    content: function () {
      return lang.training_show;
    },
    trialTag: function () {
      return "training-show";
    },
    on_start: function(){
      if (lang.training_show.min_duration){
          createD3Timer(lang.training_show.min_duration/1000, ()=>{d3.select("#d3-timer").remove()},{selector:"#"+expdef.jspsychParentDiv})
      }
    }
  };

  var premain_show = {
    type: jsPsychFlexInstruction,
    expdef: function(){
      return expdef
    },
    stimdef: function(){
      return stimdef
    },
    content: function () {
      return lang.main_show;
    },
    trialTag: function () {
      return "premain-show";
    },
    on_finish:  function(){
      progress.barUpdate=true;
    },
    on_start: function(){
      if (lang.training_show.min_duration){
          createD3Timer(lang.main_show.min_duration/1000, ()=>{d3.select("#d3-timer").remove()},{selector:"#"+expdef.jspsychParentDiv})
      }
    }
  };

  var final_show = {
    type: jsPsychFlexInstruction,
    expdef: function(){
      return expdef
    },
    stimdef: function(){
      return stimdef
    },
    on_start: function(){
      var interaction_data = jsPsych.data.getInteractionData()
      interaction_data={...interaction_data, ...{
        subjectId: expdef.subjectId,
        sessionId: expdef.sessionId,
        studyId: expdef.studyId,
        experimentName: 'RLWM',
        sent: 0,
        type: 'trials',
        trialTag: 'interactionData'
      }};
      addItem('trials', interaction_data)
      setTimeout(async ()=>{
        await sendDataFromIndexedDB('trials',experimentSettings.expdef, selfdestruct=true).then(()=>{
          d3.select("#main-customhtml").remove()
          jsPsych.finishTrial({})
        })
      },6000)
    },
    content: function () {
      return lang.final_show;
    },
    trialTag: function () {
      return "final-show";
    },
  };

  var end_show = {
    type: jsPsychFlexInstruction,
    expdef: function(){
      return expdef
    },
    stimdef: function(){
      return stimdef
    },
    content: function () {
      return lang.end_show;
    },
    trialTag: function () {
      return "end-show";
    },
    on_finish: function(){
      socket.disconnect()
      if ('prolificId' in expdef){
        fetch(`${baseUrl}/api/getProfilicCode`)
        .then(res=>res.json())
        .then(data => {
          window.location.href = `https://app.prolific.com/submissions/complete?cc=${data.code}`
        })
      } else {
        window.location.href="https://www.google.com"
      }
    }
  };

  var preblock_show = {
    type: jsPsychFlexInstruction,
    expdef: function(){
      return expdef
    },
    stimdef: function(){
      return stimdef
    },
    content: function () {
      return lang.preblock_show;
    },
    trialTag: function () {
      return "preblock-show";
    },
    inputArray: function(){
    return [`<div class="jspsych-image-container">${stimdef.blockTypes[progress.bNum].images.map(src => `<img src="${src}">`).join('')}</div>`]
    },
    on_start: function(){
      createD3Timer(expdef.timings.preblock.timerDur*expdef.decimateDurations/1000, ()=>{d3.select("#d3-timer").remove()},{selector:"#"+expdef.jspsychParentDiv})
    }
  };

  var main_training = {
    timeline: [preblock_show, loadSVG_func, learning_block, unloadSVG],
    on_timeline_finish: function () {
      document.body.style.cursor = 'pointer';
    },
  }

  var main_learning = {
    timeline: [preblock_show, loadSVG_func, learning_block, unloadSVG],
    on_timeline_finish: function () {
      //start_progress_width = Number(d3.select(stimdef.idProgress).attr('width'));
      document.body.style.cursor = 'pointer';
    },
    loop_function: function () {
      if (progress.bNum == stimdef.blockTypes.length) {
        return false
      } else {
        return true
      }
    }
  }

  ////////////////////////////////////////////////////////////////////
  //// Assemble timeline(s)
  ////////////////////////////////////////////////////////////////////
  let main_timeline  
  if (expdef.runMode=="normal"){
    main_timeline=[browsercheck_trial, trial_consent, trial_preload, enter_fullscreen, instructions_timeline, training_show, main_training, premain_show,main_learning, exit_fullscreen,final_show,end_show]
  } else if (expdef.runMode=="endtest"){
    main_timeline=[browsercheck_trial, trial_consent, trial_preload, enter_fullscreen, training_show, exit_fullscreen,final_show,end_show]
  } else if (expdef.runMode=="quicktest"){
    expdef.decimateDurations=0.1
    expdef.timings.RLWMlearning.responseTimeout*=expdef.decimateDurations
    expdef.timings.fixation.fixDur*=expdef.decimateDurations
    stimdef.blockTypes=stimdef.blockTypes.slice(0, 3);
    expdef.totaltrialNum=0
    main_timeline=[browsercheck_trial, trial_preload, training_show, main_training, premain_show,main_learning, exit_fullscreen,final_show,end_show]
  } else if (expdef.runMode=="simulate"){
    learning_block.timeline=learning_block.timeline.filter(
      item=> item.name=="learningtrial"
    )
    main_learning.timeline=main_learning.timeline.filter(
      item => item.name=="learningblock"
    );
    main_training.timeline=main_training.timeline.filter(
      item => item.name=="learningblock"
    );
    main_timeline=[trial_preload,main_training, main_learning]
  }
  function waitFor(conditionFn, checkInterval = 100) {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (conditionFn()) {
          clearInterval(interval);
          resolve();
        }
      }, checkInterval);
    });
  }

  async function main(mode) {
    await waitFor(() => {
      var ready=true
      for (const key in progress.fetched){
        ready=ready & progress.fetched[key]
      }
      return ready
    });
    window.jsPsychInstance = jsPsych
    window.experimentSettings = {expdef,stimdef,progress}
    if (mode=='simulate'){
      var simulationOptions
      var simul_userId="unknown"
      if (urlParams.has('SIMUL_USERID')) {
        simul_userId = urlParams.get('SIMUL_USERID');
      }
      socket.emit('startSimulation', { 'simul_userId': simul_userId, 'web_userId': expdef.subjectId, experimentSettings: {expdef,stimdef,progress} }, async (response) => {
        console.log(response)
        /*
        simulationOptions=response.simulationOptions.simulationOptions
        const script = document.createElement("script");
        script.type = "py";
        script.src = simulationOptions.pathPyMain;
        script.setAttribute('config', simulationOptions.configPyScript);
        script.onload = async () => {
          console.log(`${src} loaded`);
          const result = window.identify();  // await is key
          console.log("Returned from Python:", result);
        };
        script.onerror = (err) => {
        };
        document.body.appendChild(script);
        */
      });
    } else {
      var loggedId=null
      try {
        loggedId = await getCurrentUser()
        expdef.loggedId=loggedId
        stimdef.loggedId=loggedId
        progress.loggedId=loggedId
      } catch {
        console.log("No logged user")
      }
      stimdef.subjectId=expdef.subjectId
      progress.subjectId=expdef.subjectId

      addExpdef(expdef);
      addItem('stimdef', stimdef);
      addItem('progress', progress);

      setInterval(()=>{
        fetch(`${baseUrl}/api/uploadData`, {
            method: 'HEAD'
        })
        .then(async response => {
              if (response.ok) {
                  await sendDataFromIndexedDB('expdef',expdef)
                  await sendDataFromIndexedDB('stimdef',expdef)
                  await sendDataFromIndexedDB('progress',expdef)
                  await sendDataFromIndexedDB('trials',expdef)
              } else {
                  console.warn(`⚠️ Server API not accessible: ${response.status}`);
              }
          })
          .catch(error => {
              console.error('❌ Network or CORS error:', error);
          });
      }, expdef.sendInterval)

      jsPsych.data.addProperties({
        subjectId: expdef.subjectId,
        sessionId: expdef.sessionId,
        studyId: expdef.studyId,
        loggedId: loggedId,
        experimentName: 'RLWM',
        sent: 0,
        type: 'trials'
      });
      if (expdef.env.CONTEXT=='local'){
        if (!socket){
          socket = io(baseUrl);
        }
        socket.on("syncRequest", (data, ack) => {
          // Respond with some data
          ack({experimentMS: performance.now() });
        });
        socket.emit('expdef', expdef);
        socket.emit('stimdef', stimdef);
      }
      jsPsych.run(main_timeline)
    }
  }

  lang=getLanguage(expdef, stimdef)
  progress.fetched.language=true
  main(expdef.runMode)

}
