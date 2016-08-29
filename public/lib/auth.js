// Initialize Firebase
  var config = {
    apiKey: "AIzaSyCfXrpBKVGKKFIZ8MOnreNtdtLrMtHGcII",
    authDomain: "pair-programming-cea9c.firebaseapp.com",
    databaseURL: "https://pair-programming-cea9c.firebaseio.com",
    storageBucket: "pair-programming-cea9c.appspot.com",
  };
  firebase.initializeApp(config);
  // var db = firebase.database();
  // var ref = db.ref('/');
  //console.log(ref.push('hello').key); 

  firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
  } else {
    // No user is signed in.
  }
});
  $("#local-sign-in").on('submit', function(e) 
{
        e.preventDefault();
        var email = $("input[name='username']").val();
        var password = $("input[name='password']").val(); 
        console.log(email, password);
        firebase.auth().signInWithEmailAndPassword(email, password).then(function(userData){
            var email = userData.email;
            console.log(email, 'fidfodfifi');
            var user = email.split('@')[0];
            $.post( "/signin", { name: user, time: "2pm" }).then(function(){
                location.href = '/home';
              });
           
          //  location.href = '/home/' + user;
           //console.log(obj);
        }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage);
        // ...
        });
        
    });
    
    //handles signup
     $("#local-reg").on('submit', function(e) 
    {
        e.preventDefault();
        var email = $("input[name='signupEmail']").val();
        var password = $("input[name='signupPassword']").val(); 
        console.log(email, password);
        firebase.auth().createUserWithEmailAndPassword(email, password).then(function(userData){
            var user = userData.email;
            console.log(user);
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            
                switch (error.message) {
                case "auth/email-already-in-use":
                    console.log("The new user account cannot be created because the email is already in use.");
                    break;
                case "auth/invalid-email":
                    console.log("The specified email is not a valid email.");
                    break;
                default:
                    console.log("Error creating user:", error);
                }
            // ...
        });
    });
     $("#local-reg").on('submit', function(e) 
    {
        e.preventDefault();
        firebase.auth().signOut().then(function() {
        // Sign-out successful.

        }, function(error) {
        // An error happened.
        });
    });
     $("#session").on('submit', function(e) 
    {
        e.preventDefault();
        var sess_name = $("input[name='session_name']").val();
        console.log(sess_name);
        var db = firebase.database();
        var ref = db.ref("session-id");
        console.log(ref.push({session:sess_name},function(error){
            if (error) {
                alert("Data could not be saved." + error);
            } else {
                location.href = '/session/'+ sess_name;
            }
        }));
        
        
    });