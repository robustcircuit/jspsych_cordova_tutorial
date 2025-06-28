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
      d3.select(stimdef.idMain).attr('opacity', '0')
      d3.select("#fixation").attr('opacity', '0')

      d3.select(stimdef.idRespBoxes[i]).attr('opacity', '0')
      d3.select(stimdef.idRespBoxesText[i]).attr('opacity', '0')
      if (d3.select("#slider").empty()){
        d3.select("#jspsych-content").append('div')
        .html('<input type="range" min="1" max="100" value="50" class="multislider" id="myRange">')
      }
 
      d3.select("#jspsych-content").append('div')
      .class('jpsych-slider')
      .html('<input type="range" min="0" max="100" value="50" class="jspsych-slider" id="sliderRating"></input>')
      .attr('top', '70%')
      .attr('width', '70%')
      


      // 
      function endTrial() {
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