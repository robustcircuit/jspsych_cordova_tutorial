const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
var http = require("http");
var mongoose = require("mongoose");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const app = express();
const  socketIo = require("socket.io");
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

// Your array of collection names
const collectionNames = ['RLWM'];
// Dictionary to store models
const models = {};
// Create models for each collection
collectionNames.forEach(name => {
  const schema = new mongoose.Schema({}, {
    strict: false,
    collection: name // bind schema to specific collection
  });
  models[name] = mongoose.model(name, schema);
});

// connect to MongoDB
if (process.env.CONTEXT === "local") {
  mongoose.connect('mongodb://127.0.0.1/');
} else if (process.env.CONTEXT === "web") {
  mongoose.connect(process.env.MONGODB_URI);
}

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function callback() {
  console.log("database opened");
});

// Serve Cordova browser build
app.use(express.static(path.join(__dirname, 'www')));

app.use(cors());

app.use(bodyParser.json());

app.get('/api/getFiles', (req, res) => {
  const folder = req.query.folder;

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

app.head('/api/uploadData', (req, res) => {
  // You can still set headers/status
  res.status(200).end(); // .end() with no body
});

app.post('/api/uploadData', (req, res) => {
  if (req.body.type=='trials'){
    req.body.data.forEach((trial)=>{
        models[trial.experimentName].create(trial);
    })
  } else {
      models[req.body.data[0].experimentName].create(req.body.data[0])
  }
  res.status(200).send({ message: 'success' });
});

app.get('/api/getProfilicCode', (req, res) => {
  res.status(200).send({code: process.env.PROLIFIC_NEUROGRAD});
});

// create http server for socket
const serverhttp = http.createServer(app);
const io = socketIo(serverhttp, {
  cors: {
    origin: [
      "https://localhost:3000/",
      "https://jpnd.robustcircuit.pt",
      "http://jpnd.robustcircuit.pt",
      ,
      "http://jpnd.robustcircuit.pt",
      "http://robustcircuit.eu",
    ],
    methods: ["GET", "POST"],
  },
});

const clients = new Map(); // Store clients with identifiers

io.on('connection', (socket) => {

  socket.on('register', (userId) => {
    console.log('Client registered:', userId);
    clients.set(userId, socket.id); // Map userId to socket.id
  });

  socket.on('disconnect', () => {
    // Remove disconnected client
    for (const [userId, id] of clients.entries()) {
      if (id === socket.id) {
        console.log('Client disconnected:', userId);

        clients.delete(userId);
        break;
      }
    }
  });   
  socket.on('simulationData', (data) => {
    console.log(data)
  });  
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



// --- START THE SERVER
serverhttp.listen(process.env.PORT, function () {
  const address = serverhttp.address();
  const host = address.address === '::' ? 'localhost' : address.address;
  console.log(`Server running at:`);
  console.log(`- http://${host}:${address.port} (localhost)`);
});

