  const socket = io("https://192.168.1.41:3000");

  socket.on("error", (error) => {
    console.log("socket connection problem");
  });

  socket.on("connect", (e) => {
    console.log("socket connected");
  });

  socket.on("syncRequest", (data, ack) => {
    // Respond with some data
    ack({experimentMS: performance.now() });
  });

  const jspsychParentDiv='jspsych-body'

  var jsPsych = initJsPsych({
    display_element: jspsychParentDiv,
    on_trial_finish: function(data) {
      // send trial to db
    },
    on_start: function(){
      console.log("here")
    }
  });

  ///////
  const consoleLog=true

  /////// generate random ids
  function generateUUIDv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }
  var random_subjectId=generateUUIDv4()
  var random_sessionId=generateUUIDv4()
  var random_studyId='RLWM'

  ////////////////////////////////////////////////////////////////////
  //// Experiment settings
  ////////////////////////////////////////////////////////////////////
  var expdef={
    // identifiers (may be replaced by URLparameters)
    sessionId: random_sessionId,
    studyId: random_studyId,
    //
    nrepeats:3,
    toleranceAvgDistanceRepetition:0.25,
    keyMode: 'mouse',
    keyCodes: ['ArrowLeft', 'ArrowDown', 'ArrowRight'],
    feedbackValues: [1.0,3.0],
    screen: {
      width: 1080,
      height: 1920
    },
    timings: {
      instructions: {
        preblockDur: 4000
      },
      fixation: {
        fixDur: 500,
      },
      learning: {
        postResponseDur: 200,
        feedbackDur: 800,
        fadeInDur: 100, // fade in of learning trials
        responseTimeout: 1500,
      }
    },
    language: "english",
    mobileSession: false,
  }

  var progress={
    // identifiers (may be replaced by URLparameters)
    sessionId: random_sessionId,
    studyId: random_studyId,
    // 
    sumCorrect: 0,
    doneFraction: 0,
    guessedAccuracy: 0.75,
    expectedAccuracy: 0.75,
    cumreward: 0,
    tNum:0,
    tblockNum:0,
    bNum:0,
    barUpdate:false,
    currentBarWidth:0.01,
    remtNum: 0,
    fetched: {images: false, language: false},
    currentSVG: undefined
  }
  
  // check platform
  if (typeof cordova!=='undefined' && cordova?.platformId=='android'){
    const accelDisplay = d3.select('#'+jspsychParentDiv)
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
    sessionId: random_sessionId,
    studyId: random_studyId,
    // general
    imagesFolder:'img/RLWM',
    pathLearningTrial: `assets/RLWM/learningtrial_${expdef.screen.width}x${expdef.screen.height}.svg`,
    pathProgressbar: 'assets/RLWM/progressbar_overall.svg',
    // SVG items
    idMain: '#svgview',
    idRespBoxes: ['#leftresp', '#centerresp', '#rightresp'],
    idRespBoxesText: ['#lefttext', '#centertext', '#righttext'],
    idFeedback: ['#noresponse','#incorrect', '#correctNormal', '#correctExtra'],
    idFeedbackText: ['#noresponseText','#incorrectText', '#correctNormalText', '#correctExtraText'],
    idFeedbackRect: ['#noresponseRect','#incorrectRect', '#correctNormalRect', '#correctExtraRect'],
    textFeedback: ['No valid response', 'Incorrect', 'Correct', 'Correct'],
    idTargetLearning:'#targetimage',
    // Dynamic SVG properties
    idRespBoxesColor: ['#81aac2ff', '#c1c34aff', '#0fb76fff'],
    correctFeedbackColor : ['#c1c34aff', '#0fb76fff'],
    idRespBoxesOpacity: ['0.2', '0.6'],
    // Fixation
    idFixation: "#fixation",
    // Progress bar
    idProgress: '#progressbar',
    idProgressFrame: '#progressframe',
    progressbar_stepDownUp: [0, 0],
  }

  // set and randomize categories included in the experiment
  var categories = ["bird","sports", "kitchen","lighting","watercraft","container", "construction","dessert", "fruit", "instrument", "vegetable", "vehicle", "electronic"]
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
  stimdef.blockTypes = trainingBlock.concat(stimdef.blockTypes); // join them back

  // assign images to each block, create path array for preloading and construct pseudorandomized trial list for each block)
  stimdef.imagesPreloadPaths=[]
  expdef.totaltrialNum=0
  expdef.maxReward=0
  stimdef.blockTypes.forEach((block,blockidx) =>{
    var catname=block.category
    folder_path=`${stimdef.imagesFolder}/${catname}`
    fetch(`https://192.168.1.41:3000/api/getfiles?folder=${folder_path}`)
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
      }));
      expdef.totaltrialNum+=tryTrials.length
      if (block.phase=='learn'){
        progress.remtNum+=tryTrials.length
      }
      block.trials=tryTrials
      if (block.phase=="learn"){
        block.trials.forEach(trial=>{
          expdef.maxReward+=expdef.feedbackValues[trial.correctFeedback],
          trial.maxReward=expdef.maxReward
        })
      }
      if (blockidx==stimdef.blockTypes.length-1){
        progress.fetched.images=true
      }
    });
  })

  // log to console if requested
  consoleLog && console.log('Blocks\n', stimdef.blockTypes);

  ////////////////////////////////////////////////////////////////////
  //// Gather URL parameters
  ////////////////////////////////////////////////////////////////////
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  //
  if (urlParams.has('LANGUAGE')) {
    expdef.language = urlParams.get('LANGUAGE');
  }
  //
  if (urlParams.has('SUBJECT_ID')) {
    expdef.subjectId = urlParams.get('SUBJECT_ID');
    stimdef.subjectId = urlParams.get('SUBJECT_ID');
    progress.subjectId = urlParams.get('SUBJECT_ID');
  } else if (urlParams.has('PROFILIC_PID')) {
    expdef.subjectId = urlParams.get('PROFILIC_PID');
    stimdef.subjectId = urlParams.get('PROFILIC_PID');
    progress.subjectId = urlParams.get('PROFILIC_PID');
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
          d3.select('#'+jspsychParentDiv)
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
      stimdef.pathLearningTrial=`assets/RLWM/learningtrial_${expdef.screen.width}x${expdef.screen.height}.svg`
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
    fix_duration: expdef.timings.fixation.fixDur
  };

  // learning trial
  var learning_trial = {
    type: jsPsychRLWMlearning,
    correctResponse: function () {
      console.log(stimdef.blockTypes[progress.bNum].trials[progress.tblockNum].correctAction)
      return stimdef.blockTypes[progress.bNum].trials[progress.tblockNum].correctAction
    },
    correctFeedback: function () {
      return stimdef.blockTypes[progress.bNum].trials[progress.tblockNum].correctFeedback
    },
    maxReward: function () {
      return stimdef.blockTypes[progress.bNum].trials[progress.tblockNum].maxReward
    },
    trialMode: function () {
      return stimdef.blockTypes[progress.bNum].phase
    },
    imagePath: function () {
      console.log(stimdef.blockTypes[progress.bNum].trials[progress.tblockNum].image)
      return stimdef.blockTypes[progress.bNum].trials[progress.tblockNum].image
    },
    on_finish: function (trialdata) {
      //
      console.log(progress)
      progress.tblockNum += 1;
      progress.tNum += 1;
      if (trialdata.correct > 0) {
        progress.sumCorrect += 1
      }
      progress.doneFraction = progress.tNum / expdef.totaltrialNum;
      progress.accumulatedAccuracy = (progress.sumCorrect / (progress.tNum));
      progress.expectedAccuracy = (1 - progress.doneFraction) * progress.guessedAccuracy + progress.doneFraction * progress.accumulatedAccuracy;
      progress.remtNum -= 1
      if (trialdata.correct > 0) {
        progress.cumreward = progress.cumreward + expdef.feedbackValues[trialdata.correct_feedback];
      }
    }
  }
  var learning_block = {
    timeline: [
      fixation_trial,learning_trial
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

  var preblock_trial = {
      type: jsPsychHtmlKeyboardResponse,
      on_start: function(){
        d3.select(stimdef.idMain).attr('opacity', '0')
        d3.select(stimdef.idFixation).attr('opacity', '0')
        if (stimdef.blockTypes[progress.bNum].phase=='learn'){
          progress.barUpdate=true
        }
        if (!progress.barUpdate){
          d3.select(stimdef.idProgress).attr('opacity', '0')
          d3.select(stimdef.idProgressFrame).attr('opacity', '0')
        } else {
          d3.select(stimdef.idProgress).attr('opacity', '1')
          d3.select(stimdef.idProgressFrame).attr('opacity', '1')
        }
      },
      stimulus: function(){
        console.log(stimdef.blockTypes[progress.bNum].images)
        htmlString="<div class='jspsych-row-simple' style='text-align:center'>"
        htmlString+=`<p>${lang.preblock_box1}<br></p>`
        htmlString+="</div><div class='jspsych-image-container'>"
        stimdef.blockTypes[progress.bNum].images.forEach((img,imgidx)=>{
          htmlString+=`<img src=${img} alt=${imgidx}/>`
        })
        htmlString+="</div>"
        htmlString+="<div class='jspsych-row-simple' style='text-align:center'>"
        htmlString+=`<p>${lang.preblock_box2}</p>`
        htmlString+="</div>"
        return htmlString
      },
      choices: "ALL_KEYS",
      trial_duration: expdef.timings.instructions.preblockDur
  };  

  var main_learning = {
    timeline: [
      preblock_trial, loadSVG_func, learning_block
    ],
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
  main_timeline=[browsercheck_trial, trial_preload,main_learning]

  var script = document.createElement('script');
  script.onload = function () {
    progress.fetched.language=true
  };
  script.src = 'js/RLWM/languages/lang.' + expdef.language + '.js';
  document
    .head
    .appendChild(script);

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

  async function main() {
    await waitFor(() => {
      var ready=true
      for (const key in progress.fetched){
        ready=ready & progress.fetched[key]
        console.log(ready)
      }
      return ready
    });
    try {
      random_subjectId = await getCurrentUser()
    } catch {
      console.log("No logged user")
    }
    expdef.subjectId=random_subjectId
    stimdef.subjectId=random_subjectId
    progress.subjectId=random_subjectId
    console.log("current user",random_subjectId)
    // expdef query
    var query_results=[]
    try {
      query_results = await getByCompound('expdef', expdef);
      console.log('Fetched records:', query_results);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    if (query_results.length==0){
      addItem('expdef', expdef);
      addItem('stimdef', stimdef);
      addItem('progress', progress);
    }
    socket.emit('expdef', expdef);
    socket.emit('stimdef', stimdef);
    console.log("Done fetching!");
    jsPsych.run(main_timeline)
  }
  main()
