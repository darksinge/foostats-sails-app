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
   , FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function(req, res, next) {

   var verifyHandler = function(acessToken, refreshToken, profile, done) {
      console.log('erm, hello?')
      Player.findOne({facebookId: profile.id}, function(err, user) {
         if (user) {
            return done(null, user);
         } else {

            var data = {};

            if (profile.name) data.name = profile.name;
            if (profile.email) data.email = profile.email;
            if (profile.id) data.facebookId = profile.id;

            Player.create(data).exec(function(err, player) {
               return done(err, player);
            });
         }
      });
   };

   passport.serializeUser(function(user, done) {
      done(null, user.uuid);
   });

   passport.deserializeUser(function(uuid, done) {
      Player.findOne({uuid:uuid}).exec(function(err, player) {
         return (err, player);
      });
   });

   passport.use(new FacebookStrategy({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:1337/auth/facebook/callback"
   }, verifyHandler));

   passport.initialize();
   passport.session();

   console.log('poop!')
   passport.authenticate('facebook', {scope: ['id', 'name', 'email'] }, function(err, user) {
      req.logIn(user, function(err) {
         return next(err, user);
      });
   })(req, res, next);




}
