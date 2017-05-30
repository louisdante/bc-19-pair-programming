var express = require('express'),
    expresshbs = require('express-handlebars'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    _ = require('lodash'),
    firebase = require("firebase");


//init firebase
var config = {

};

//init firebase
firebase.initializeApp(config);

//init realtime database
var db = firebase.database().ref("session-id");



// var config = require('./config.js'), //config file contains all tokens and other private info
//    funct = require('./functions.js'); //funct file contains our helper functions for our Passport and database work



//--------------EXPRESS----------------
var app = express();
// Configure Express
//app.use(logger('combined'));
app.use(cookieParser());
app.use(session({ secret: 'supernova' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));

app.use('/signin', function(req, res, next) {
        if (!req.session.username) {
            next();
        } else {
            res.redirect("/home/" + req.session.username);
        }
    })
    //  write a middleware that protectes te app route
function authChecker(req, res, next) {
    if (req.session.username) {
        //res.redirect("/home/" + req.session.username);
        next();
    } else {
        res.redirect("/signin");
    }
}

// Session-persisted message middleware
app.use(function(req, res, next) {
    var err = req.session.error,
        msg = req.session.notice,
        success = req.session.success;

    delete req.session.error;
    delete req.session.success;
    delete req.session.notice;

    if (err) res.locals.error = err;
    if (msg) res.locals.notice = msg;
    if (success) res.locals.success = success;

    next();
});
var sess;

// Configure express to use handlebars templates
var hbs = expresshbs.create({
    defaultLayout: 'main', //we will be creating this layout shortly
});
app.use(express.static(path.join(__dirname, 'public')));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

//---------------ROUTES----------------

//displays our homepage
app.get('/', function(req, res) {
    console.log(req.session.username, '');
    console.log('got here???')
    res.render('home', { user: req.user });
});

//displays our signup page
app.get('/signin', function(req, res) {
    res.render('signin');
});

//post session information
app.post('/signin', function(req, res) {
    req.session.username = req.body.name;
    res.status(200).json('ok');
});

//displays our app page
app.get('/home', authChecker, function(req, res) {
    sess = req.session;
    var user = sess.username;
    console.log(user);
    res.render('home', { user: user });
});

//create new session route
app.get('/session/:session', authChecker, function(req, res) {
    var user = req.session.username;
    console.log(user);
    var session = req.params.session;
    console.log(session, 'sessions')
    var dbs = firebase.database().ref("session-id").child(session);
    dbs.on('value', function(snapshot) {
        console.log('got yere');
        var page_sess = snapshot.val();
        if (!_.includes(page_sess.user, user)) {
            res.redirect('/home');
        } else {
            console.log(page_sess, 'active session');
            res.render('home', { user: user, session: session, activeSession: JSON.stringify(page_sess) });
        }
    });
});


app.get('/logout', function(req, res) {
    var sess = req.session;
    var user = sess.username
    console.log("LOGGIN OUT " + user);
    req.session.destroy(function() {
        res.redirect('/');
    });
});


//------------------PORT--------------------
var port = process.env.PORT || 3000; //select your port or let it pull from your .env file
app.listen(port);
console.log("listening on " + port + "!");
