// Initialize Firebase

var config = {
    apiKey: "AIzaSyCSq8J0nx8B-Q7g_xw4p3nlnf7w_M4OVDI",
    authDomain: "ns-test-project.firebaseapp.com",
    databaseURL: "https://ns-test-project.firebaseio.com",
    projectId: "ns-test-project",
    storageBucket: "",
    messagingSenderId: "441164425469",
    email: 'emoore@nuskin.com',
    password: 'abc123'
};
var app = firebase.initializeApp(config);
console.log("app initialized:",app);

var logoutBtn = document.getElementById("logout");
var loginAnon = document.getElementById("anonLogin");
var loginGoogle = document.getElementById("googleLogin");
var loginFb = document.getElementById("fbLogin");

logoutBtn.addEventListener("click", function(e) {
    console.log("Clicked logout");
    firebase.auth().signOut();
});

loginAnon.addEventListener("click", function(e) {
    firebase.auth().signInAnonymously().then(function(data) {
        console.log("Anonymous login");
    }).catch(function(error) {
    });
});

loginGoogle.addEventListener("click", function(e) {
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        var user = result.user;
        console.log("Logged in with google. token:",token+" user:",user);
    }).catch(function(error) {
        var errorMessage = error.message;
        console.log("Error logging in with google:",errorMessage);
    });
});

// Note: I've found that if you login with google 1st, and then subsequently login with fb that has the same
// email, you will get an error: "Error logging in with facebook: An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address."
// I think in this case you will need to link the fb account to a google account.
loginFb.addEventListener("click", function(e) {
    var provider = new firebase.auth.FacebookAuthProvider();

    firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        var user = result.user;
        console.log("Logged in with facebook. token:",token+" user:",user);
    }).catch(function(error) {
        var errorMessage = error.message;
        console.log("Error logging in with facebook:",errorMessage);
    });
});

/**
 * AUTH STATE LISTENER
 */
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        updateUserData(user);
        loadUserData(user);
    } else {
        console.log("Signed out");
        updateUserData(user);
    }
});

function updateUserData(user) {
    document.getElementById("displayName").innerHTML = user.displayName;
    document.getElementById("anonymous").innerHTML = user.isAnonymous?true:false;
    document.getElementById("email").innerHTML = user.email;
    document.getElementById("photo").src = user.photoURL;
    document.getElementById("uid").innerHTML = user.uid;
}

function loadUserData(user) {
    firebase.database().ref('/users/'+user.uid).once('value').then(function(snapshot) {
        userData = snapshot.val();
        var userDataEl = document.getElementById("userData");
        userDataEl.innerHTML = JSON.stringify(userData);
        console.log("Loaded user data:",userData);
    });
}

function addItem() {
    console.log("Adding an item!");
    var user = firebase.auth().currentUser;
    console.log("uid:",uid)
    if (!userData) {
        userData = {};
        userData.cart = {};
        userData.cart["01003610"] = 1;
    } else {
        var count = userData.cart["01003610"];
        if (!count) {
            count = 1;
        } else {
            count ++;
        }
        userData.cart["01003610"] = count;
    }

    console.log("userData:",userData);
    firebase.database().ref('users/' + user.uid).set(userData);
    loadUserData(user);
}