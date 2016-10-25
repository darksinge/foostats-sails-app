/**

Example response => { id: '12345678910111213',
            username: undefined,
            displayName: undefined,
            name: {
                familyName: 'lastname',
                givenName: 'firstname',
                middleName: undefined
            },
            gender: undefined,
            profileUrl: undefined,
            emails: [ { value: 'fake@email.com' } ],
            provider: 'facebook',
            _raw: '{"id":"10206619507478054","last_name":"lastname","first_name":"firstname","email":"fake\\u0040email.com"}',
            _json: {
                id: '12345678910111213',
                last_name: 'lastname',
                first_name: 'firstname',
                email: 'fake@email.com' } }
*/

var request = require('request');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var verifyHandler = function(acessToken, refreshToken, profile, done) {
    process.nextTick(function() {


        console.log('ASDFADSJFKLDSAJFKLDSJKFL 3');
        Player.findOne({facebookId: profile.id}, function(err, user) {



            if (err) {
                console.log('ERROR!!!!', err);
                return done(err);
            } else if (user) {
                console.log('USER!!!!!!', user);
                return done(null, user);
            } else {
                var newUser = {};

                newUser.facebookId    = profile.id;
                newUser.facebookToken = acessToken;
                newUser.firstName     = profile._json.first_name;
                newUser.lastName      = profile._json.last_name;
                newUser.email         = profile._json.email ? profile._json.email : newUser.firstName + newUser.lastName + '@facebook.com';

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
    // console.log('ASDFADSJFKLDSAJFKLDSJKFL 1');
    return cb(null, user.uuid);
});

passport.deserializeUser(function(uuid, done) {
    // console.log('ASDFADSJFKLDSAJFKLDSJKFL 2');
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

    facebookAuth: function(req, res, next) {
        sails.log.info(process.env.NODE_ENV === 'production' ? 'in production mode.' : 'in development mode.');
        passport.authenticate('facebook', {scope: 'email'})//(req, res, next);
    },

    facebookCallback: function(req, res, next) {
        passport.authenticate('facebook', {
            failureRedirect: '/',
            successRedirect: '/dashboard'
        })//(req, res, next);
    }

}
