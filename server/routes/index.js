// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');

// define the user model
let UserModel = require('../models/users');
let User = UserModel.User; // alias for User Model - User object

// define the game model
let contact = require('../models/contactlist');

// create a function to check if the user is authenticated
function requireAuth(req, res, next) {
  // check if the user is logged in
  if(!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  next();
}

/* GET home page. wildcard */
router.get('/', (req, res, next) => {
  res.render('content/index', {
    title: 'Home',
    games: '',
    displayName: req.user ? req.user.displayName : ''
   });
});

/* GET contact page. */
router.get('/contact', (req, res, next) => {
  res.render('content/contact', {
    title: 'Contact',
    games: '',
    displayName: req.user ? req.user.displayName : ''
   });
});

// GET /login - render the login view
router.get('/login', (req, res, next)=>{
  // check to see if the user is not already logged in
  if(!req.user) {
    // render the login page
    res.render('auth/login', {
      title: "Login",
      contacts: '',
      messages: req.flash('loginMessage'),
      displayName: req.user ? req.user.displayName : ''
    });
    return;
  } else {
    return res.redirect('/contacts'); // redirect to games list
  }
});

// POST /login - process the login attempt
router.post('/login', passport.authenticate('local', {
  successRedirect: '/contacts',
  failureRedirect: '/login',
  failureFlash: 'bad login'
}));

// GET /register - render the registration view
router.get('/register', (req, res, next)=>{
   // check to see if the user is not already logged in
  if(!req.user) {
    // render the registration page
      res.render('auth/register', {
      title: "Register",
      contacts: '',
      messages: req.flash('registerMessage'),
      displayName: req.user ? req.user.displayName : ''
    });
    return;
  } else {
    return res.redirect('/contacts'); // redirect to games list
  }
});

// POST / register - process the registration submission
router.post('/register', (req, res, next)=>{
  User.register(
    new User({
      username: req.body.username,
      //password: req.body.password,
      email: req.body.email,
      displayName: req.body.displayName
    }),
    req.body.password,
    (err) => {
      if(err) {
        console.log('Error inserting new user');
        if(err.name == "UserExistsError") {
          req.flash('registerMessage', 'Registration Error: User Already Exists');
        }
        return res.render('auth/register', {
          title: "Register",
          contacts: '',
          messages: req.flash('registerMessage'),
          displayName: req.user ? req.user.displayName : ''
        });
      }
      // if registration is successful
      return passport.authenticate('local')(req, res, ()=>{
        res.redirect('/contacts');
      });
    });
});

// GET /logout - process the logout request
router.get('/logout', (req, res, next)=>{
  req.logout();
  res.redirect('/'); // redirect to the home page
});

module.exports = router;
