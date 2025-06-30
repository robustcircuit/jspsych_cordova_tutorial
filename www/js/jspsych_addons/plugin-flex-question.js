var jsPsychFlexQuestion = (function (jspsych) {
  'use strict';
  const info = {
    name: "FlexQuestion",
    data: {
      response: {
        type: jspsych.ParameterType.INT,
      },
      rt:{
        type: jspsych.ParameterType.FLOAT,
      },
      timeOnset: {
        type: jspsych.ParameterType.FLOAT,
      },
      correct: {
        type: jspsych.ParameterType.INT,
      }
    },
    parameters: {
      content: {
        default: null,
        type: jspsych.ParameterType.COMPLEX,
        array: false,
        pretty_name: "item-object",
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
      trialTag: {
        default: 'flex-question',
        type: jspsych.ParameterType.STRING,
        array: false,
        pretty_name: "trial-tag",
      },
      buttonBaseBackground: {
        default: "rgb(220, 220, 220)",
        type: jspsych.ParameterType.STRING,
        array: false,
        pretty_name: "question-baseColor",
      },
      buttonSelectedBackground:{
        default: "rgb(200, 200, 235)",
        type: jspsych.ParameterType.STRING,
        array: false,
        pretty_name: "question-selectColor",
      },
      buttonChosenBackground: {
        default: "rgb(180, 180, 255)",
        type: jspsych.ParameterType.STRING,
        array: false,
        pretty_name: "question-chosenColor",
      },
      buttonErrorBackground: {
        default: "rgb(207, 97, 97)",
        type: jspsych.ParameterType.STRING,
        array: false,
        pretty_name: "question-chosenColor",
      },
      buttonCorrectBackground: {
        default: "rgb(71, 187, 106)",
        type: jspsych.ParameterType.STRING,
        array: false,
        pretty_name: "question-chosenColor",
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
   * **Paired-Associate Learning: Show Patterns plugin**
   * **Romain Ligneul, 2022, romain.ligneul@gmail.com**
   * @author Romain Ligneul
   */

  var startTime = undefined;

  class jsPsychFlexQuestionPlugin {

    constructor(jsPsych) {
        this.jsPsych = jsPsych;
    };

    trial(display_element, trial) {

        const jsPsych=this.jsPsych

        // initialize variables and modules
        var keyboardListener

        var trialdata = {
            response: null,
            rt: -1.0,
            timeOnset:performance.now(),
            correct: -1
        };

        var min_duration=10
        if (trial.content.hasOwnProperty('min_duration')){
        min_duration=trial.content
        }

        var displayElement="#"+trial.expdef.jspsychParentDiv;

        /*
        const wrapper = document.querySelector('.jspsych-content-wrapper');
        wrapper.style.flex="none"
        wrapper.style.height="0px"
        wrapper.style.margin="0px"
        */

        d3.select(displayElement)
        .append('div')
        .attr('class', 'jspsych-custom-html')
        .attr('id', 'main-customhtml')     
        .style('align-items','center')
        .style('margin', 'auto')


        var mainhtml = d3.select('#main-customhtml')

        if (trial.content.hasOwnProperty('prompt')) {
        mainhtml.append('div')
            .attr('class', trial.content.prompt_class)
            .attr('id', 'custom-prompt')
            .html(trial.content.prompt)
        }

        var hitCount=[]
        for (var i = 0; i < trial.content.options.length; i++) {
            mainhtml.append('div')
            .attr('class', trial.content.options_class)
            .attr('id', 'option' + i)
            .html(trial.content.options[i].html)
            hitCount.push(0)
        }

        if (trial.content.hasOwnProperty('validation')) {
            mainhtml.append('div')
            .attr('class', 'jspsych-validation')
            .attr('id', 'validation-button')
            .html(trial.content.next)
            .style('visibility', 'hidden')
        }

        // collect response and finish trial
        function getResponse(response){
            jsPsych.pluginAPI.clearAllTimeouts();
            jsPsych.pluginAPI.cancelAllKeyboardResponses(keyboardListener);
            trialdata.rt=performance.now() - trialdata.timeOnset;
            trialdata.response = response;
            if (trial.content.hasOwnProperty('correct_response')){
                if (trial.content.correct_response==response){
                    trialdata.correct=1
                    d3.select('#option' + response).style("background-color", trial.buttonCorrectBackground)
                } else {
                    trialdata.correct=0
                    d3.select('#option' + response).style("background-color", trial.buttonErrorBackground)
                }
            }
            jsPsych.pluginAPI.setTimeout(()=>{
                mainhtml.remove()
                jsPsych.finishTrial(trialdata)
            },trial.postchoiceDur)
        }

        // if a max_duration has been set, force trial end when it elapses
        if (trial.content.hasOwnProperty('max_duration')){
            jsPsych.pluginAPI.clearAllTimeouts();
            jsPsych.pluginAPI.cancelAllKeyboardResponses(keyboardListener);
            jsPsych.pluginAPI.setTimeout(() => {
                mainhtml.remove()
                jsPsych.finishTrial(trialdata)
            }, trial.content.max_duration);
        }

        if (trial.content.hasOwnProperty('tip')){
            mainhtml.append('div')
            .attr('class', 'jspsych-row-simple')
            .attr('class', 'tip')
            .style('text-align', 'center')
            .attr('id', 'tip')
            .html(trial.tip)
        }

        // locate touch / mouse
        function checkHitEvent(pt,type) {
            for (var i = 0; i < trial.content.options.length; i++) {
                var optionBB = document.getElementById('option' + i).getBoundingClientRect();
                if (pt.x > optionBB.x && pt.x < (optionBB.x + optionBB.width) && pt.y > optionBB.y && pt.y < (optionBB.y + optionBB.height)) {
                    hitCount[i]+=1
                    if (hitCount[i]==2){
                        if (!trial.content.hasOwnProperty('correct_response')){
                            d3.select('#option' + i).style("background-color", trial.buttonChosenBackground)
                        }
                        getResponse(i)
                        d3.select(displayElement).on(type, null)
                    } else {
                        hitCount=hitCount.map(() => 0);
                        for (var ii = 0; ii < trial.content.options.length; ii++) {
                            if (ii!=i){
                                d3.select('#option' + ii).style("background-color", trial.buttonBaseBackground)
                            } else {
                                console.log("here")
                                d3.select('#option' + ii).style("background-color", trial.buttonSelectedBackground)
                            }
                        }
                        hitCount[i]+=1
                    }
                }
            }
        }

        if (trial.expdef.keyMode == 'touch'){
            d3.select(displayElement).on("touchstart", function (touchevent) {
            var pt = {x:touchevent.touches[0].clientX,y:touchevent.touches[0].clientY}         
            checkHitEvent(pt,'touchstart')
            })
        }
        if ((trial.expdef.keyMode == 'mouse') | (trial.expdef.instructionMouse)) {
            d3.select(displayElement).on("mousedown", function (mouseevent) {
            var pt = {x:mouseevent.clientX,y:mouseevent.clientY}    
            checkHitEvent(pt,'mousedown')
            });
        }    


    }
    
  }
  jsPsychFlexQuestionPlugin.info = info;

  return jsPsychFlexQuestionPlugin;

})(jsPsychModule);