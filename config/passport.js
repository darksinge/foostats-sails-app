var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

const SECRET = 'keyboardcats123';
const AUDIENCE = 'foostats.herokuapp.com';
const TOKEN_AGE = 60 * 24 * 7;
const ALGORITHM = 'HS256';

var jwtStrategyConfig = {
   secretOrKey: SECRET,
   audience: AUDIENCE,
   jwtFromRequest: function jwtTokenExtractor(req) {
      var token = null;

      if (req && req.cookies && req.cookies.jwtToken) {
         token = req.cookies.jwtToken;
      } else if (req && req.param('jwtToken')) {
         token = req.param('jwtToken');
      } else if (req && req.headers.authorization) {
         var authValue = req.headers.authorization;
         if (authValue.includes('Bearer')) {
            var value = authValue.split('Bearer')[1];
            if (value) token = value.trim();
         } else if (authValue.includes('JWT')) {
            var value = authValue.split('JWT')[1];
            if (value) token = value.trim();
         }
      }

      return token;
   },
};

var facebookStrategyConfig = {
   clientID: process.env.FACEBOOK_APP_ID,
   clientSecret: process.env.FACEBOOK_APP_SECRET,
   callbackURL: process.env.NODE_ENV == 'production' ? 'https://foostats.herokuapp.com/auth/facebook/callback' : 'http://localhost:1337/auth/facebook/callback',
   profileFields: ['id', 'name', 'email']
}

var facebookAuthHandler = function(accessToken, refreshToken, profile, done) {
   var values = profile._json;
   Player.findOne({facebookId: values.id}).exec(function(err, user) {
      if (err) { return done(err); }

      if (!user) {
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
      } else {
         if (accessToken != user.facebookToken) {
            Player.update({facebookId: user.facebookId}, {facebookToken: accessToken}).exec(function(err, players) {
               if (err) {
                  sails.log.error(err);
               } else {
                  sails.log.info('updated user access token');
               }
            });
         }

         return done(null, user);
      }
   });
};

function jwtAuthHandler(payload, done) {
   Player.findOne({uuid: payload.user.uuid}).exec(function(err, player) {
      if (err) {
         return done(err, false);
      }

      if (!player) {
         var error = new Error('User does not exist.', 'passport.js');
         error.name = 'E_USER_NOT_FOUND'
         return done(null, false, { message: error });
      }

      return done(null, player);
   });
}

passport.use(new FacebookStrategy(facebookStrategyConfig, facebookAuthHandler));

passport.use(new JwtStrategy(jwtStrategyConfig, jwtAuthHandler));

module.exports.passport = {
   jwt: {
      tokenAge: TOKEN_AGE,
      algorithm: ALGORITHM,
      audience: AUDIENCE
   },
}
