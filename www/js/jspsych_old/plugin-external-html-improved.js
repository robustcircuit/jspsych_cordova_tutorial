var jsPsychExternalHtml = (function (jspsych) {
    'use strict';

    const info = {
        name: "external-html",
        parameters: {
            /** The url of the external html page */
            url: {
                type: jspsych.ParameterType.STRING,
                pretty_name: "URL",
                default: undefined,
            },
            /** The key to continue to the next page. */
            cont_key: {
                type: jspsych.ParameterType.KEY,
                pretty_name: "Continue key",
                default: null,
            },
            /** The button to continue to the next page. */
            cont_btn: {
                type: jspsych.ParameterType.STRING,
                pretty_name: "Continue button",
                default: null,
            },
            /** Function to check whether user is allowed to continue after clicking cont_key or clicking cont_btn */
            check_fn: {
                type: jspsych.ParameterType.FUNCTION,
                pretty_name: "Check function",
                default: () => true,
            },
            /** Whether or not to force a page refresh. */
            force_refresh: {
                type: jspsych.ParameterType.BOOL,
                pretty_name: "Force refresh",
                default: false,
            },
            /** If execute_Script == true, then all JavasScript code on the external page will be executed. */
            execute_script: {
                type: jspsych.ParameterType.BOOL,
                pretty_name: "Execute scripts",
                default: false,
            },
            listener_delay: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Delay keyboard",
                default: 1000
            },
            cont_object: {
                type: jspsych.ParameterType.STRING,
                pretty_name: "Continue object",
                default: [".jspsych-back",".jspsych-continue"],
            },
            response_device: {
                type: jspsych.ParameterType.STRING,
                pretty_name: "response-device",
                array: false,
                default: 'keyboard',
            },
        },
    };
    /**
     * **external-html**
     *
     * jsPsych plugin to load and display an external html page. To proceed to the next trial, the
     * user might either press a button on the page or a specific key. Afterwards, the page will be hidden and
     * the experiment will continue.
     *
     * @author Erik Weitnauer
     * @see {@link https://www.jspsych.org/plugins/jspsych-external-html/ external-html plugin documentation on jspsych.org}
     */
    class ExternalHtmlPlugin {
        constructor(jsPsych) {
            this.jsPsych = jsPsych;
        }
        trial(display_element, trial, on_load) {
            // hold the .resolve() function from the Promise that ends the trial
            let trial_complete;
            var url = trial.url;
            var keyboardListener
            if (trial.force_refresh) {
                url = trial.url + "?t=" + performance.now();
            }
            fetch(url)
                .then((response) => {
                    return response.text();
                })
                .then((html) => {
                    display_element.innerHTML = html;
                    on_load();
                    var t0 = performance.now();
                    var keypressed;
                    const key_listener = (e) => {
                        keypressed = trial.cont_key.indexOf(e.key);
                        finish();
                    };
                    const finish = () => {
                        if (trial.check_fn && !trial.check_fn(display_element)) {
                            return;
                        }
                        if (trial.cont_key) {
                            this.jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
                        }
                        d3.select(d3.select(trial.cont_object[1])).node().on("mousedown",null);
                        d3.select(d3.select(trial.cont_object[0])).node().on("mousedown",null);
                        var trial_data = {
                            rt: Math.round(performance.now() - t0),
                            keypressed: keypressed,
                            url: trial.url,
                        };
                        display_element.innerHTML = "";
                        this.jsPsych.finishTrial(trial_data);
                        trial_complete();
                    };
                    // by default, scripts on the external page are not executed with XMLHttpRequest().
                    // To activate their content through DOM manipulation, we need to relocate all script tags
                    if (trial.execute_script) {
                        // changed for..of getElementsByTagName("script") here to for i loop due to TS error:
                        // Type 'HTMLCollectionOf<HTMLScriptElement>' must have a '[Symbol.iterator]()' method that returns an iterator.ts(2488)
                        var all_scripts = display_element.getElementsByTagName("script");
                        for (var i = 0; i < all_scripts.length; i++) {
                            const relocatedScript = document.createElement("script");
                            const curr_script = all_scripts[i];
                            relocatedScript.text = curr_script.text;
                            curr_script.parentNode.replaceChild(relocatedScript, curr_script);
                        }
                    }
                    if (trial.cont_btn) {
                        display_element.querySelector("#" + trial.cont_btn).addEventListener("click", finish);
                    }
                    if (trial.cont_key) {
                        jsPsych.pluginAPI.setTimeout(function () {
                            if (trial.response_device == 'keyboard') {
                                keyboardListener = this.jsPsych.pluginAPI.getKeyboardResponse({
                                    callback_function: key_listener,
                                    valid_responses: trial.cont_key,
                                    rt_method: "performance",
                                    persist: false,
                                    allow_held_key: false,
                                });
                                d3.select(d3.select(trial.cont_object[1])).node().on("mousedown", function (touchevent) {
                                    var touchinfo = [];
                                    touchinfo.key == 'arrowright';
                                    key_listener(touchinfo)
                                })
                                d3.select(d3.select(trial.cont_object[0])).node().on("mousedown", function (touchevent) {
                                    var touchinfo = [];
                                    touchinfo.key == 'arrowleft';
                                    key_listener(touchinfo)
                                })
                            }
                            // OR start the serial listener
                            else if (trial.response_device == 'serial') {
                                socket.once('serialstring', function (e) {
                                    // console.log('received ' + e + ' in EP plugin!')
                                    // to be implemented:
                                    var serial_choice;
                                    serial_info.rt = [];
                                    serial_info.key = [];
                                    key_listener(serial_info)
                                })
                            } else if (trial.response_device == 'touch') {
                                d3.select(d3.select(trial.cont_object[1])).node().on("touchstart", function (touchevent) {
                                    var touchinfo = [];
                                    touchinfo.key == 'arrowright';
                                    key_listener(touchinfo)
                                })
                                d3.select(d3.select(trial.cont_object[0])).node().on("touchstart", function (touchevent) {
                                    var touchinfo = [];
                                    touchinfo.key == 'arrowleft';
                                    key_listener(touchinfo)
                                })
                            }
                        }, instruction_skipdelay - 100)
                    }
                })
                .catch((err) => {
                    console.error(`Something went wrong with fetch() in plugin-external-html.`, err);
                });
            // helper to load via XMLHttpRequest
            /*const load = (element, file, callback) => {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", file, true);
            xmlhttp.onload = () => {
              console.log(`loaded ${xmlhttp.status}`)
              if (xmlhttp.status == 200 || xmlhttp.status == 0) {
                //Check if loaded
                element.innerHTML = xmlhttp.responseText;
                console.log(`made it ${xmlhttp.responseText}`);
                callback();
              }
            };
            xmlhttp.send();
          };
      
          load(display_element, url, () => {
            
          });
      */
            return new Promise((resolve) => {
                trial_complete = resolve;
            });
        }
        simulate(trial, simulation_mode, simulation_options, load_callback) {
            if (simulation_mode == "data-only") {
                load_callback();
                this.simulate_data_only(trial, simulation_options);
            }
            if (simulation_mode == "visual") {
                this.simulate_visual(trial, simulation_options, load_callback);
            }
        }
        create_simulation_data(trial, simulation_options) {
            const default_data = {
                url: trial.url,
                rt: this.jsPsych.randomization.sampleExGaussian(2000, 200, 1 / 200, true),
            };
            const data = this.jsPsych.pluginAPI.mergeSimulationData(default_data, simulation_options);
            this.jsPsych.pluginAPI.ensureSimulationDataConsistency(trial, data);
            return data;
        }
        simulate_data_only(trial, simulation_options) {
            const data = this.create_simulation_data(trial, simulation_options);
            this.jsPsych.finishTrial(data);
        }
        simulate_visual(trial, simulation_options, load_callback) {
            const data = this.create_simulation_data(trial, simulation_options);
            const display_element = this.jsPsych.getDisplayElement();
            this.trial(display_element, trial, () => {
                load_callback();
                if (trial.cont_key) {
                    this.jsPsych.pluginAPI.pressKey(trial.cont_key, data.rt);
                } else if (trial.cont_btn) {
                    this.jsPsych.pluginAPI.clickTarget(display_element.querySelector("#" + trial.cont_btn), data.rt);
                }
            });
        }
    }
    ExternalHtmlPlugin.info = info;

    return ExternalHtmlPlugin;

})(jsPsychModule);