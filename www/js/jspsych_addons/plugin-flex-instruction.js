var jsPsychFlexInstruction = (function (jspsych) {
  'use strict';
  const info = {
    name: "FlexSurvey",
    data: {
      response: {
        type: jspsych.ParameterType.INT,
      },
      rt:{
        type: jspsych.ParameterType.FLOAT,
      },
      timeOnset: {
        type: jspsych.ParameterType.FLOAT,
      }
    },
    parameters: {
      content: {
        default: {},
        type: jspsych.ParameterType.COMPLEX,
        array: false,
        pretty_name: "instructionObject",
      },
      trialTag: {
        default: "instruction",
        type: jspsych.ParameterType.STRING,
        array: false,
        pretty_name: "trialTag",

      },
      defaultResponse:{
        default: 1,
        type: jspsych.ParameterType.INT,
        array: false,
        pretty_name: "defaultResponse",
      },
      inputArray:{
        default: [],
        type: jspsych.ParameterType.STRING,
        array: true,
        pretty_name: "inputArray",       
      }
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

      var trialdata = {
        response: trial.defaultResponse,
        rt: -1.0,
        timeOnset:performance.now()
      };
      var min_duration=10
      if (trial.content.hasOwnProperty('min_duration')){
        min_duration=trial.content.min_duration
      }

      console.log(trial.content)

      var displayElement="#"+jsPsych.getDisplayContainerElement().id;

      d3.select(displayElement)
        .append('div')
        .attr('class', 'jspsych-custom-html')
        .attr('id', 'main-customhtml')     
        .style('align-items','center')
        .style('margin', 'auto')


      var mainhtml = d3.select('#main-customhtml')

      if (trial.content.hasOwnProperty('title')) {
        mainhtml.append('div')
          .attr('class', 'jspsych-title')
          .attr('id', 'custom-title')
          .html(trial.content.title)
      }

      for (var i = 0; i < trial.content.divs.length; i++) {
        if (!trial.content.divs[i].hasOwnProperty('inputArrayIdx')){
          mainhtml.append('div')
            .attr('class', trial.content.divs[i].class)
            .attr('id', 'box' + i)
            .html(trial.content.divs[i].html)
        } else {
          mainhtml.append('div')
            .attr('class', trial.content.divs[i].class)
            .attr('id', 'box' + i)
            .html(trial.inputArray[trial.content.divs[i].inputArrayIdx])          
        }

      }

      if ((trial.content.hasOwnProperty('next')) | (trial.content.hasOwnProperty('back'))){
        d3.select(displayElement).append('div')
        .attr('class', 'lowerbar')
        .attr('id', 'lowerbar')     
        .style('align-items','center')
      }
      if (trial.content.hasOwnProperty('back')) {
        d3.select("#lowerbar").append('div')
        .attr('class', 'jspsych-back')
        .attr('id', 'back-button')
        .html(trial.content.back)
        .style('visibility', 'hidden')
      }  
      if (trial.content.hasOwnProperty('next')) {
        d3.select("#lowerbar").append('div')
        .attr('class', 'jspsych-next')
        .attr('id', 'next-button')
        .html(trial.content.next)
        .style('visibility', 'hidden')
      }    

      // collect response and finish trial
      function getResponse(key){
        jsPsych.pluginAPI.clearAllTimeouts();
        jsPsych.pluginAPI.cancelAllKeyboardResponses(keyboardListener);
        trialdata.rt=performance.now() - trialdata.timeOnset;
        if (key.key == expdef.keyBack) {
          trialdata.response = -1;
        } else if (key.key == expdef.keyNext) {
          trialdata.response = 1;
        }
        mainhtml.remove()
        d3.select("#lowerbar").remove()
        if ((expdef.keyMode != 'mouse') & (expdef.instructionMouse)){
          d3.select(displayElement).on('mousedown', null)
        } else if (expdef.keyMode == 'touch'){
          d3.select(displayElement).on('touch', null)
        }
        jsPsych.finishTrial(trialdata)
      }

      // if a max_duration has been set, force trial end when it elapses
      if (trial.content.hasOwnProperty('max_duration')){
        jsPsych.pluginAPI.clearAllTimeouts();
        jsPsych.pluginAPI.cancelAllKeyboardResponses(keyboardListener);
        jsPsych.pluginAPI.setTimeout(() => {
          mainhtml.remove()
          d3.select("#lowerbar").remove()
          if ((expdef.keyMode != 'mouse') & (expdef.instructionMouse)){
            d3.select(displayElement).on('mousedown', null)
          } else if (expdef.keyMode == 'touch'){
            d3.select(displayElement).on('touch', null)
          }
          jsPsych.finishTrial(trialdata)
        }, trial.content.max_duration);
      }

      // locate touch / mouse
      function checkHitEvent(pt,type) {
        var touchinfo = {};
        if (trial.content.hasOwnProperty('next')) {
          var nextBB = document.getElementById('next-button').getBoundingClientRect();
          if (pt.x > nextBB.x && pt.x < (nextBB.x + nextBB.width) && pt.y > nextBB.y && pt.y < (nextBB.y + nextBB.height)) {
              touchinfo.key = expdef.keyNext;
              d3.select(displayElement).on(type, null)
              getResponse(touchinfo)                    
          }
        }
        if (trial.content.hasOwnProperty('back')) {
          console.log(trial.content.hasOwnProperty('back'))
          var backBB = document.getElementById('back-button').getBoundingClientRect();
          if (pt.x > backBB.x && pt.x < (backBB.x + backBB.width) && pt.y > backBB.y && pt.y < (backBB.y + backBB.height)) {
            touchinfo.key = expdef.keyBack;
            d3.select(displayElement).on(type, null)
            getResponse(touchinfo)
          }
        }
      }

      // wait for response      
      jsPsych.pluginAPI.setTimeout(()=>{
        d3.select("#next-button").style('visibility', 'visible')
        d3.select("#back-button").style('visibility', 'visible')
        // response management
        if (expdef.keyMode == 'keyboard') {
          keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
            callback_function: getResponse,
            valid_responses: expdef.keyCodes,
            rt_method: "performance",
            persist: false,
            allow_held_key: false,
          })
        }
        if (expdef.keyMode == 'touch'){
          d3.select(displayElement).on("touchstart", function (touchevent) {
            var pt = {x:touchevent.touches[0].clientX,y:touchevent.touches[0].clientY}         
            checkHitEvent(pt,'touchstart')
          })
        }
        if ((expdef.keyMode == 'mouse') | (expdef.instructionMouse)) {
          d3.select(displayElement).on("mousedown", function (mouseevent) {
            var pt = {x:mouseevent.clientX,y:mouseevent.clientY}    
            checkHitEvent(pt,'mousedown')
          });
        }    
      }, min_duration)


    }

  }
  jsPsychFlexInstructionPlugin.info = info;

  return jsPsychFlexInstructionPlugin;

})(jsPsychModule);