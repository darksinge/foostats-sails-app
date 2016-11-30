
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var verifyHandler = function(accessToken, refreshToken, profile, done) {
   process.nextTick(function() {
      var values = profile._json;
      Player.findOne({facebookId: values.id}).exec(function(err, user) {
         if (err) {
            return done(err);
         } else if (user) {
            if (accessToken != user.facebookToken) {
               Player.update({facebookId: user.facebookId}, {facebookToken: accessToken}).exec(function(err, players) {
                  if (err) { sails.log.error(err); } else { sails.log.info('updated user access token'); }
               });
            }
            return done(null, user);
         } else {
            var newUser = {};

            newUser.facebookId    = values.id;
            newUser.facebookToken = accessToken;
            newUser.firstName     = values.first_name ? values.first_name : profile.name.givenName;
            newUser.lastName      = values.last_name ? values.last_name : profile.name.familyName;

            if (typeof values.email == 'undefined') {
               newUser.email = newUser.firstName + newUser.lastName + '@foostats.com';
            } else if (Array.isArray(values.email)) {
               if (values.email.length > 0) {
                  newUser.email = values.email[0];
               } else {
                  newUser.email = newUser.firstName + newUser.lastName + '@foostats.com';
               }
            } else if (typeof values.email == 'string') {
               newUser.email = values.email;
            }

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
