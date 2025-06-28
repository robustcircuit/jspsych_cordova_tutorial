var jsPsychFingerTappingDemo = (function (jspsych) {
  'use strict';
  const info = {
    name: "fingertapping",
    parameters: {
      response_device: {
        type: jspsych.ParameterType.STRING,
        pretty_name: "response-device",
        array: false,
        default: 'keyboard',
      },
      finger: {
        type: jspsych.ParameterType.INT,
        pretty_name: "finger",
        array: false,
        default: 0,
      },
      trial_duration: {
        type: jspsych.ParameterType.INT,
        pretty_name: "duration",
        array: false,
        default: 5000,
      },
      key_targets: {
        type: jspsych.ParameterType.STRING,
        pretty_name: "targets",
        array: true,
        default: ['0', '1'],
      },
      instruction_duration: {
        type: jspsych.ParameterType.INT,
        pretty_name: "instruction-duration",
        array: false,
        default: 2500,
      },
      trial_tag: {
        type: jspsych.ParameterType.STRING,
        pretty_name: "tag",
        array: false,
        default: "FTP-demo",
      },
    },
  };

  /**
   * @author Romain Ligneul
   */

  var startTime = undefined;

  class jsPsychFingerTappingDemoPlugin {

    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    };

    trial(display_element, trial) {

      console.log('start')
      var context = jsPsych.pluginAPI.audioContext();
      var audio;

      // initialize variables and modules
      var fingerNames = ["left", "right"]
      var fingerTranslatedNames = ["left", "right"];
      var keyboardListener
      var keyboardListenerStart
      var trialdata = [];
      trialdata.trial_tag = trial.trial_tag;

      // remove stuff from the screen
      d3.select("#svgview").attr("opacity", "0")

      // display instructions
      d3.select("#targetStr").text(lang.ftp_demo_msg)
      d3.select("#targetStr").style('fill', 'rgb(0,0,0)')
      d3.selectAll("[id^=touch]").attr("opacity", "0")
      d3.selectAll("[id^=timeGauge]").attr("opacity", "0")
      d3.select("#gaugeText").attr('opacity', '0')
      d3.select("#touch" + trial.key_targets[0]).attr("opacity", "1")
      d3.select("#touch" + trial.key_targets[1]).attr("opacity", "1")
      d3.select("#" + fingerNames[trial.finger] + 'Finger').attr("opacity", "1")
      d3.select("#" + fingerNames[1 - trial.finger] + 'Finger').attr("opacity", "0")
      d3.select("#instructionStr").text(lang.ftp_demo_multi[0] + trial.key_targets[0] + lang.ftp_demo_multi[1] + trial.key_targets[1] + lang.ftp_demo_multi[2] + fingerTranslatedNames[trial.finger] + lang.ftp_demo_multi[3])
      d3.select("#instructionStr").style('fill', 'rgb(0,0,0)')
      d3.select("#svgview").transition().duration(100).attr("opacity", "1").on("end", function () {
        trialdata.instruction_startTime = performance.now();
        d3.select("#gaugeText").text("")
        d3.select("#gaugeText").style('fill', 'rgb(0,0,0)')
        d3.select("#timeGaugeBar").style('fill', 'rgb(255,255,255)')
        setTimeout(function () {
          trialdata.instruction_endTime = performance.now();
          d3.selectAll("[id^=timeGauge]").attr("opacity", "1")
          d3.select("#gaugeText").attr('opacity', '1')
          startTrial()
        }, trial.instruction_duration)
      })

      function startTrial() {
        d3.select("#targetStr").attr('opacity', '0')
        d3.select("#instructionStr").text(lang.ftp_alternate)
        d3.select("#" + fingerNames[trial.finger] + 'Finger')
          .transition().ease(d3.easePolyInOut.exponent(4)).duration(trial.trial_duration/4).attr("x", "150").on("end", function () {
            d3.select("#touch1").select('rect').style('fill', 'rgb(150,150,150)')
            setTimeout(function () { d3.select("#touch1").select('rect').style('fill', 'rgb(255,255,255)') }, 200)
          })
          .transition().ease(d3.easePolyInOut.exponent(4)).duration(trial.trial_duration/4).attr("x", "1400").on("end", function () {
            d3.select("#touch0").select('rect').style('fill', 'rgb(150,150,150)')
            setTimeout(function () { d3.select("#touch0").select('rect').style('fill', 'rgb(255,255,255)') }, 200)
          }).transition().ease(d3.easePolyInOut.exponent(4)).duration(trial.trial_duration/4).attr("x", "150").on("end", function () {
            d3.select("#touch1").select('rect').style('fill', 'rgb(150,150,150)')
            setTimeout(function () { d3.select("#touch1").select('rect').style('fill', 'rgb(255,255,255)') }, 200)
          }).transition().ease(d3.easePolyInOut.exponent(4)).duration(trial.trial_duration/4).attr("x", "1400").on("end", function () {
            d3.select("#touch0").select('rect').style('fill', 'rgb(150,150,150)')
            setTimeout(function () { d3.select("#touch0").select('rect').style('fill', 'rgb(255,255,255)') }, 200)
          })
        d3.select("#timeGaugeBar").transition().ease(d3.easeLinear).duration(trial.trial_duration).attr('width', 0).on('end', function () {
          // start audio
          console.log('play')
          if (context !== null) {
            startTime = context.currentTime;
            audio.start(startTime);
          } else {
            audio.play();
          }
          setTimeout(function () {
            if (context !== null) {
              audio.stop();
            } else {
              audio.pause();
            }
          }, 1000)
          setTimeout(function () {
            d3.select("#timeGaugeFrame").attr('opacity','0')
            d3.select("#instructionStr").text(lang.ftp_spacebar)
            keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
              callback_function: function () {
                jsPsych.pluginAPI.cancelAllKeyboardResponses(keyboardListener);
                d3.select("#globalsvg").remove()
                jsPsych.finishTrial(trialdata)
              },
              valid_responses: ' ',
              rt_method: "performance",
              persist: false,
              allow_held_key: false,
            })
          },1000)
        })
      }

      // load audio file
      jsPsych.pluginAPI
        .getAudioBuffer('./FTP_assets/bip.mp3')
        .then(function (buffer) {
          if (context !== null) {
            audio = context.createBufferSource();
            audio.buffer = buffer;
            audio.connect(context.destination);
          } else {
            audio = buffer;
            audio.currentTime = 0;
          }
          console.log('audioloaded')
        })
        .catch(function (err) {
          console.error(
            `Failed to load audio file. Try checking the file path. We recommend using the preload plugin to load audio files.`
          );
          console.error(err);
        });


    }

  }
  jsPsychFingerTappingDemoPlugin.info = info;

  return jsPsychFingerTappingDemoPlugin;

})(jsPsychModule);