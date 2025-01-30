// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAh401N1L6B7pH8ptuUJn1RQqIgsmA_wxA",
    authDomain: "fbla-cap.firebaseapp.com",
    databaseURL: "https://fbla-cap-default-rtdb.firebaseio.com",
    projectId: "fbla-cap",
    storageBucket: "fbla-cap.firebasestorage.app",
    messagingSenderId: "1077354575909",
    appId: "1:1077354575909:web:17cf430d6d1506e8a767cc",
    measurementId: "G-GED46SP8LQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Check if user is logged in
onAuthStateChanged(auth, (user) => {
    if (!user) {
        // Redirect to login page if user is not authenticated
        window.location.href = "index.html";
    }
});

// Logout function
document.getElementById('logoutBtn').addEventListener('click', function () {
    signOut(auth).then(() => {
        console.log("User signed out successfully");
        window.location.href = "index.html"; // Redirect to login page
    }).catch((error) => {
        console.error("Error signing out:", error);
    });
});
