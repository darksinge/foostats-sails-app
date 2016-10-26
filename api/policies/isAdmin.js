


module.exports = function(req, res, next) {
   var options = req.headers;
   if (req.cookies.access_token) options.access_token = req.cookies.access_token;

   FacebookService.resolveAccessTokenOwnerAsync(options)
   .then(function(user) {
      if (user.role == 'admin') {
         return next();
      } else {
         return res.forbidden('You are not permitted to perform this action.');
      }
   }).catch(function(error) {
      return next(error);
   });
}
