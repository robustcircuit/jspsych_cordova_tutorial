var jsPsychFlexInstruction = (function (jspsych) {
  'use strict';
  const info = {
    name: "FlexSurvey",
    parameters: {
      content: {
        default: null,
        type: jspsych.ParameterType.STRING,
        array: false,
        pretty_name: "instruction-object",
      },
      min_duration: {
        default: 2000,
        type: jspsych.ParameterType.STRING,
        array: false,
        pretty_name: "mean-duration",
      },
    },
  };

  /**
   * **Paired-Associate Learning: Show Patterns plugin**
   * **Romain Ligneul, 2022, romain.ligneul@gmail.com**
   * @author Romain Ligneul
   */

  var startTime = undefined;

  class jsPsychFlexInstructionPlugin {

    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    };

    trial(display_element, trial) {

      // initialize variables and modules
      var keyboardListener
      var trialdata = []; // Object.assign({}, trial);

      d3.select("#jspsych-content")
        .append('div')
        .attr('class', 'jspsych-custom-html')
        .attr('id', 'mainhtml')     
        .style('position', 'relative')
        .style('width', '100%')  
        .style('height', '100%')  
        .style('left', 0)
        .style('top', 0)
        .style('align-items','center')
        .style('margin', 'auto')



      var mainhtml = d3.select('#mainhtml')

      mainhtml.append('div')
        .attr('class', 'jspsych-survey-title')
        .attr('id', 'title')
        .html(trial.content.title)

      for (var i = 0; i < trial.content.divs.length; i++) {
        console.log(trial.content.divs[i])
        if (trial.content.divs[i].hasOwnProperty('text')) {
          mainhtml.append('div')
            .attr('class', 'jspsych-text-simple')
            .attr('id', 'text' + i)
            .html(trial.content.divs[i].text)
        }

      }

      trialdata = [];
      trialdata.displayTime=performance.now();

      mainhtml.append('div')
      .attr('class', 'jspsych-survey-continue')
      .attr('id', 'continue')
      .html(trial.content.continue)
      .style('visibility', 'hidden')
      .on('mousedown', function(){
        trialdata.RT = performance.now()-trialdata.displayTime;
        d3.select("#mainhtml").remove()
        jsPsych.finishTrial(trialdata)
      })

      jsPsych.pluginAPI.setTimeout(()=>{
        d3.select("#continue").style('visibility', 'visible')
      }, trial.min_duration)


    }

  }
  jsPsychFlexInstructionPlugin.info = info;

  return jsPsychFlexInstructionPlugin;

})(jsPsychModule);