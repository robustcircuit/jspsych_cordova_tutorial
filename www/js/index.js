/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

function uuid16Base64() {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')  // URL-safe
    .replace(/\//g, '_')
    .replace(/=+$/, '')   // remove padding
    .slice(0, 16);
}
const userId=uuid16Base64()

document.addEventListener('deviceready', onDeviceReady, false);

window.reportAcceleration = function () {
    return new Promise((resolve, reject) => {
        if (!navigator.accelerometer) {
            resolve({ status: "unavailable" });
            return;
        }

        navigator.accelerometer.getCurrentAcceleration(
            function (acceleration) {
                acceleration.status = "data";
                resolve(acceleration);
            },
            function (error) {
                resolve({ status: "error", error: error });
            }
        );
    });
};

function loadScript(src) {
  return new Promise((resolve, reject) => {
    // Prevent loading the same script twice
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

function loadStyle(href) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`link[href="${href}"]`)) {
      resolve();
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Failed to load style: ${href}`));
    document.head.appendChild(link);
  });
}

var deviceInfo

function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
    deviceInfo=device
    console.log(deviceInfo)
    cordova.plugins.firebase.auth.onAuthStateChanged(user => {
        updateUI(user);
    });
}

var db;
var databaseName = 'dbRLWM';
var databaseVersion = 1;
var sendInterval=10000;
var openRequest = window.indexedDB.open(databaseName, databaseVersion);

openRequest.onerror = function (event) {
    console.log(openRequest.errorCode);
};
openRequest.onsuccess = function (event) {
    // Database is open and initialized - we're good to proceed.
    db = openRequest.result;
};

openRequest.onupgradeneeded = function (event) {
    // This is either a newly created database, or a new version number
    // has been submitted to the open() call.
    var db = event.target.result;
    db.onerror = function () {
        console.log(db.errorCode);
    };
    // create trials store
    var storeTrials = db.createObjectStore('trials', { keyPath: 'trialId', autoIncrement: true});
    storeTrials.createIndex('trialId', 'trialId', { unique: false });
    storeTrials.createIndex('subjectId', 'subjectId', { unique: false });
    storeTrials.createIndex('sessionId', 'sessionId', { unique: false });
    storeTrials.createIndex('studyId', 'studyId', { unique: false });
    storeTrials.createIndex('sent', 'sent', { unique: false });
    storeTrials.createIndex('sendingIndex', ['subjectId', 'sessionId', 'studyId', 'sent'], { unique: false }); // NEW
    storeTrials.createIndex('findingIndex', ['subjectId', 'sessionId', 'studyId'], { unique: false }); // NEW

    // create progress store
    var storeProgress = db.createObjectStore('progress', { keyPath: 'sessionId', autoIncrement: true});
    storeProgress.createIndex('sessionId', 'sessionId', { unique: false }); 
    storeProgress.createIndex('subjectId', 'subjectId', { unique: false });
    storeProgress.createIndex('studyId', 'studyId', { unique: false });
    storeProgress.createIndex('sent', 'sent', { unique: false });
    storeProgress.createIndex('sendingIndex', ['subjectId', 'sessionId', 'studyId', 'sent'], { unique: false }); // NEW
    storeProgress.createIndex('findingIndex', ['subjectId', 'sessionId', 'studyId'], { unique: false }); // NEW

    // create expdef store
    var storeExpdef = db.createObjectStore('expdef', { keyPath: 'sessionId', autoIncrement: true});
    storeExpdef.createIndex('sessionId', 'sessionId', { unique: false });  
    storeExpdef.createIndex('subjectId', 'subjectId', { unique: false });
    storeExpdef.createIndex('studyId', 'studyId', { unique: false });   
    storeExpdef.createIndex('sent', 'sent', { unique: false }); 
    storeExpdef.createIndex('sendingIndex', ['subjectId', 'sessionId', 'studyId', 'sent'], { unique: false }); // NEW
    storeExpdef.createIndex('findingIndex', ['subjectId', 'sessionId', 'studyId'], { unique: false }); // NEW

    // create stimdef store
    var storeStimdef = db.createObjectStore('stimdef', { keyPath: 'sessionId', autoIncrement: true});
    storeStimdef.createIndex('sessionId', 'sessionId', { unique: false });    
    storeStimdef.createIndex('subjectId', 'subjectId', { unique: false });
    storeStimdef.createIndex('studyId', 'studyId', { unique: false });    
    storeStimdef.createIndex('sent', 'sent', { unique: false });
    storeStimdef.createIndex('sendingIndex', ['subjectId', 'sessionId', 'studyId', 'sent'], { unique: false }); // NEW
    storeStimdef.createIndex('findingIndex', ['subjectId', 'sessionId', 'studyId'], { unique: false }); // NEW

};


function getByCompound(storeName, object, filterSent=null) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject('Database is not initialized yet.');
            return;
        }

        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        let index
        let compoundKey
        if (filterSent===null){
            index = store.index('findingIndex');
            compoundKey = [object.subjectId, object.sessionId, object.studyId];
        } else {
            index = store.index('sendingIndex');
            compoundKey = [object.subjectId, object.sessionId, object.studyId,filterSent];
        }
        const request = index.getAll(compoundKey);

        request.onsuccess = function (event) {
            const results = event.target.result;
            resolve(results);
        };

        request.onerror = function (event) {
            reject(event.target.error);
        };
    });
}

async function sendDataFromIndexedDB(storeName,object) {

    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const index = store.index('sendingIndex');
    const compoundKey = [object.subjectId, object.sessionId, object.studyId, 0];
    const request = index.getAll(compoundKey);

    request.onsuccess = function (event) {
        var results = event.target.result;
        const baseUrl = `${window.location.protocol}//${window.location.host}`;
        if (results.length==0){
            return
        }
        fetch(`${baseUrl}/api/uploadData`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({data: results, type: storeName})
        })
        .then(response => response.json())
        .then(()=>{
            const transaction = db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            const index = store.index('sendingIndex');
            index.openCursor(compoundKey).onsuccess = function (event) {
                const cursor = event.target.result;
                if (cursor) {
                        const record = cursor.value;
                        record.sent = 1;
                        const updateRequest = cursor.update(record);
                        updateRequest.onsuccess = () => {
                        //console.log(`Updated record with key ${cursor.primaryKey}`);
                    };
                    updateRequest.onerror = () => {
                        console.error(`Failed to update record with key ${cursor.primaryKey}`);
                    };
                    cursor.continue();  // Move to the next item
                }
            }
            return
        })
        .catch(()=>{
            console.error
            return
        });
    };

}

