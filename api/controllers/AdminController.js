/**

@description :: AdminController.js

*/

var _ = require('lodash');

module.exports = {

   adminDashboard: function(req, res) {

      var error;
      if (req.param('fooError') || req.cookies.fooError) {
         error = '';
         error = req.param('fooError') || req.cookies.fooError;
      }
      var message;
      if (req.param('fooMessage') || req.cookies.fooMessage) {
         message = '';
         message = req.param('message') || req.cookies.fooMessage;
      }

      res.clearCookie('fooError')
      res.clearCookie('fooMessage')

      var isAuthenticated = function(user)  {

         Player.find().exec(function(err, players) {

            var data = {};
            data.user = user;
            data.users = players;
            if (error) data.error = error;
            if (message) data.message = message;

            return res.view('userViews/admin', data);
         });
      }

      var options = {}
      options.token = req.cookies.access_token ? req.cookies.access_token : req.headers.access_token;
      options.id = req.cookies.facebook_id;

      if (req.isAuthenticated()) {
         UserService.fetchPlayer(options, function(err, user) {
            if (err) {
               sails.log.error(err);
               return res.serverError(err);
            } else if (!user) {
               res.cookie('fooError', 'user not found, please try logging in again.');
               return res.redirect('/login');
            }
            res.cookie('access_token', user.facebookToken)
            return isAuthenticated(user);
         });
      } else if (options.token) {
         Player.findOne({facebookToken: options.token}).exec(function(err, user) {
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

   adminCreateView: function(req, res) {
      if (req.method == 'GET') {
         res.view('userViews/adminCreateView')
      } else {
         res.redirect('/admin');
      }
   },

   adminCreate: function(req, res, next) {
      var options = req.headers;
      if (req.cookies.access_token) options.access_token = req.cookies.access_token;

      FacebookService.resolveAccessTokenOwnerAsync(options)
      .then(function(user){
         if (user.role == 'admin') {

            var values = {};
            if (req.param('firstName')) values.firstName = req.param('firstName');
            if (req.param('lastName')) values.lastName = req.param('lastName');
            if (req.param('email')) values.email = req.param('email');
            if (req.param('role')) values.role = req.param('role');

            Player.create(values)
            .then(function(err, player) {
               if (req.wantsJSON) {
                  return res.created(player)
               }
               res.cookie('fooMessage', 'successfully create new user.')
               res.redirect('/admin');
            })
            .catch(function(err){
               return next(err);
            });
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
      console.log(req.param('role'));
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
            if (req.param('leagues')) updates.leagues = req.param('leagues');
            if (req.param('role')) updates.role = req.param('role');

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
