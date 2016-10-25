
var request = require('request');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var verifyHandler = function(acessToken, refreshToken, profile, done) {
    console.log('hey there');
    process.nextTick(function() {
        var values = profile._json;
        Player.findOne({email: values.email}, function(err, user) {

            if (err) {
                return done(err);
            } else if (user) {
                return done(null, user);
            } else {
                var newUser = {};

                newUser.facebookId    = values.id;
                newUser.facebookToken = acessToken;
                newUser.name          = values.name;
                newUser.email         = values.email;

                Player.create(newUser).exec(function(err, user) {
                    if (err) return done(err);
                    sails.log.info('Created new user!');
                    return done(null, user);
                });
            }
        });
    });
};

passport.serializeUser(function(user, done) {
    return cb(null, user.uuid);
});

passport.deserializeUser(function(uuid, done) {
    Player.findOne({uuid:uuid}).exec(function(err, player) {
        return cb(err, player);
    });
});

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.IS_LOCAL_ENV === 'true' ? 'http://localhost:1337/auth/facebook/callback' : 'https://foostats.herokuapp.com/auth/facebook/callback',
    profileFields: ['id', 'name', 'email']
}, verifyHandler));
