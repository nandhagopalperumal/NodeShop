var LocalStrategy = require('passport-local').Strategy,
	FacebookStrategy = require('passport-facebook').Strategy;
var bcrypt = require('bcrypt-nodejs');
var Admin = require('../Model/Admin');
var Users = require('../Model/Users');

module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
		done(null, user);
	});
	
	passport.deserializeUser(function(data, done) {
		if(data.type == 'admin'){
			Admin.findById(data.id,function(err, user) {
				done(err, user);
			});
		}else{
			Users.findById(data.id,function(err, user) {
				done(err, user);
			});
		}	
    });
	   

	passport.use('local-login', new LocalStrategy({
			usernameField:'email',
			passwordField:'password',
			passReqToCallback:true
	 },
	 function(req,email,password,done) {
	 	Admin.findOne({ email: email }, function(err, user) {
	 		if(err){
	 			return done(err);
                //throw err
            }
            var dataExportt = new Admin();
            var actual;
            if (user != null){
             actual = dataExportt.validPassword(password, user.password);
            }
	 		if(!actual){
	 			return done(null, false);
            }else{
             	return done(null, user);
            } 
	 	});
	}));

	passport.use('local-userLogin', new LocalStrategy({
			usernameField:'email',
			passwordField:'password',
			passReqToCallback:true
	},
	 function(req,email,password,done) {
	 	Users.findOne({ email: email }, function(err, user) {
	 		if(err){
	 			return done(err);
                //throw err
            }
            var UsersObj = new Users();
            var actual ;
            if (user != null){
             actual = UsersObj.validPassword(password, user.password);
            }
	 		if(!actual){
	 			return done(null, false);
            }else{
             	return done(null, user);
            } 
	 	});
	}));

	passport.use(new FacebookStrategy({
		clientID: "1533309866767182",
		clientSecret: "5cddd6fb28fedbd60bb415c9974ceb3f",
		callbackURL: "http://localhost:1050/#/facebook/callback"
	},
		function(accessToken, refreshToken, profile, done) {
			//User.findOrCreate(..., function(err, user) {
				//if (err) { return done(err); }
				console.log(profile);
				done(null, profile);
			//});
		}
	));
};
