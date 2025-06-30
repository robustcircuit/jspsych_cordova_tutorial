var jsPsychRLWMlearning = (function (jspsych) {
  'use strict';
  const info = {
    name: "RLWMlearning",
    version: "1.0.2",
    data: {
      keyResponse: {
        type: jspsych.ParameterType.INT,
      },
      correct: {
        type: jspsych.ParameterType.INT,
      },      
      rt:{
        type: jspsych.ParameterType.FLOAT,
      },
      feedback: {
        type: jspsych.ParameterType.FLOAT,
      },
      timeOnset: {
        type: jspsych.ParameterType.FLOAT,
      },
      timeFadeIn: {
        type: jspsych.ParameterType.FLOAT,  
      },
      timeOffset: {
        type: jspsych.ParameterType.FLOAT,
      },
      trialTag: {
        type: jspsych.ParameterType.STRING,
      },
    },
    parameters: {
      correctResponse: {
        type: jspsych.ParameterType.INT,
        pretty_name: "correct-response",
        array: false,
        default: -1,
      },
      correctFeedback: {
        type: jspsych.ParameterType.FLOAT,
        pretty_name: "correct-feedback",
        array: false,
        default: -1,
      },
      imagePath: {
        type: jspsych.ParameterType.STRING,
        pretty_name: "image-path",
        array: false,
        default: "",        
      },
      show_message: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: "help-message",
        array: false,
        default: false,
      },
      trialMode: {
        type: jspsych.ParameterType.STRING,
        pretty_name: "trial-mode",
        array: false,
        default: "learn",      
      },
      timings: {
        type: jspsych.ParameterType.COMPLEX,
        pretty_name: "timings",
        array: false,
        default: "timings",           
      },
      expdef:{
        type: jspsych.ParameterType.COMPLEX,
        array: false,
        pretty_name: "expdef",       
      },
      stimdef:{
        type: jspsych.ParameterType.COMPLEX,
        array: false,
        pretty_name: "stimdef",       
      },   
    },
  };
  /**
   * Custom plugin built for the RLWM paradigm by Collins and colleagues
   * It uses fields from global objects trial.stimdef.RLWMlearning, trial.expdef and lang to manipulate dynamically 
   * ab SVG file (already displayed on screen) and containing specific elements
   * defined as trial.stimdef.RLWMlearning.idXXXXX (see main RLWM.html experiment page)
   * @author Romain Ligneul
   */

  class jsPsychRLWMlearningPlugin {

    constructor(jsPsych) {
      this.jsPsych = jsPsych;
      this.mouse_position = {
        x: 0,
        y: 0
      }
    };

    trial(display_element, trial) {

      const jsPsych=this.jsPsych


      console.log('trial params', trial)
      // initialize variables and modules
      var keyboardListener
      var trialdata = {
          keyResponse: -1,
          correct: -1,
          rt:-1,
          feedback: -1,
          timeOnset: -1,
          timeFadeIn: -1,
          timeOffset: -1,
          trialTag: info.name,
          trialMode: trial.trialMode,
      }

      // hide display and fixation
      d3.select(trial.stimdef.idMain).attr('opacity', '0.001')

      // reset state of the SVG
      for (let i = 0; i < trial.stimdef.RLWMlearning.idFeedback.length; i++) {
        d3.select(trial.stimdef.RLWMlearning.idFeedback[i]).attr('opacity', '0.001')
        d3.select(trial.stimdef.RLWMlearning.idFeedbackText[i]).text(lang.textFeedback[i])
        d3.select(trial.stimdef.RLWMlearning.idFeedbackText[i]).attr("x", parseFloat(d3.select(trial.stimdef.RLWMlearning.idFeedbackRect[i]).attr('x'))+parseFloat(0.5*d3.select(trial.stimdef.RLWMlearning.idFeedbackRect[i]).attr('width')))
        d3.select(trial.stimdef.RLWMlearning.idFeedbackText[i]).attr("width",d3.select(trial.stimdef.RLWMlearning.idFeedbackRect[i]).attr('width'))
        d3.select(trial.stimdef.RLWMlearning.idFeedbackText[i]).attr("text-anchor", "middle")
      }
      for (let i = 0; i < trial.stimdef.RLWMlearning.idRespBoxes.length; i++) {
        d3.select(trial.stimdef.RLWMlearning.idRespBoxes[i]).style('fill-opacity', trial.stimdef.RLWMlearning.idRespBoxesOpacity[0])
        if (trial.trialMode=="test2"){
          d3.select(trial.stimdef.RLWMlearning.idRespBoxes[i]).attr('opacity', '0.001')
          d3.select(trial.stimdef.RLWMlearning.idRespBoxesText[i]).attr('opacity', '0.001')
          if (d3.select("#slider").empty()){
            d3.select("#jspsych-content").append('div')
            .html('<input type="range" min="1" max="100" value="50" class="multislider" id="myRange">')
          }
        } else {
          d3.select(trial.stimdef.RLWMlearning.idRespBoxesText[i]).attr('opacity', '0.001')
        }
        d3.select(trial.stimdef.RLWMlearning.idRespBoxes[i]).style('stroke-width', 1.5)     
      }

      // load image
      d3.select(trial.stimdef.RLWMlearning.idTargetLearning).attr('xlink:href', trial.imagePath)
      d3.select(trial.stimdef.RLWMlearning.idTargetLearning).style('opacity','1');

      // display image and start response listener
      trialdata.timeOnset = performance.now();
      d3.select(trial.stimdef.idMain).transition().duration(trial.expdef.timings.RLWMlearning.fadeInDur).attr('opacity', '1').on("end", () => {
        trialdata.timeFadeIn = performance.now();
        // wait for participant response
        if (trial.expdef.keyMode == 'keyboard') {
          // start the keyboard listener
          keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
            callback_function: getResponse,
            valid_responses: trial.expdef.keyCodes,
            rt_method: "performance",
            persist: false,
            allow_held_key: false,
          })
        }
        // OR start the serial listener
        else if (trial.expdef.keyMode == 'serial') {
          socket.once('serialstring', function (e) {
            // to be implemented
          })
        } else if ((trial.expdef.keyMode == 'touch') | (trial.expdef.keyMode == 'mouse')) {
          function checkHitEvent(svgP) {
            var touchinfo = {};
            var leftBB = d3.select(trial.stimdef.RLWMlearning.idRespBoxes[0]).node().getBBox();
            var centerBB = d3.select(trial.stimdef.RLWMlearning.idRespBoxes[1]).node().getBBox();
            var rightBB = d3.select(trial.stimdef.RLWMlearning.idRespBoxes[2]).node().getBBox();
            if (svgP.x > leftBB.x && svgP.x < (leftBB.x + leftBB.width) && svgP.y > leftBB.y && svgP.y < (leftBB.y + leftBB.height)) {
              touchinfo.key = trial.expdef.keyCodes[0];
              touchinfo.rt = performance.now() - trialdata.timeOnset;
              getResponse(touchinfo)
            } else if (svgP.x > centerBB.x && svgP.x < (centerBB.x + centerBB.width) && svgP.y > centerBB.y && svgP.y < (centerBB.y + centerBB.height)) {
              touchinfo.key = trial.expdef.keyCodes[1];
              touchinfo.rt = performance.now() - trialdata.timeOnset;
              getResponse(touchinfo)
            } else if (svgP.x > rightBB.x && svgP.x < (rightBB.x + rightBB.width) && svgP.y > rightBB.y && svgP.y < (rightBB.y + rightBB.height)) {
              touchinfo.key = trial.expdef.keyCodes[2];
              touchinfo.rt = performance.now() - trialdata.timeOnset;
              getResponse(touchinfo)
            }
          }
          if (trial.expdef.keyMode=='touch'){
            d3.select(trial.stimdef.idMain).on("touchstart", function (touchevent) {
              var pt = d3.select('#globalsvg').node().createSVGPoint();
                pt.x = touchevent.touches[0].clientX;
                pt.y = touchevent.touches[0].clientY;            
              var svgP = pt.matrixTransform(d3.select(trial.stimdef.idMain).node().getScreenCTM().inverse());
              checkHitEvent(svgP)
              d3.select(trial.stimdef.idMain).on("touchstart", null)
            })
          } else {
            d3.select(trial.stimdef.idMain).on("mousedown", function (mouseevent) {
              var pt = d3.select('#globalsvg').node().createSVGPoint();
              pt.x = mouseevent.clientX;
              pt.y = mouseevent.clientY;
              console.log(mouseevent)
              var svgP = pt.matrixTransform(d3.select(trial.stimdef.idMain).node().getScreenCTM().inverse());
              checkHitEvent(svgP)
              d3.select(trial.stimdef.idMain).on("mousedown", null)
            });
          }
        }
        // add in any case the response_timeout
        jsPsych.pluginAPI.setTimeout(() => {
          endTrial()
        }, trial.expdef.timings.RLWMlearning.responseTimeout);
      })

      // get the response and display feedback
      function getResponse(respinfo) {
        // clear the (no) response timeout
        jsPsych.pluginAPI.clearAllTimeouts();
        trialdata.rt=performance.now() - trialdata.timeOnset;
        // highlight choice made
        if (respinfo.key == trial.expdef.keyCodes[0]) {
          trialdata.keyResponse = 0;
        } else if (respinfo.key == trial.expdef.keyCodes[1]) {
          trialdata.keyResponse = 1;

        } else if (respinfo.key == trial.expdef.keyCodes[2]) {
          trialdata.keyResponse = 2;
        }
        if (trialdata.keyResponse==trial.correctResponse){
          trialdata.feedback=trial.correctFeedback+1;
          trialdata.correct=1;
        } else {
          trialdata.correct=0;
          trialdata.feedback=0;         
        }
        // highlight briefly the response
        if (trial.trialMode!="test2"){
          d3.select(trial.stimdef.RLWMlearning.idRespBoxes[trialdata.keyResponse]).style('fill-opacity', trial.stimdef.RLWMlearning.idRespBoxesOpacity[1])
        } else {
          d3.select(trial.stimdef.RLWMlearning.idRespBoxes[trialdata.keyResponse]).style('stroke-width', 3)     
        }

        jsPsych.pluginAPI.setTimeout(() => {
          if (trial.trialMode!="test2"){
            d3.select(trial.stimdef.RLWMlearning.idRespBoxes[trialdata.keyResponse]).style('fill-opacity', trial.stimdef.RLWMlearning.idRespBoxesOpacity[0])
          }
          endTrial()
        }, trial.expdef.timings.RLWMlearning.postResponseDur);
      }

      // 
      function endTrial() {
        jsPsych.pluginAPI.cancelAllKeyboardResponses(keyboardListener);
        if ((trial.trialMode=="train") | (trial.trialMode=="learn")){
        d3.select(trial.stimdef.RLWMlearning.idFeedback[trialdata.feedback+1]).attr('opacity','1')
          jsPsych.pluginAPI.setTimeout(() => {
            trialdata.timeOffset = performance.now();
            jsPsych.finishTrial(trialdata)
          }, trial.expdef.timings.RLWMlearning.feedbackDur);
        } else {
          jsPsych.pluginAPI.setTimeout(() => {
            trialdata.timeOffset = performance.now();
            jsPsych.finishTrial(trialdata)
          }, trial.expdef.timings.RLWMlearning.feedbackDur/2);  // we half the feedback duration
        }
      }
    }

    simulate(trial, simulation_mode, simulation_options, load_callback) {
      if (simulation_mode == "data-only") {
        this.simulate_data_only(trial, simulation_options);
      }
      if (simulation_mode == "visual") {
        this.simulate_visual(trial, simulation_options, load_callback);
      }
    }
    create_simulation_data(trial, simulation_options) {
      var default_data = {
          keyResponse: -1,
          correct: -1,
          rt:0.0001,
          feedback: -1,
          timeOnset: -1,
          timeFadeIn: -1,
          timeOffset: -1,
          trialTag: info.name,
          trialMode: trial.trialMode,
      }
      default_data.correct = jsPsych.randomization.sampleBernoulli(simulation_options.RLWMaccuracy)
      if (default_data.correct==1){
        default_data.keyResponse=trial.correctResponse
      } else {
        var keyOptions=[0,1,2]
        const index = [0,1,2].indexOf(trial.correctResponse);
        if (index !== -1) {
          keyOptions.splice(index, 1);
        }
        default_data.keyResponse=jsPsych.randomization.sampleWithoutReplacement(keyOptions, 1)[0]
      }
      const data = this.jsPsych.pluginAPI.mergeSimulationData(default_data, simulation_options);
      this.jsPsych.pluginAPI.ensureSimulationDataConsistency(trial, data);
      return data;
    }
    simulate_data_only(trial, simulation_options) {
      const data = this.create_simulation_data(trial, simulation_options);
      this.jsPsych.finishTrial(data);
    }
  }
  jsPsychRLWMlearningPlugin.info = info;

  return jsPsychRLWMlearningPlugin;

})(jsPsychModule);