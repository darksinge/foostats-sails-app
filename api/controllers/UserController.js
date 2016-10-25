/**

@description :: UserController.js

*/


module.exports = {

  dashboard: function(req, res) {

      var uuid = undefined;
      if (req.session) {
          if (req.session.passport) {
              if (req.session.passport.user) {
                  uuid = req.session.passport.user;
              }
          }
      }

      if (!uuid) {
          req.flash('error', 'There was an error, please try logging in again.')
          return res.redirect('/');
      }

      Player.findOne({uuid: uuid}).exec(function(err, player) {
          if (err) return res.serverError(err);
          if (!player) {

              req.flash('error', 'There was an error, please try logging in again.')
              return res.redirect('/');
          }
          return res.view('userViews/dashboard', {
              user: player
          });
      });
  },

}
