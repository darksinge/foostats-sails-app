/**

@description :: AdminController.js

*/

var _ = require('lodash');

module.exports = {

   adminDashboard: function(req, res) {
      if (req.method == 'POST') {
         var error = req.param('error');
         var message = req.param('message');
      }

      var isAuthenticated = function(user)  {
         Player.find().exec(function(err, players) {
            return res.view('userViews/admin', {
               user: user,
               users: players,
               error: error,
               message: message
            });
         });
      }

      var token = req.cookies.access_token;

      if (req.isAuthenticated()) {
         UserService.fetchPlayer(req, function(err, user) {
            if (err) {
               sails.log.error(err);
               return res.serverError(err);
            } else if (!user) {
               var errorMessage = encodeURIComponent('user not found, please try logging in again.');
               return res.redirect('/login?error=' + errorMessage);
            }
            return isAuthenticated(user);
         });
      } else if (token) {
         Player.findOne({facebookToken: token}).exec(function(err, user) {
            if ((err) || (!user)) return res.forbidden('You are not permitted to perform this action.');
            return isAuthenticated(user);
         })
      } else {
         return res.forbidden('You are not permitted to perform this action.');
      }

   },

   adminUpdateView: function(req, res) {
      var updateeId = req.param('uuid');

      if(!updateeId) {
         var errorMessage = encodeURIComponent('user\'s id was not provided. Take a hike.');
         return res.redirect('/admin?error=' + errorMessage)
      }

      var adminToken = req.headers.access_token || req.cookies.access_token;

      Player.findOne({facebookToken:adminToken}).exec(function(err, admin) {
         if (err){
            var errorMessage = encodeURIComponent('admin not found! Take a hike. This is actually a pretty serious problem... you should probably tell someone...');
            return res.redirect('/admin?error=' + errorMessage)
         } else {
            Player.findOne({uuid:updateeId}).exec(function(err, updatee) {
               if (err) {
                  return res.serverError(err);
               } else if (!updatee) {
                  var errorMessage = encodeURIComponent('user not found. Take a hike.');
                  return res.redirect('/admin?error=' + errorMessage)
               } else {
                  return res.view('userViews/adminUpdateView', {
                     user: admin,
                     updatee: updatee
                  });
               }
            });
         }
      });
   },

   adminCreate: function(req, res, next) {
      var options = req.headers;
      if (req.cookies.access_token) options.access_token = req.cookies.access_token;

      FacebookService.resolveAccessTokenOwnerAsync(options)
      .then(function(user){
         if (user.role == 'admin') {

            var values = {
               email: req.param('email'),
               name: req.param('name'),
            }

            Player.create(values)
            .then(function(player) {
               return res.created(player)
            })
            .catch(function(err){
               return next(err)
            })

         } else {
            return res.forbidden('You are not permitted to perform this action.');
         }
      }).catch(function(error) {
         return next(error);
      })
   },

   adminUpdate: function(req, res, next) {
      // uuid - the id of the player to be updated.
      if (!req.param('uuid')) return res.serverError('Could not find uuid parameter.')
      
      var options = req.headers;
      if (!options.access_token) options.access_token = req.cookies.access_token;
      /**
      * @description :: resolveAccessTokenOwnerAsync - resolves the identify of the user performing the update.
      */
      FacebookService.resolveAccessTokenOwnerAsync(options)
      .then(function(user){

         if (!user) return res.serverError('Could not find user.')

         if (user.role === 'admin') {

            var updates = {};
            updates.uuid = req.param('uuid');
            if (req.param('email')) updates.email = req.param('email');
            if (req.param('firstName')) updates.firstName = req.param('firstName');
            if (req.param('lastName')) updates.lastName = req.param('lastName');
            if (req.param('teams')) updates.teams = req.param('teams');
            if (req.param('leagues')) updates.teams = req.param('leagues');
            if (req.param('role')) updates.teams = req.param('role');

            Player.update({uuid: updates.uuid}, updates).exec(function afterwards(err, updates) {
               if (res.wantsJSON) {
                  return res.json({
                     success: true,
                     updates: updates,
                     error: err
                  });
               } else {
                  res.redirect('/admin');
               }
            });

         } else {
            return res.forbidden('You are not permitted to perform this action.');
         }
      }).catch(function(error) {
         return next(error);
      })
   },

   adminDelete: function(req, res, next) {
      /**
      @param {uuid} - the pk of the user performing the update.
      */
      var uuid = req.param('uuid');

      FacebookService.resolveAccessTokenOwnerAsync(req.headers)
      .then(function(user) {
         if (user.role === 'admin') {

            Player.destroy({uuid:uuid}).exec(function(err) {
               if (err) return res.negotiate(err);
               if (req.wantsJSON || req.options.wantsJSON) {
                  return res.json({
                     success: true,
                     message: 'User successfully deleted.'
                  });
               } else {
                  return res.redirect('/admin');
               }
            });

         } else {
            return res.forbidden('You are not permitted to perform this action.');
         }
      }).catch(function(err) {
         return next(err);
      })

   }


}
