/**

@description :: AdminController.js

*/

var _ = require('lodash');

module.exports = {

   adminDashboard: function(req, res) {

      var fError;
      if (req.param('fooError') || req.cookies.fooError) {
         fError = '';
         fError = req.param('fooError') || req.cookies.fooError;
         res.clearCookie('fooError')
      }
      var fMessage;
      if (req.param('fooMessage') || req.cookies.fooMessage) {
         fMessage = '';
         fMessage = req.param('message') || req.cookies.fooMessage;
         res.clearCookie('fooMessage')
      }

      if (req.user) {
         Player.find().exec(function(err, players) {
            if (err) {
               return res.serverError(err);
            } else {
               var data = {};

               data.user = req.user;
               data.players = players;
               if (fError) data.error = fError;
               if (fMessage) data.message = fMessage;

               return res.view('userViews/admin', data);
            }
         });
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

   adminCreateView: function(req, res) {
      if (req.method == 'GET') {
         return res.view('userViews/adminCreateView')
      } else {
         return res.redirect('/admin');
      }
   },

   adminCreate: function(req, res, next) {

      if (!req.user){
         res.cookie('fooError', 'You have been logged out.');
         return res.redirect('/');
      }

      var role = req.user.role ? req.user.role : '';
      if (role == 'admin') {
         var values = {};
         if (req.param('firstName')) values.firstName = req.param('firstName');
         if (req.param('lastName')) values.lastName = req.param('lastName');
         if (req.param('email')) values.email = req.param('email');
         if (req.param('role')) values.role = req.param('role');

         Player.create(values).exec(function(err, player) {
            if (err) res.serverError(err);
            if (req.wantsJSON) {
               return res.json({
                  success: true,
                  player: player
               })
            } else {
               res.cookie('fooMessage', 'successfully create new player.')
               return res.redirect('/admin');
            }
         });
      } else {
         return res.forbidden('You are not permitted to perform this action.');
      }
   },

   adminUpdate: function(req, res, next) {

      if (!req.user) {
         return res.redirect('/', {
            error: 'You are not logged in.'
         });
      }

      // uuid - the id of the player to be updated.
      if (!req.param('uuid')) {
         res.cookie('fooError', 'Player could not be updated - uuid was not provided.')
         return res.redirect('/admin');
      }

      var role = req.user.role ? req.user.role : '';
      if (role == 'admin') {
         var updates = {};

         if (req.param('email')) updates.email = req.param('email');
         if (req.param('firstName')) updates.firstName = req.param('firstName');
         if (req.param('lastName')) updates.lastName = req.param('lastName');
         if (req.param('teams')) updates.teams = req.param('teams');
         if (req.param('leagues')) updates.leagues = req.param('leagues');
         if (req.param('role')) updates.role = req.param('role');

         Player.update({uuid: req.param('uuid')}, updates).exec(function afterwards(err, updates) {
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
         res.forbidden('You must be an admin to perform this action.');
      }
   },

   adminDelete: function(req, res, next) {
      /**
      @param {uuid} - the pk of the user performing the deletion.
      */
      var destroyeeId = req.param('uuid');

      var options = req.headers;
      if (req.cookies.access_token) options.access_token = req.cookies.access_token;

      FacebookService.resolveAccessTokenOwnerAsync(options)
      .then(function(admin) {
         if (admin.role === 'admin') {
            Player.findOne({uuid:destroyeeId}).exec(function(err, destroyee) {
               if ((destroyee.role == 'admin') && (admin.email != 'cr.blackburn89@gmail.com')) {
                  res.cookie('fooError', 'you cannot delete an admin, like seriously, what the heck is your problem.');
                  return res.redirect('/admin');
               } else if (admin.email == destroyee.email) {
                  res.cookie('fooError', 'you cannot delete yourself. Like, are you suicidal???')
                  res.redirect('/admin');
               } else {
                  Player.destroy({uuid:destroyeeId}).exec(function(err) {
                     if (err) return res.negotiate(err);
                     var deleteMsg = admin.firstName + ' ' + admin.lastName + ' deleted user ' + destroyee.firstName + ' ' + destroyee.lastName;
                     sails.log.warn(deleteMsg);
                     if ((req.wantsJSON) || (req.options.wantsJSON)) {
                        return res.json({
                           success: true,
                           message: 'user ' + destroyee.firstName + destroyee.lastName + ' successfully deleted.'
                        });
                     } else {
                        var message = 'deleted ' + destroyee.firstName + ' ' + destroyee.lastName;
                        res.cookie('fooMessage', message);
                        return res.redirect('/admin');
                     }
                  });
               }
            });
         } else {
            return res.forbidden('You are not permitted to perform this action.');
         }
      }).catch(function(err) {
         return next(err);
      });

   }


}
