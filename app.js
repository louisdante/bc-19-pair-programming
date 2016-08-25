var express = require('express'),
    expresshbs = require('express-handlebars'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    TwitterStrategy = require('passport-twitter'),
    GoogleStrategy = require('passport-google'),
    FacebookStrategy = require('passport-facebook');
firebase = require("firebase");

// var config = require('./config.js'), //config file contains all tokens and other private info
//    funct = require('./functions.js'); //funct file contains our helper functions for our Passport and database work

//This section will contain our work with passport..

//--------------EXPRESS----------------
var app = express();
// Configure Express
//app.use(logger('combined'));
app.use(cookieParser());
app.use(session({ secret: 'supernova' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
// app.use(passport.initialize());
// app.use(passport.session());
//  write4 s middleware te protectes te app route
// // Session-persisted message middleware
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
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

//---------------ROUTES----------------
//this holds our routes
//displays our homepage
app.get('/', function(req, res) {
    console.log('got here???')
    res.render('home', { user: req.user });
});

//displays our signup page
app.get('/signin', function(req, res) {
    res.render('signin');
});

app.post('/signin', function(req, res) {
    sess = req.session;
    sess.email = req.bodyParser.username;
    console.log(sess)
    res.render('home');
});

//displays our app page
app.get('/home/:email', function(req, res) {
    //console.log(req.session);
    //console.log(req.params.email);
    sess = req.session;
    console.log(sess.email);
    var user = req.params.email;
    //console.log(req.session);
    //req
    //if ()
    res.render('home');
});

//logs user out of site, deleting them from the session, and returns to homepage
app.get('/logout', function(req, res) {
    var name = req.user.username;
    console.log("LOGGIN OUT " + name);
    req.logout();
    res.redirect('/');
    req.session.notice = "You have successfully been logged out " + name + "!";
});


//------------------PORT--------------------
var port = process.env.PORT || 3000; //select your port or let it pull from your .env file
app.listen(port);
console.log("listening on " + port + "!");