from flask import Flask, request, redirect, render_template
import firebase_admin
from firebase_admin import credentials, db

# Initialize Flask app
app = Flask(__name__, template_folder="templates")

# Initialize Firebase Admin SDK
cred = credentials.Certificate(r"C:\FBLA-CaP\src\fbkey\fbla-cap-firebase-adminsdk-fbsvc-6708e66fb4.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://fbla-cap-default-rtdb.firebaseio.com/' 
})

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form["email"]
        password = request.form["password"]
        try:
            # Check user credentials in Firebase Realtime Database
            users_ref = db.reference("users")
            users = users_ref.get()

            for user_id, user_data in users.items():
                if user_data["email"] == email and user_data["password"] == password:
                    return redirect("/home")  # Login successful
            return redirect(f"/login?error=Invalid email or password!&email={email}")
        except Exception as e:
            return redirect(f"/login?error={e}&email={email}")

    error = request.args.get("error")
    email = request.args.get("email", "")  # Retain the entered email
    return render_template("login.html", error=error, email=email)

@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        email = request.form["email"]
        password = request.form["password"]
        try:
            # Check if the email already exists in Firebase Realtime Database
            users_ref = db.reference("users")
            users = users_ref.get()
            
            if users:  # If there are existing users
                for user_id, user_data in users.items():
                    if user_data["email"] == email:
                        return redirect(f"/signup?error=Email already registered!&email={email}")

            # Add new user to Firebase Realtime Database
            new_user_ref = users_ref.push({
                "email": email,
                "password": password
            })
            return redirect("/login")  # Redirect to login after successful signup
        except Exception as e:
            return redirect(f"/signup?error={e}&email={email}")

    error = request.args.get("error")
    email = request.args.get("email", "")  # Retain the entered email
    return render_template("signup.html", error=error, email=email)

@app.route("/home")
def home():
    return render_template("home.html")

if __name__ == "__main__":
    app.run(debug=True)
