// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.login__form');

    form.addEventListener('submit', function (event) {
        // Prevent form submission
        event.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        if (validateLoginForm(email, password)) {
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

            const app = initializeApp(firebaseConfig);
            const db = getDatabase(app);

            const dbRef = ref(db);
            get(child(dbRef, `users/`)).then((snapshot) => {
                if (snapshot.exists()) {
                    const users = snapshot.val();
                    const user = Object.values(users).find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

                    if (user) {
                        showModal("Login Successful! Redirecting...");

                        // Modify the closeModal function to handle redirection
                        const originalCloseModal = closeModal;
                        closeModal = function () {
                            originalCloseModal();
                            window.location.href = 'home.html'; 
                        };
                    } else {
                        showModal("Invalid email or password. Please try again.");
                    }
                } else {
                    showModal("No registered users found. Please sign up first.");
                }
            }).catch((error) => {
                console.error("Error reading data: ", error);
                showModal("An error occurred while processing your login. Please try again later.");
            });
        }
    });

    // Validate login form input
    function validateLoginForm(email, password) {
        if (email === '' || !isValidEmail(email)) {
            showModal('Please enter a valid email address.');
            return false;
        }

        if (password === '') {
            showModal('Please enter your password.');
            return false;
        }

        return true; // Form is valid
    }

    // Show the modal with a message
    function showModal(message) {
        document.getElementById('modalMessage').innerText = message;
        document.getElementById('customModal').style.display = 'block';
        document.getElementById('modalBackdrop').style.display = 'block';
    }

    // Validate email format
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
});