function addItem(storeName, newEntry) {
    if (!db) {
        console.error('Database is not initialized yet.');
        return;
    }
    var store = db.transaction(storeName, 'readwrite').objectStore(storeName);
    store.add(newEntry);
};

function addExpdef(newExpdef) {
    if (!db) {
        console.error('Database is not initialized yet.');
        return;
    }
    //
    var expdefStore = db.transaction('expdef', 'readwrite').objectStore('expdef');
    if (deviceInfo){
        newExpdef.device=deviceInfo
    } else {
        newExpdef.device=userId
    }
    //
    expdefStore.add(newExpdef);
    //
    setInterval(()=>{
        fetch(`${baseUrl}/api/uploadData`, {
            method: 'HEAD'
        })
        .then(async response => {
            if (response.ok) {
                await sendDataFromIndexedDB('expdef',newExpdef)
                await sendDataFromIndexedDB('stimdef',newExpdef)
                await sendDataFromIndexedDB('progress',newExpdef)
                await sendDataFromIndexedDB('trials',newExpdef)
            } else {
                console.warn(`⚠️ Server API not accessible: ${response.status}`);
            }
        })
        .catch(error => {
            console.error('❌ Network or CORS error:', error);
        });
    }, sendInterval)
}

const firebaseConfig = {
  apiKey: "AIzaSyA7snftJ9LnAggoIopfe1GdmXF7SjXmgSg",
  authDomain: "cordovaauth-1561a.firebaseapp.com",
  projectId: "cordovaauth-1561a",
  appId: "1:645478332262:web:e33bfe768cb70ae01d3aa7",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

function register() {
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    auth.createUserWithEmailAndPassword(email, password)
    .then(userCred => {
        alert('Registered!');
        showUser(userCred.user);
    })
    .catch(error => alert(error.message));
}

function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    auth.signInWithEmailAndPassword(email, password)
    .then(userCred => {
        alert('Logged in!');
        showUser(userCred.user);
    })
    .catch(error => alert(error.message));
}

function googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
    .then(result => {
        alert('Logged in with Google!');
        showUser(result.user);
    })
    .catch(error => alert(error.message));
}

function logout() {
    auth.signOut().then(() => {
    document.getElementById('auth-container').style.display = 'block';
    document.getElementById('user-info').style.display = 'none';
    });
}

function showUser(user) {
    try{
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('user-info').style.display = 'block';
        document.getElementById('user-email').textContent = `Logged in as: ${user.email}`;
    } catch {
        console.log("No user div")
    }
}

function showAuthenticatedUI(user) {
  document.getElementById('auth-container').classList.add('d-none');
  document.getElementById('nav-bar').classList.remove('d-none');
  document.getElementById('jspsych-body').classList.remove('d-none');
  //document.getElementById('user-email').textContent = user.email;
}

function showAuthForm() {
  document.getElementById('auth-container').classList.remove('d-none');
  document.getElementById('nav-bar').classList.add('d-none');
  document.getElementById('jspsych-body').classList.add('d-none');
}

// Listen for auth state changes
auth.onAuthStateChanged(user => {
  if (user) {
    showAuthenticatedUI(user);
  } else {
    showAuthForm();
  }
});


function getCurrentUser() {
  return new Promise((resolve, reject) => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      unsubscribe(); // prevent future calls
      console.log(user)
      if (user) {
        resolve(user.uid);
      } else {
        reject("No user found");
      }
    });
  });
}

async function launchExperiment(expName){
    fetch(`./${expName}/${expName}.json`)
    .then(response => {
        if (!response.ok) throw new Error('Failed to load');
        return response.json();
    })
    .then(async expSpecs => {
        await Promise.all(expSpecs.styles.map(loadStyle))
        for (const src of expSpecs.globalModules) {
            await loadScript(src);
        }
        for (const src of expSpecs.specificModules) {
            await loadScript(expName+'/'+src);
        }
        await loadScript(expName+'/'+expSpecs.experimentScript);
    })
    .catch(error => {
        console.error(`Error loading ${expName}.json: `, error);
    });
}

// 
const baseUrl = `${window.location.protocol}//${window.location.host}`;
socket = io(baseUrl);
socket.on("error", (error) => {
    console.log("socket connection problem");
});
socket.on("connect", (e) => {
    socket.emit('register', userId);
    if (urlParams.has('TASK')){
        const TASK = urlParams.get('TASK');
        document.getElementById('auth-container').classList.add('d-none');
        document.getElementById('nav-bar').classList.add('d-none');
        document.getElementById('jspsych-body').classList.remove('d-none');
        launchExperiment(TASK)
    }
});

socket.on('execute', (data) => {
    console.log(data)
});