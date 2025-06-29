const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const https = require('https');
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const app = express();
const { Server } = require("socket.io");
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
require("dotenv").config();
const os = require('os');

admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.FIREBASE_TYPE,
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    clientId: process.env.FIREBASE_CLIENT_ID,
    authUri: process.env.FIREBASE_AUTH_URI,
    tokenUri: process.env.FIREBASE_TOKEN_URI,
    authProviderX509CertUrl: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    clientC509CertUrl: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universeDomain: process.env.FIREBASE_UNIVERSE_DOMAIN,
  }),
});

// Function to get local network IP address
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost'; // fallback
}

// Setup serial port
const arduinoPort = new SerialPort({
  path: 'COM5',
  baudRate: 9600,
});

// Parse newline-separated data
const parser = arduinoPort.pipe(new ReadlineParser({ delimiter: '\n' }));

// Buffers
let gsrBuffer = [];

const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'ssl', 'server.key')),
  cert: fs.readFileSync(path.join(__dirname, 'ssl', 'server.cert')),
};

// Serve Cordova browser build
app.use(express.static(path.join(__dirname, 'www')));

app.use(cors());

app.use(bodyParser.json());

app.get('/api/getFiles', (req, res) => {
  const folder = req.query.folder;

  console.log(folder)
  if (!folder) {
    return res.status(400).json({ error: 'Missing folder parameter' });
  }

  // Normalize and restrict folder path to within www/img only
  const basePath = path.join(__dirname, 'www');
  const requestedPath = path.join(basePath, folder);

  // Prevent path traversal attacks
  if (!requestedPath.startsWith(basePath)) {
    return res.status(403).json({ error: 'Access denied' });
  }

  fs.readdir(requestedPath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return res.status(500).json({ error: 'Failed to read directory' });
    }

    res.json(files);

  });
});

app.get('/api/getEnv', (req, res) => {

  return res.json({CONTEXT: process.env.CONTEXT, ARDUINO: process.env.CONTEXT})

});
// Start HTTPS server
const serverhttps =https.createServer(sslOptions, app).listen(process.env.PORT, () => {
  const address = serverhttps.address();
  const host = address.address === '::' ? 'localhost' : address.address;
  const localIp = getLocalIpAddress();
  console.log(`HTTPS server running at:`);
  console.log(`- https://${host}:${address.port} (localhost)`);
  console.log(`- https://${localIp}:${address.port} (local network)`);
  //console.log(`HTTPS server running at ???:${PORT}`);
});

// Middleware to verify Firebase ID token
async function verifyFirebaseToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.status(401).send("Unauthorized");

  const idToken = authHeader.split("Bearer ")[1];
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).send("Invalid token");
  }
}

app.get("/profile", verifyFirebaseToken, async (req, res) => {
  const user = await admin.auth().getUser(req.user.uid);
  res.json({
    uid: user.uid,
    email: user.email,
    name: user.displayName,
  });
});

///////////////////////////////////////////////////////////
///// LOCAL EXPERIMENT : SOCKET + SERIAL COMMUNICATION
//////////////////////////////////////////////////////////
/*
When the experiment is run locally (e.g. in the lab), it will
often be associated with some physiological measurements
These measurements need to be recorded and synchronized with
the behavioral experiment.
Most neuroimaging devices (EEG,MEG,MRI, etc) and physiological 
apparatuses will either communicate directly over USB/serial ports
or send synchronization signals through such ports.
Therefore we use our server to harvest serial data.
We combine this serial data recording with a socket that allows 
real-time communication with our behavioral experiment.
This is required to synchronize the behavioral data with neuro/physio
signals.
*/
if (process.env.CONTEXT=='local'){
  var gsrFilepath
  var hbFilepath
  var syncFilepath
  var allowWrite=false
  const logDir='logfiles'
  const io = new Server(serverhttps, {
    cors: {
      origin: [
        `https://192.168.1.41:${process.env.PORT}`
      ],
      methods: ["GET", "POST"],
    },
  });
  // manage input data from socket
  io.on("connection", (socket) => {
    socket.on("expdef", (expdef) => {
      const subjectLogDir = path.join(__dirname,logDir,expdef.studyId,expdef.subjectId, 'beh');
      fs.mkdir(subjectLogDir, { recursive: true }, (err) => {
        if (err) {
          return console.error('Failed to create directory:', err);
        } else {
          // write expdef
          fs.writeFile(path.join(subjectLogDir,`${expdef.subjectId}_${expdef.sessionId}_expdef.json`), JSON.stringify(expdef, null, 2), (err) => {
            if (err) {
              return console.error('Error writing JSON:', err);
            }
          });
          if (process.env.ARDUINO=='true'){
            gsrFilepath=path.join(subjectLogDir,`${expdef.subjectId}_${expdef.sessionId}_gsr.csv`)
            hbFilepath=path.join(subjectLogDir,`${expdef.subjectId}_${expdef.sessionId}_hb.csv`)
            syncFilepath=path.join(subjectLogDir,`${expdef.subjectId}_${expdef.sessionId}_sync.csv`)
            fs.writeFileSync(gsrFilepath, 'arduinoMS,gsrValue\n');
            fs.writeFileSync(hbFilepath, 'arduinoMS\n');
            fs.writeFileSync(syncFilepath, 'arduinoMS,experimentMS\n');
            allowWrite=true
          }
        }
      });
    });
    socket.on("stimdef", (stimdef) => {
      const subjectLogDir = path.join(__dirname,logDir,stimdef.studyId,stimdef.subjectId, 'beh');
      fs.mkdir(subjectLogDir, { recursive: true }, (err) => {
        if (err) {
          return console.error('Failed to create directory:', err);
        } else {
          // write expdef
          fs.writeFile(path.join(subjectLogDir,`${stimdef.subjectId}_${stimdef.sessionId}_stimdef.json`), JSON.stringify(stimdef, null, 2), (err) => {
            if (err) {
              return console.error('Error writing JSON:', err);
            }
          });
        }
      })
    })
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
    if (process.env.ARDUINO=='true'){
      // Parse serial data
      parser.on('data', (line) => {
        line = line.trim();
        if (!allowWrite){
          return
        }
        if (line.startsWith('GSRms')) {
          const parts = line.split(',');
          if (parts.length >= 4) {
            const arduinoMS = parts[1];
            const value = parts[3];
            gsrBuffer.push(`${arduinoMS},${value}`);
          }
        } else if (line.startsWith('HBms')) {
          const parts = line.split(',');
          if (parts.length >= 2) {
            const arduinoMS = parts[1];
            fs.appendFile(hbFilepath, `${arduinoMS}\n`, (err) => {
              if (err) console.error('Error writing HB data:', err);
            });
          }
        } else if (line.startsWith('SYNCms')) {
          const parts = line.split(',');
          if (parts.length >= 2) {
            const arduinoMS = parts[1];
            if (socket) {
              socket.emit("syncRequest", { arduinoMS }, (response) => {
                const experimentMS=response.experimentMS;
                fs.appendFile(syncFilepath, `${arduinoMS},${experimentMS}\n`, (err) => {
                  if (err) console.error('Error writing SYNC data:', err);
                });
              });
            }
          }
        }
      });
      // Flush buffers every second
      setInterval(() => {
        if (gsrBuffer.length > 0) {
          fs.appendFile(gsrFilepath, gsrBuffer.join('\n') + '\n', (err) => {
            if (err) console.error('GSR write error:', err);
          });
          gsrBuffer = [];
        }
      }, 1000); // Adjust interval as needed
    }
  });
}