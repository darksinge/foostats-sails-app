/**

@description :: UserController.js

*/

var bluebird = require('bluebird');
var Promse =

var findUser(accessToken, next) {
   Player.findOne({facebookToken: accessToken}).exec(function(err, player) {
      return (err, player)
   });
}

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
          return res.redirect('/login');
      }

      Player.findOne({uuid: uuid}).exec(function(err, player) {
          if (err) return res.serverError(err);
          if (!player) {

              req.flash('error', 'There was an error, please try logging in again.')
              return res.redirect('/login');
          }
          console.log('PLAYER', player);
          return res.view('userViews/dashboard', {
              user: player
          });
      });
  },

}
