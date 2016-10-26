/**

@description :: UserController.js

*/

module.exports = {

   dashboard: function(req, res) {

      var accessToken = req.headers.access_token || req.cookies.access_token;

      if (!accessToken) {
         return res.view('login', {
            message: 'There was an error, please try logging in again.'
         });
      }

      FacebookService.verifyAccessTokenAsync(accessToken)
      .then(function(user) {
         if (req.isAuthenticated()) {
            console.log('1');
            return res.view('userViews/dashboard', {
               user: req.user
            });
         } else {
            console.log('2');
            req.logIn(user, function(err) {
                if (err) return res.serverError(err);
                res.cookie('access_token', user.facebookToken);
                console.log(user);
                return res.view('userViews/dashboard', {
                   user: user
                });
            });
         }
      }).catch(function(err) {
         //TODO - change to res.redirect with params
         return res.view('login', {
            error: err,
            message: 'Your session has expired, please try logging in again.'
         });
      });
   },

}
