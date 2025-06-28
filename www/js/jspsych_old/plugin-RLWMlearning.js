var jsPsychRLWMlearning = (function (jspsych) {
  'use strict';
  const info = {
    name: "EPrlwm",
    parameters: {
      update_progressbar: {
        default: false,
        type: jspsych.ParameterType.BOOL,
        array: false,
        pretty_name: "update-progress",
      },
      key_choices: {
        type: jspsych.ParameterType.STRING,
        pretty_name: "trial-position",
        array: true,
        default: ['ArrowLeft', 'ArrowRight'],
      },
      response_device: {
        type: jspsych.ParameterType.STRING,
        pretty_name: "response-device",
        array: false,
        default: 'keyboard',
      },
      key_choices: {
        type: jspsych.ParameterType.INT,
        pretty_name: "key-choices",
        array: true,
        default: ["arrowleft", "arrowdown","arrowright"],
      },
      correct_response: {
        type: jspsych.ParameterType.INT,
        pretty_name: "correct-response",
        array: false,
        default: -1,
      },
      response_timeout: {
        type: jspsych.ParameterType.INT,
        pretty_name: "resp-time-out",
        array: false,
        default: 5000,
      },
      post_response_duration: {
        type: jspsych.ParameterType.INT,
        pretty_name: "resp-time-out",
        array: false,
        default: 300,
      },
      feedback_duration: {
        type: jspsych.ParameterType.INT,
        pretty_name: "resp-time-out",
        array: false,
        default: 700,
      },
      correct_feedback: {
        type: jspsych.ParameterType.INT,
        pretty_name: "correct-feedback",
        array: false,
        default: -1,
      },
      stim_setid: {
        type: jspsych.ParameterType.INT,
        pretty_name: "set-id",
        array: false,
        default: -1,
      },
      stim_imageid: {
        type: jspsych.ParameterType.INT,
        pretty_name: "image-id",
        array: false,
        default: -1,
      },
      show_message: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: "help-message",
        array: false,
        default: false,
      },
      base_data: {
        type: jspsych.ParameterType.STRUCT,
        pretty_name: "help-message",
        array: false,
        default: null,
      },
    },
  };
  /**
   * **Explore-and-Predict plugin - mouse version**
   * **Romain Ligneul, summer 2022, romain.ligneul@gmail.com**
   * 
   * 1. Each call starts just after the participant selected a response (current response).
   * 2. Then, the participant has to move the cursor over the centralDot, otherwise the plugin remains inactive.
   * 3. Then, the participant has to move towards the next predicted state, which can be either the good one or a wrong one.
   * 4. Once the participant goes out of the outerCircle, the next active state is revealed.
   * 5. If the prediction was correct, we reward the participant.
   * 6. Once the participant reaches the next active state, responses options are displayed
   * 7. The call terminates as soon as the participant has performed their choice (left/right mouse click)
   * The mouse position is continuously monitored and logged during the entire trial.
   * 
   * @author Josh de Leeuw
   */
  var startTime = undefined;

  class jsPsychRLWMlearningPlugin {

    constructor(jsPsych) {
      this.jsPsych = jsPsych;
      this.mouse_position = {
        x: 0,
        y: 0
      }
    };

    trial(display_element, trial) {

      // initialize variables and modules
      var keyboardListener
      var trialdata = Object.assign({},trial.base_data);
      trialdata.trial_mode=trial.trial_mode;
      trialdata.dur_fb=trial.feedback_duration;
      trialdata.dur_postrep=trial.post_response_duration;
      trialdata.dur_timeout=trial.response_timeout;
      trialdata.correct_feedback=trial.correct_feedback
      trialdata.key_response=-1;
      trialdata.correct=-1;
      trialdata.rt=-1;

      // get stim
      var imagePath = stimdef.pathImages + stimdef.setNames[trial.stim_setid] + '/' + stimdef.imageNames[trial.stim_setid][trial.stim_imageid] + '.jpg';

      // hide display and fixation
      d3.select(stimdef.idMain).attr('opacity', '0.001')
      d3.select("#fixation").attr('opacity', '0.001')

      // reset state of the SVG
      for (let i = 0; i < stimdef.idFeedback.length; i++) {
        d3.select(stimdef.idFeedback[i]).attr('opacity', '0.001')
        d3.select(stimdef.idFeedbackText[i]).text(lang.textFeedback[i])
        //var xrect=d3.select(stimdef.idFeedbackRect[i]).attr('x')+(0.5*d3.select(stimdef.idFeedbackRect[i]).attr('width'))
        //console.log(xrect)
        d3.select(stimdef.idFeedbackText[i]).attr("x", parseFloat(d3.select(stimdef.idFeedbackRect[i]).attr('x'))+parseFloat(0.5*d3.select(stimdef.idFeedbackRect[i]).attr('width')))
        d3.select(stimdef.idFeedbackText[i]).attr("width",d3.select(stimdef.idFeedbackRect[i]).attr('width'))
        d3.select(stimdef.idFeedbackText[i]).attr("text-anchor", "middle")
      }
      for (let i = 0; i < stimdef.idRespBoxes.length; i++) {
        d3.select(stimdef.idRespBoxes[i]).style('fill-opacity', stimdef.idRespBoxesOpacity[0])
        if (trial.trial_mode=="test2"){
          d3.select(stimdef.idRespBoxes[i]).attr('opacity', '0.001')
          d3.select(stimdef.idRespBoxesText[i]).attr('opacity', '0.001')
          if (d3.select("#slider").empty()){
            d3.select("#jspsych-content").append('div')
            .html('<input type="range" min="1" max="100" value="50" class="multislider" id="myRange">')
          }
          //d3.select(stimdef.idRespBoxes[i]).style('fill', stimdef.idRespBoxesColor[i])    
          //d3.select(stimdef.idRespBoxes[i]).style('fill-opacity', '1')    
          //d3.select(stimdef.idRespBoxesText[i]).attr('opacity', '1')
        } else {
          d3.select(stimdef.idRespBoxesText[i]).attr('opacity', '0.001')
        }
        d3.select(stimdef.idRespBoxes[i]).style('stroke-width', 1.5)     
      }

      // load image
      d3.select(stimdef.idTargetLearning).attr('xlink:href', imagePath)
      d3.select(stimdef.idTargetLearning).style('opacity','1');

      // display image and start response listener
      trialdata.time_startFadeIn = performance.now();
      d3.select(stimdef.idMain).transition().duration(timing.durFadeIn).attr('opacity', '1').on("end", () => {
        trialdata.time_endFadeIn = performance.now();
        // wait for participant response
        if (trial.response_device == 'keyboard') {
          // start the keyboard listener
          keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
            callback_function: getResponse,
            valid_responses: trial.key_choices,
            rt_method: "performance",
            persist: false,
            allow_held_key: false,
          })
        }
        // OR start the serial listener
        else if (trial.response_device == 'serial') {
          socket.once('serialstring', function (e) {
            // console.log('received ' + e + ' in EP plugin!')
            var serial_choice
            //togglePerspective(serial_choice)
          })
        } else if (trial.response_device == 'touch') {
          d3.select(stimdef.idMain).on("touchstart", function (touchevent) {
            var touchinfo = [];
            var pt = d3.select('#globalsvg').node().createSVGPoint();
            pt.x = touchevent.touches[0].clientX;
            pt.y = touchevent.touches[0].clientY;
            var svgP = pt.matrixTransform(d3.select('#globalsvg').node().getScreenCTM().inverse());
            var leftBB = d3.select(stimdef.idRespBoxes[0]).node().getBBox();
            var centerBB = d3.select(stimdef.idRespBoxes[1]).node().getBBox();
            var rightBB = d3.select(stimdef.idRespBoxes[2]).node().getBBox();
            if (svgP.x > leftBB.x && svgP.x < (leftBB.x + leftBB.width) && svgP.y > leftBB.y && svgP.y < (leftBB.y + leftBB.height)) {
              touchinfo.key = trial.key_choices[0];
              touchinfo.rt = performance.now() - trialdata.time_startFadeIn;
              getResponse(touchinfo)
            } else if (svgP.x > centerBB.x && svgP.x < (centerBB.x + centerBB.width) && svgP.y > centerBB.y && svgP.y < (centerBB.y + centerBB.height)) {
              touchinfo.key = trial.key_choices[1];
              touchinfo.rt = performance.now() - trialdata.time_startFadeIn;
              getResponse(touchinfo)
            } else if (svgP.x > rightBB.x && svgP.x < (rightBB.x + rightBB.width) && svgP.y > rightBB.y && svgP.y < (rightBB.y + rightBB.height)) {
              touchinfo.key = trial.key_choices[2];
              touchinfo.rt = performance.now() - trialdata.time_startFadeIn;
              getResponse(touchinfo)
            }
          })
        }
        // add the response_timeout
        jsPsych.pluginAPI.setTimeout(() => {
          trialdata.feedback=trial.correct_feedback;
          endTrial()
        }, trial.response_timeout);
      })

      // get the response and display feedback
      function getResponse(info) {
        // clear the (no) response timeout
        jsPsych.pluginAPI.clearAllTimeouts();
        trialdata.rt=performance.now() - trialdata.time_startFadeIn;
        // highlight choice made
        if (info.key == trial.key_choices[0]) {
          trialdata.key_response = 1;
        } else if (info.key == trial.key_choices[1]) {
          trialdata.key_response = 2;

        } else if (info.key == trial.key_choices[2]) {
          trialdata.key_response = 3;
        }
        if (trialdata.key_response==trial.correct_response){
          trialdata.feedback=trial.correct_feedback;
          trialdata.correct=1;
        } else {
          trialdata.correct=0;
          trialdata.feedback=0;         
        }
        // highlight briefly the response
        if (trial.trial_mode!="test2"){
          d3.select(stimdef.idRespBoxes[trialdata.key_response-1]).style('fill-opacity', stimdef.idRespBoxesOpacity[1])
        } else {
          d3.select(stimdef.idRespBoxes[trialdata.key_response-1]).style('stroke-width', 3)     
        }
        jsPsych.pluginAPI.setTimeout(() => {
          if (trial.trial_mode!="test2"){
            d3.select(stimdef.idRespBoxes[trialdata.key_response-1]).style('fill-opacity', stimdef.idRespBoxesOpacity[0])
          }
          endTrial()
        }, trial.post_response_duration);
      }

      // 
      function endTrial() {
        jsPsych.pluginAPI.cancelAllKeyboardResponses(keyboardListener);
        trialdata.trial_tag='RLWMtrial'
        // display feedback
        if (trial.trial_mode=="learning"){
          if (trialdata.correct==-1){ // case no response given
            d3.select(stimdef.idFeedback[3]).attr('opacity','1')
          } else {
            d3.select(stimdef.idFeedback[trialdata.feedback]).attr('opacity','1')
          }
          // log all info
          trialdata.imageid=trial.stim_imageid;
          trialdata.setid=trial.stim_setid;
          progressBarUpdate();
          jsPsych.pluginAPI.setTimeout(() => {
            trialdata.timeEndTrial = performance.now();
            jsPsych.finishTrial(trialdata)
          }, trial.feedback_duration);
        } else {
          jsPsych.pluginAPI.setTimeout(() => {
            trialdata.timeEndTrial = performance.now();
            jsPsych.finishTrial(trialdata)
          }, trial.feedback_duration/2);  // we half the feedback duration
        }
      }

      function progressBarUpdate() {
        if (trial.update_progressbar && trialdata.correct>0) {
          var current_width = Number(d3.select(stimdef.idProgress).attr('width'));
          var progressbar_fullLength = Number(d3.select("#progressframe").attr('width'))
          var point2bar = progressbar_fullLength/maxReward; 

          var expected_width=point2bar*cummaxreward;

          var delta_width = expected_width - (current_width+point2bar*(trial.correct_feedback));
          var correction_factor = delta_width/(rem_tnum*expectedAccuracy); // correction of the delta width as if it would never increase and be corrected progressively over the rest of the exp


          if (rem_tnum==0){
            correction_factor=delta_width;
          }

          // increment
          var next_width = current_width + point2bar*(trial.correct_feedback) + correction_factor;

          d3.select(stimdef.idProgress)
            .transition().duration(100).attr('width', next_width.toString())
            .transition().duration(trial.feedback_duration-200).style('fill', stimdef.correct_feedbackColor[trial.correct_feedback-1]).on("end", () => {
              d3.select(stimdef.idProgress).transition().duration(100).style('fill', "#ffffffff")
            })
        } else if (trial.update_progressbar && trialdata.correct<=0){
         // step_size = step_size + ((trial.correct_feedback/rem_tnum)/expectedAccuracy); // compensate the error
        }
      }

    }

  }
  jsPsychRLWMlearningPlugin.info = info;

  return jsPsychRLWMlearningPlugin;

})(jsPsychModule);