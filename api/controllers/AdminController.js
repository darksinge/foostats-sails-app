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

      Player.find().exec(function(err, players) {
         if (err) { return res.serverError(err); }
         var data = {};
         data.user = req.user;
         data.players = players;
         if (fError) data.error = fError;
         if (fMessage) data.message = fMessage;
         return res.view('userViews/admin', data);
      });
   },

   adminUpdateView: function(req, res) {

      if (!req.user) {
         res.cookie('fooMessage', 'You are not logged in.');
         return res.redirect('/login');
      }

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

      if (!req.user) {
         res.cookie('fooMessage', 'You are not logged in.');
         return res.redirect('/login');
      }

      if (req.method == 'GET') {
         return res.view('userViews/adminCreateView')
      } else {
         return res.redirect('/admin');
      }
   },

   adminCreate: function(req, res, next) {

      if (!req.user) {
         res.cookie('fooMessage', 'You are not logged in.');
         return res.redirect('/login');
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
         res.cookie('fooMessage', 'You are not logged in.');
         return res.redirect('/login');
      }

      // uuid - the id of the player to be updated.
      if (!req.param('uuid')) {
         res.cookie('fooError', 'Player could not be updated - uuid was not provided.')
         return res.redirect('/admin');
      }

      Player.findOne({facebookId: req.user.facebookId}).exec(function(err, admin) {
         if (admin.role == 'admin') {
            Player.findOne({uuid: req.param('uuid')}).exec(function(err, player) {
               if (err) {
                  res.cookie('fooError', err);
                  return res.redirect('/admin');
               }

               if (req.param('role') == 'basic' && player.role == 'admin' && admin.email != 'cr.blackburn89@gmail.com') {
                  res.cookie('fooError', 'You do not have permission to change another admin\'s permission level.')
                  return res.redirect('/admin');
               }

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

                     var updatedPlayers = '';
                     if (Array.isArray(updates)) {
                        if (updates.length == 1) {
                           updatedPlayers = updates[0].firstName + ' ' + updates[0].lastName;
                        } else {
                           updatedPlayers = '<br>';
                           for (var i = 0; i < updates.length; i++) {
                              updatedPlayers += '&emsp;' + updates[i].firstName + ' ' + updates[i].lastName;
                              if (i != updates.length - 1) updatedPlayers += '<br>';
                           }
                        }
                     }
                     res.cookie('fooMessage', 'Successfully updated player: ' + updatedPlayers)
                     res.redirect('/admin');
                  }
               });
            });
         }  else {
            res.forbidden('You must be an admin to perform this action.');
         }
      });
   },

   adminDelete: function(req, res, next) {

      if (!req.user) {
         res.cookie('fooMessage', 'You are not logged in.');
         res.redirect('/login');
      }

      if (!req.user.facebookId) {
         return res.forbidden('You must have an account linked to Facebook to perform this action.');
      }

      /**
      @param {userToDestroy} - the pk of the user performing the deletion.
      */
      var userToDestroy = req.param('uuid');

      Player.findOne({facebookId: req.user.facebookId}).exec(function(error, admin) {
         if (admin.role == 'admin') {
            Player.findOne({uuid:userToDestroy}).exec(function(err, destroyee) {
               if ((destroyee.role == 'admin') && (admin.email != 'cr.blackburn89@gmail.com')) {
                  res.cookie('fooError', 'you cannot delete an admin, like seriously, what the heck is your problem.');
                  return res.redirect('/admin');
               } else if (admin.email == destroyee.email) {
                  res.cookie('fooError', 'you cannot delete yourself. Like, are you suicidal???')
                  return res.redirect('/admin');
               } else {
                  Player.destroy({uuid:userToDestroy}).exec(function(err) {
                     if (err) { return res.negotiate(err); }
                     var deleteMsg = admin.firstName + ' ' + admin.lastName + ' deleted user ' + destroyee.firstName + ' ' + destroyee.lastName;
                     sails.log.warn(deleteMsg);
                     if (req.wantsJSON) {
                        return res.json({
                           success: true,
                           message: 'user ' + destroyee.firstName + destroyee.lastName + ' successfully deleted.'
                        });
                     } else {
                        var message = 'Deleted ' + destroyee.firstName + ' ' + destroyee.lastName;
                        res.cookie('fooMessage', message);
                        return res.redirect('/admin');
                     }
                  });
               }
            });
         } else {
            return res.forbidden('You are not permitted to perform this action.');
         }
      });

   }


}
