var jsPsychSVGfixation = (function (jspsych) {
  'use strict';
  const info = {
    name: "EPfixation",
    parameters: {

      fix_duration: {
        type: jspsych.ParameterType.INT,
        pretty_name: "fix-dur",
        array: false,
        default: 1000,
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

  class jsPsychSVGfixationPlugin {

    constructor(jsPsych) {
      this.jsPsych = jsPsych;
      this.mouse_position = {
        x: 0,
        y: 0
      }
    };


    trial(display_element, trial) {

      var trialdata = [];
      // the slide is already loaded through a loadSVG call
      // we hide the next text box so as to force reading
      // and we display the slide

      var tracktime = performance.now();
      //d3.select('#globalsvg').remove();
      var mainfixsvg

      // if a svgview is loaded, make it transparent
      d3.select(stimdef.idMain).attr('opacity', '0')

      // the method only works if there is a fixation objectID loaded in the DOM
      d3.select("#fixation").attr('opacity', '1')

      jsPsych.pluginAPI.setTimeout(() => {
        trialdata.trial_tag='fixation'
        trialdata.timeEndTrial = performance.now();
        jsPsych.finishTrial(trialdata)
      }, trial.fix_duration);


    }

  }

  jsPsychSVGfixationPlugin.info = info;

  return jsPsychSVGfixationPlugin;

})(jsPsychModule);