var jsPsychFlexSurvey = (function (jspsych) {
  'use strict';
  const info = {
    name: "FlexSurvey",
    parameters: {
      item: {
        default: null,
        type: jspsych.ParameterType.STRING,
        array: false,
        pretty_name: "item-object",
      },
      isinput: {
        default: false,
        type: jspsych.ParameterType.BOOL,
        array: false,
        pretty_name: "item-isinput",
      },      
      tip: {
        default: "Click twice to move forward",
        type: jspsych.ParameterType.STRING,
        array: false,
        pretty_name: "question-tip",
      },
      postchoiceDur: {
        default: 300,
        type: jspsych.ParameterType.INT,
        array: false,
        pretty_name: "question-tip",
      },
      item_number: {
        default: null,
        type: jspsych.ParameterType.INT,
        array: false,
        pretty_name: "item-number",
      },
      trial_tag: {
        default: 'unknown-question',
        type: jspsych.ParameterType.INT,
        array: false,
        pretty_name: "question",
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
    }
  };

  /**
   * **Paired-Associate Learning: Show Patterns plugin**
   * **Romain Ligneul, 2022, romain.ligneul@gmail.com**
   * @author Romain Ligneul
   */

  var startTime = undefined;

  class jsPsychFlexSurveyPlugin {

    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    };

    trial(display_element, trial) {

      const jsPsych=this.jsPsych

      // initialize variables and modules
      var keyboardListener
      var trialdata = []; // Object.assign({}, trial);

      // get baseline item color

      console.log(trial.item)

      d3.select("#jspsych-content")
        .append('div')
        .attr('class', 'jspsych-custom-html')
        .attr('id', 'mainhtml')
        .style('position', 'absolute')
        .style('width', '100%')
        .style('margin-top','5%')
        .style('left', 0)
        .style('top', 0)
        .style('align-items','center')

      var mainhtml = d3.select("#mainhtml")

      mainhtml.append('div')
        .attr('class', 'jspsych-prompt-simple')
        .attr('id', 'title')
        .style('position', 'relative')
        .html(trial.item.prompt)


      trialdata.displayTime = performance.now()
      if (trial.isinput){

        mainhtml.append('div')
          .attr('class', 'jspsych-input-container')
          .append('input')
          .attr('type', 'text')
          .attr('id', 'user-input')
          .attr('placeholder', trial.tip)
          .style('width', '80%')
          .style('padding', '10px')
          .style('font-size', '16px');

        // Create validate button
        mainhtml.append('button')
          .attr('id', 'validate-button')
          .text(lang.continue_button)
          .style('margin-top', '10px')
          .style('padding', '10px 20px')
          .style('font-size', '16px')
          .on('click', function () {
            const userInput = d3.select('#user-input').property('value');
            if (userInput.trim() !== '') {
              trialdata.choice = userInput;
              trialdata.rt = performance.now() - trialdata.displayTime;
              trialdata.item_number = trial.item_number;
              trialdata.trial_tag = trial.trial_tag;
              jsPsych.pluginAPI.clearAllTimeouts();
              mainhtml.remove();
              d3.select('#tip').remove();
              console.log(trialdata);
              jsPsych.finishTrial(trialdata);
            } else {
              alert(trial.tip);
            }
          });
      } else {
        for (var i = 0; i < trial.item.options.length; i++) {
          mainhtml.append('div')
            .attr('class', 'jspsych-answer-simple')
            .attr('id', 'options' + [i + 1].toString())
            .html(trial.item.options[i])
            .on('mousedown', function () {
              if (d3.select("#" + this.id).style("background-color") == trial.expdef.buttonSelectedBackground) {
                d3.select("#" + this.id).style("background-color", trial.expdef.buttonChosenBackground)
                jsPsych.pluginAPI.setTimeout(() => {
                  trialdata.choice = parseInt(this.id[this.id.length-1])
                  trialdata.rt = performance.now()-trialdata.displayTime;
                  trialdata.item_number=trial.item_number;
                  trialdata.trial_tag=trial.trial_tag
                  jsPsych.pluginAPI.clearAllTimeouts();
                  mainhtml.remove()
                  d3.select('#tip').remove()
                  console.log(trialdata)
                  jsPsych.finishTrial(trialdata)
                }, trial.postchoiceDur)
              } else {
                d3.selectAll("[id^=options]").style("background-color", trial.expdef.buttonBaseBackground)
                d3.select("#" + this.id).style("background-color", trial.expdef.buttonSelectedBackground)
              }
            })
        }
      }

      d3.select("#jspsych-content").append('div')
        .attr('class', 'jspsych-row-simple')
        .style('text-align', 'center')
        .style('font-size', '100%')
        .style('position', 'absolute')
        .style('top', '94%')
        .style('left',0)
        .style('width', '100%')
        .attr('id', 'tip')
        .html(trial.tip)


      /*
      this.jsPsych.pluginAPI.setTimeout(() => {
        jsPsych.finishTrial(trialdata)
      }, trial.durDisplay + 1000)
      */



    }

  }
  jsPsychFlexSurveyPlugin.info = info;

  return jsPsychFlexSurveyPlugin;

})(jsPsychModule);