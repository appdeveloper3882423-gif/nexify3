/* Firebase client setup. No Firebase Storage is used anywhere in this project.
   Keep your Firestore rules enabled. Never put a service-account key in browser code. */
(function () {
  const config = {
    apiKey: "AIzaSyC-2CfgunsKXrohHQQskBFCJABNbwpxH1k",
    authDomain: "nexify-60191.firebaseapp.com",
    projectId: "nexify-60191",
    messagingSenderId: "758096770616",
    appId: "1:758096770616:web:11fc9fe92554e6530718cd"
  };
  window.NEXIFY = { app: null, auth: null, db: null, ready: false, error: null };
  try {
    if (!window.firebase) throw new Error("Firebase SDK did not load. Check your internet connection.");
    const app = firebase.apps.length ? firebase.app() : firebase.initializeApp(config);
    window.NEXIFY.app = app;
    window.NEXIFY.auth = firebase.auth();
    window.NEXIFY.db = firebase.firestore();
    window.NEXIFY.ready = true;
  } catch (error) {
    window.NEXIFY.error = error;
    console.error("Nexify Firebase initialization:", error);
  }
})();