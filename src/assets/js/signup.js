import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('WealthifyRegister');

    form.addEventListener('submit', function (event) {
        // Prevent form submission
        event.preventDefault();

        if (validateForm()) {
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

            const app2 = initializeApp(firebaseConfig);
            const db2 = getDatabase(app2);

            const email = document.getElementById("emailCreate").value;

            // Check if the email already exists
            const dbRef = ref(db2);
            get(child(dbRef, `users/`)).then((snapshot) => {
                if (snapshot.exists()) {
                    const users = snapshot.val();
                    const emailExists = Object.values(users).some(user => user.email === email);

                    if (emailExists) {
                        showModal("This email is already registered. Please use a different email.");
                    } else {
                        // Add the new user to the database
                        const fullName = document.getElementById("fullName").value;
                        const password = document.getElementById("passwordCreate").value;

                        set(ref(db2, `users/${Date.now()}`), {
                            fullName: fullName,
                            email: email,
                            password: password,
                        }).then(() => {
                            showModal("Account Registered! Please Log In!");
                            // Modify the closeModal function to handle the redirection
                            const originalCloseModal = closeModal;
                            closeModal = function () {
                                originalCloseModal();
                                window.location.href = 'index.html'; // Redirect after modal is closed
                            };
                        }).catch((error) => {
                            console.error("Error adding account: ", error);
                        });
                    }
                } else {
                    // Add the new user to the database if no data exists yet
                    const fullName = document.getElementById("fullName").value;
                    const password = document.getElementById("passwordCreate").value;

                    set(ref(db2, `users/${Date.now()}`), {
                        fullName: fullName,
                        email: email,
                        password: password,
                    }).then(() => {
                        showModal("Account Registered! Please Log In!");
                        // Modify the closeModal function to handle the redirection
                        const originalCloseModal = closeModal;
                        closeModal = function () {
                            originalCloseModal();
                            window.location.href = 'index.html'; // Redirect after modal is closed
                        };
                    }).catch((error) => {
                        console.error("Error adding account: ", error);
                    });
                }
            }).catch((error) => {
                console.error("Error reading data: ", error);
            });
        }
    });

    // Validates the form
    function validateForm() {
        var fullName = document.getElementById('fullName').value.trim();
        var email = document.getElementById('emailCreate').value.trim();
        var password = document.getElementById('passwordCreate').value.trim();

        if (fullName === '') {
            showModal('Please enter your full name.');
            return false;
        }

        if (email === '' || !isValidEmail(email)) {
            showModal('Please enter a valid email address.');
            return false;
        }

        if (!isValidPassword(password)) {
            showModal('Password must be at least 6 characters long, contain at least one uppercase letter, and one special character.');
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



    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function isValidPassword(password) {
        // At least 6 characters, one uppercase letter, and one special character
        var passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/;
        return passwordRegex.test(password);
    }
});
