var express = require("express");
var User = require("./models/user");
var passport = require("passport");
var router = express.Router();
var path = require("path");

router.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.errors = req.flash("error");
  res.locals.infos = req.flash("info");
  next();
});

router.get("/", function(req, res, next){
    if (res.locals.currentUser){
    res.render("index");
    }
    else {
        res.redirect("/login");
      }
});

router.get("/signup", function(req, res){
  res.render("signup");
});

router.post("/signup", function(req, res, next){
  var email = req.body.email;
  var password = req.body.password;
  User.findOne({ email:email }, function(err, user){
  if (err) { return next(err); }
  if (user) {
    req.flash("error","User already exists");
    return res.redirect("/signup");
  }
  var newUser = new User ({
    password:password,
    email:email,
    firstName:req.body.firstname,
    lastName:req.body.lastname
  });
  newUser.save(next);
});//end findOne
}, //end first callback
 passport.authenticate("login", {
   successRedirect: "/",
   failureRedirect: "/signup",
   failureFlash: true
 }));


router.get("/login", function(req, res){
  res.render("login");
});

router.post("/login", passport.authenticate("login",{
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true
}));

router.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});


router.get("/addContact",function(req,res){
  if (res.locals.currentUser){
  res.render("addcontact");
  }
  else {
      res.redirect("/login");
    }
});

router.post("/addContact",function(req, res){
  var newContact = {
  firstName:req.body.firstname,
  lastName:req.body.lastname,
  organization:req.body.organization,
  phoneNumber:req.body.phoneNumber,
  email:req.body.email,
  streetAddress: req.body.streetAddress,
  city: req.body.city,
  state: req.body.state,
  country: req.body.country,
  zipcode:req.body.zipcode
  };
  req.user.contactList.push(newContact);
  req.user.save(function(){
  req.flash("info","New Contact Added")
  res.redirect("/");
  });
});

router.get("/editContact",function(req, res){
  console.log("here");
  var contact_id = req.query.contact_id;
  var contact = req.user.contactList.filter(function(contact){
    console.log(contact.id);
    console.log(contact_id);
    return contact.id == contact_id;})[0];
  res.render("editcontact",{contact:contact})
});

router.post("/editContact",function(req, res){
  var contact_id = req.body.contact_id;
  var updatedContact = {
  firstName:req.body.firstname,
  lastName:req.body.lastname,
  organization:req.body.organization,
  phoneNumber:req.body.phoneNumber,
  email:req.body.email,
  streetAddress: req.body.streetAddress,
  city: req.body.city,
  state: req.body.state,
  country: req.body.country,
  zipcode:req.body.zipcode
  };
  for (var i = 0; i<req.user.contactList.length; i++)
  {
    if (req.user.contactList[i].id === contact_id){
      req.user.contactList[i] = updatedContact;
      break;
    }
  }
  req.user.save(function(){
    req.flash("info","Edited Contact");
    res.redirect("/");
  });
});

router.post("/delete", function(req, res){
  var contact_id = req.body.contact_id;
  req.user.contactList = req.user.contactList.filter(function(contact){
    return contact.id !== contact_id;
  });
  req.user.save( function(){
    req.flash("info","Removed Contact");
    res.redirect("/");
  });
});

router.get("/public/styles.css",function(req,res){
  res.sendFile(path.join(__dirname,"public","styles.css"));
});


module.exports = router;
