/**

@description :: UserController.js

*/

module.exports = {

   dashboard: function(req, res) {

      if (req.user) {
         Player.findOne({facebookId: req.user.facebookId}).exec(function(err, user) {
            if (err) return res.serverError(err);
            if (!user) return res.redirect('/login');
            return res.view('userViews/dashboard', {
               user: user
            });
         })
      } else {
         //TODO - change to res.redirect with params
         return res.view('login', {
            error: err,
            message: 'Your session has expired, please log in again.'
         });
      }
   },

}
