const bcrypt = require("bcrypt-nodejs");
const SALT_FACTOR = 15;
const mongoose = require("mongoose");

var contactSchema = mongoose.Schema(
  {
   firstName: {type:String, default:"empty"},
   lastName: {type:String, default:"empty"},
   organization:{type:String, default:"empty"},
   phoneNumber: {type:String, default:"empty"},
   email: {type: String, default:"empty"},
   streetAddress: {type:String, default:"empty"},
   city:{type:String, default:"empty"},
   state:{type:String, default:"empty"},
   country:{type:String, default:"empty"},
   zipcode:{type:String, default:"empty"}
 }
);

var userSchema = mongoose.Schema(
  {
   firstName: {type: String, required:true},
   lastName: {type: String, required:true},
   streetAddress: {type:String, default:""},
   city:{type:String, default:""},
   state:{type:String, default:""},
   country:{type:String, default:""},
   phoneNumber: {type:String, default:""},
   email: {type: String, required:true},
   password: {type: String, required: true},
   createdAt: {type: Date, default: Date.now},
   contactList: [contactSchema]//array of user ids
 }
);



//presave action to hash the Password
var noop = function(){};

// generate a salt and use the salt in a hash to hash
//the password
// before saving password: make salt , hash password,

userSchema.pre("save", function(done){
  var user = this;
  if (!user.isModified("password")){
    return done();
  }
  bcrypt.genSalt(SALT_FACTOR, function(err, salt){
    if (err) { return done(err); }
    bcrypt.hash(user.password, salt, noop, function (err, hashPassword){
      if(err) { return done(err); }
      user.password = hashPassword;
      done();
    });
  });
});

//checks password correctness

userSchema.methods.checkPassword = function(guess, done)
{
  bcrypt.compare(guess, this.password, function(err,isMatch){
    done(err,isMatch);
  });
};


var User = mongoose.model("User", userSchema);
module.exports = User;
