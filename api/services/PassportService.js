//
// var passport = require('passport')
// , FacebookStrategy = require('passport-facebook').Strategy;
//
// var verifyHandler = function(token, tokenSecret, profile, done) {
//    process.nextTick(function() {
//       Player.findOne({facebookId: profile.id}, function(err, user) {
//          if (user) {
//             return done(null, user);
//          } else {
//
//             var data = {};
//
//             if (profile.name) data.name = profile.name;
//             if (profile.email) data.email = profile.email;
//             if (profile.id) data.facebookId = profile.id;
//
//             Player.create(data).exec(function(err, player) {
//                return done(err, player);
//             });
//          }
//       });
//    });
// }
//
// passport.serializeUser(function(user, done) {
//    done(null, user.uuid);
// });
//
// passport.deserializeUser(function(uuid, done) {
//    Player.findOne({uuid:uuid}).exec(function(err, player) {
//       return (err, player);
//    });
// });

var request = require('request')
, passport = require('passport')
, FacebookStrategy = require('passport-facebook').Strategy
, _ = require('lodash');

var verifyHandler = function(acessToken, refreshToken, profile, done) {
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

// where does 'user' come from? hmm???
//
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
    callbackURL: process.env.NODE_ENV === 'production' ? 'https://foostats.herokuapp.com/auth/facebook/callback' : 'http://localhost:1337/auth/facebook/callback',
    profileFields: ['id', 'name', 'email']
}, verifyHandler));

module.exports = {

    facebookAuth: function(req, res) {
        sails.log.info(process.env.NODE_ENV === 'production' ? 'in production mode.' : 'in development mode.');
        passport.authenticate('facebook')(req, res);
    },

    facebookCallback: function(req, res, next) {
        passport.authenticate('facebook', {
            successRedirect: '/dashboard',
            failureRedirect: '/'
        })(req, res, next);
    }

}
