var jsPsychHybridinstructions = (function (jspsych) {
  'use strict';
  const info = {
    name: "EPpredict",
    parameters: {

      key_choices: {
        type: jspsych.ParameterType.STRING,
        pretty_name: "trial-position",
        default: "ALL_KEYS"// ['arrowLeft', 'ArrowRight'] //["ALL_KEYS"],
      },

      next_delay: {
        type: jspsych.ParameterType.INT,
        pretty_name: "next-delay",
        array: true,
        default: 2000,
      },

      svg_path: {
        type: jspsych.ParameterType.STRING,
        pretty_name: "svg-instruction",
        array: false,
        default: undefined,
      }


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

  class jsPsychHybridinstructionsPlugin {

    constructor(jsPsych) {
      this.jsPsych = jsPsych;
      this.mouse_position = { x: 0, y: 0 }
    };


    trial(display_element, trial) {

      var trialdata = [];
      // the slide is already loaded through a loadSVG call
      // we hide the next text box so as to force reading
      // and we display the slide

      var tracktime = performance.now();
      d3.select('#globalsvg').remove();
      var maininstructionsvg

      display_element.innerHTML = '<div class="jspsych-custom-html"><div class="jspsych-left-column"><p> '+ dat + ' </p></div></div>'




      /////////////// HELPERS FUNCTIONS /////////////////
      function waitResponse() {
        trialdata.timeNextPossible = performance.now()
          // wait for participant response
        if (trial.response_device == 'keyboard') {
          console.log('start listen')
          // start the keyboard listener
          var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
            callback_function: getResponse,
            valid_responses: trial.key_choices,
            rt_method: "performance",
            persist: false,
            allow_held_key: false,
          })
          console.log(keyboardListener)
        }
        else if (trial.response_device == 'serial') {
          socket.once('serialstring', function (e) {
            // console.log('received ' + e + ' in EP plugin!')
            var serial_choice
            //togglePerspective(serial_choice)
          })
        }
        function getResponse(info) {
          trialdata.timeEndTrial = performance.now();
          d3.select("#globalsvg").remove()
          jsPsych.finishTrial(trialdata)
        }
      }

    }

  }

  jsPsychHybridinstructionsPlugin.info = info;

  return jsPsychHybridinstructionsPlugin;

})(jsPsychModule);