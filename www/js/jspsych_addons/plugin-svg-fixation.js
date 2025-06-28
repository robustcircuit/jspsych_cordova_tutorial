var jsPsychSVGfixation = (function (jspsych) {
  'use strict';
  const info = {
    name: "fixation",
    version: "1.0.2",
    data: {
      trialTag: {
        type: jspsych.ParameterType.STRING
      },
      timeOnset: {
        type: jspsych.ParameterType.FLOAT,
      },
      timeOffset: {
        type: jspsych.ParameterType.FLOAT,
      }
    },
    parameters: {
      fix_duration: {
        type: jspsych.ParameterType.INT,
        pretty_name: "fixdur",
        array: false,
        default: 1000,
      },
    },

  };
  /**
   * Simple plugin to display a fixation cross for a given duration (ms)
   * @author Romain Ligneul
   */

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

      // 
      trialdata.timeOnset = performance.now();

      // if a svgview is loaded, make it transparent
      d3.select(stimdef.idMain).attr('opacity', '0')

      // the method only works if there is a fixation objectID loaded in the DOM
      d3.select("#fixation").attr('opacity', '1')
      
      // wait, remove fixation and finish
      jsPsych.pluginAPI.setTimeout(() => {
        trialdata.trialTag='fixation'
        d3.select("#fixation").attr('opacity', '0')
        trialdata.timeOffset = performance.now();
        jsPsych.finishTrial(trialdata)
      }, trial.fix_duration);

    }

  }

  jsPsychSVGfixationPlugin.info = info;

  return jsPsychSVGfixationPlugin;

})(jsPsychModule);