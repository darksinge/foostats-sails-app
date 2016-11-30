/**
* sessionAuth
*
* @module      :: Policy
* @description :: Simple policy to allow any authenticated user
*                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
* @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
*
*/

var passport = require('passport');

module.exports = function(req, res, next) {

   if (req.user) {
      return next();
   }

   if (req.cookies.access_token) {
      FacebookService.verifyAccessToken(req.cookies.accessToken)
      .then(function(player) {
         return next();
      })
      .catch(function(err) {
         return res.redirect('/');
      });
   } else {
      return res.redirect('/');
   }

};
