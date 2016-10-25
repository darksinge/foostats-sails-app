/**
* sessionAuth
*
* @module      :: Policy
* @description :: Simple policy to allow any authenticated user
*                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
* @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
*
*/







module.exports = function(req, res, next) {

   // User is allowed, proceed to the next policy,
   // or if this is the last policy, the controller

   // functions below this line are not currently being used for authentication,
   // I'm just keeping them around just in case.
   return next();

   if (process.env.NODE_ENV === 'development') {
      sails.log.info('Security bypass on route ' + req.route.path)
      return next();
   } else if (req.headers.token != process.env.API_TOKEN) {
      return res.forbidden('You are not permitted to perform this action.');
   }

   if (req.headers.token != process.env.API_TOKEN) {
      return res.forbidden('You are not permitted to perform this action.');
   }

   if (req.session.authenticated) {
      return next();
  }


   FacebookService.fetchFacebookUserAsync(req.headers, function(err, user){
      if (err) {
         if (req.wantsJSON) {
            res.json({
               success: false,
               error: 'could not fetch user from facebook. Try renewing your access token and try again.'
            })
         } else {
            return res.redirect('/');
         }
      }

      Player.findOne({email:user.email}).exec(function(err, player) {
         if (err) return res.serverError(err);

         if (!player) return res.redirect('/signup');

         req.session.authenticated = true;

         return next();
      });
   });

   request('https://graph.facebook.com/me?access_token=' + req.headers.access_token, function(error, response, body) {
      if (error) return res.serverError(error);
      var body = JSON.parse(body);
      if (body['error']) {
         return res.json({
            success: false,
            error: 'user login failed.'
         });
      }
      var user = body['name'];
      req.session.authenticated = true;
      console.log(user + ' successfully logged in.');
      return next();
   });

   // User is not allowed
   // (default res.forbidden() behavior can be overridden in `config/403.js`)
   // return res.forbidden('You are not permitted to perform this action.');
};
