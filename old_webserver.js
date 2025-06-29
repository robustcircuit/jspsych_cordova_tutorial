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

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`)
})
