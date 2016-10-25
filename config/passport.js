var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

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

passport.serializeUser(function(user, done) {
    return done(null, user.uuid);
});

passport.deserializeUser(function(uuid, done) {
    Player.findOne({uuid:uuid}).exec(function(err, player) {
        return done(err, player);
    });
});

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.NODE_ENV === 'production' ? 'https://foostats.herokuapp.com/auth/facebook/callback' : 'http://localhost:1337/auth/facebook/callback',
    profileFields: ['id', 'name', 'email']
}, verifyHandler));

module.exports.passport = {

    facebookAuth: function(req, res) {
        passport.authenticate('facebook', {scope: 'email'})(req, res);
    },

    facebookCallback: function(req, res, next) {
        passport.authenticate('facebook', {
            failureRedirect: '/',
        })(req, res, next);
    },

    passport: passport,
}
