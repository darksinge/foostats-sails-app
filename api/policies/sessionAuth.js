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

   if (!req.cookies.jwtToken) {
      return res.json({
         success: false,
         error: 'jwt token not in cookies!'
      });
   }
   req.headers.authorization = 'JWT ' + req.cookies.jwtToken;

   passport.authenticate('jwt', function(err, user, info) {
      if (err) {
         return res.status(500).json({
            error: err,
            info: info,
            success: false
         });
      }

      if (!user) {
         // if (req.wantsJSON) {
            return res.json({
               success: false,
               info: info,
               error: err
            });
         // } else {
            // return res.redirect('/login');
         // }
      }

      req.user = user;
      return next();
   })(req, res);

};
