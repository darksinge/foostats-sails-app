/**
* AuthController
*
* @description :: Server-side logic for user authentication
* @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
*
* To override a RESTful blueprint route for a single controller, simply create
* an action in that controller with the appropriate name: find, findOne, create,
* update, destroy, populate, add or remove.
* See https://github.com/balderdashy/sails/tree/master/lib/hooks/blueprints/actions.
*
* To override the default action that all controllers use, create an
* api/blueprints folder and  add files to it with names matching the actions to
* override (e.g. find.js, findone.js, create.js, etc.). You can take a look at
* the code for the default actions in the Sails blueprints hook for a head
* start.

*/

var passport = require('passport');
var jwt = require('jsonwebtoken');

var algorithm = sails.config.passport.jwt.algorithm;
var tokenAge = sails.config.passport.jwt.tokenAge;
var audience = sails.config.passport.jwt.audience;
var secret = 'keyboardcats123';

function createToken(user) {
   if (typeof user == 'undefined') throw new Error("user is not defined");
   return jwt.sign({ user: user }, secret, {
      algorithm: algorithm,
      expiresIn: tokenAge,
      audience: audience
   });
}

module.exports = {

   facebookLogout: function(req, res) {
      req.user = null;
      res.clearCookie('jwtToken');
      res.clearCookie('access_token')
      res.clearCookie('facebook_id')
      res.clearCookie('fooError')
      res.clearCookie('fooMessage')
      return res.redirect('/');
   },

   facebook: function(req, res) {
      passport.authenticate('facebook')(req, res);
   },

   facebookCallback: function(req, res) {
      passport.authenticate('facebook', {
         failureRedirect: '/login',
         session: false
      })(req, res, function() {
         try {
            Player.findOne({uuid: req.user.uuid}).exec(function(err, user) {
               if (err) return res.json({
                  success: false,
                  error: err
               });
               if (!user) return res.json({
                  success: false,
                  error: 'User not found!'
               });
               try {
                  var token = createToken(req.user);
                  res.cookie('jwtToken', token);
                  return res.redirect('/dashboard');
               } catch(e) {
                  return res.json({
                     success: false,
                     error: e
                  });
               }
            });
         } catch(e) {
            sails.log.error(e);
            return res.serverError(e);
         }

      });
   },

   verifyUserAuth: function(req, res) {
      FacebookService.verifyAccessToken(req.param["access_token"])
      .then(function(player) {
         return res.json({
            success: true,
            player: {
               uuid: player.uuid,
               email: player.email,
               firstName: player.firstName,
               lastName: player.lastName,
               teams: player.teams,
               achievements: player.achievements,
               role: player.role,
               facebookId: player.facebookId,
               facebookToken: player.facebookToken,
            }
         });
      })
      .catch(function(err) {
         return res.json({
            success: false,
            error: err
         });
      });
   },

};
