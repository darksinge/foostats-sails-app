


module.exports = function(req, res, next) {
   var options = req.headers;
   if (req.cookies.access_token) options.access_token = req.cookies.access_token;

   FacebookService.resolveAccessTokenOwnerAsync(options)
   .then(function(user) {
      if (!user) {
         res.cookie('fooMessage', 'session expired, please log back in.')
         return res.redirect('/login');
      } else if (user.role == 'admin') {
         return next();
      } else {
         return res.forbidden('You are not permitted to perform this action.');
      }
   }).catch(function(error) {
      return next(error);
   });
}
