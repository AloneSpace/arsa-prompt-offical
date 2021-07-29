const admin = require("firebase-admin");
let serviceAccount = require("../config/arsa-prompt-offical-firebase-adminsdk-aov6q-764569afd3.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

module.exports = {
    admin,
};
