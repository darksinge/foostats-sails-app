/**

@description :: AdminController.js

*/


module.exports = {

   admin: function(req, res) {

      if (req.isAuthenticated()) {
         UserService.fetchPlayer(req, function(err, user) {
            if (err) return serverError(err);
            if (!user) return res.redirect('/login');
            Player.find().exec(function(err, players) {
               return res.view('userViews/admin', {
                  user: user,
                  users: players,
                  error: err
               });
            });
         });
      } else {
         return res.forbidden('You are not permitted to perform this action.');
      }
   },

   adminCreate: function(req, res, next) {
      var options = req.headers;
      if (req.cookies.access_token) options.access_token = req.cookies.access_token || '';

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

      if (!req.param('uuid')) return res.serverError('Could not perform update. Reason: user uuid not provided.')
      var options = req.headers;
      if (!options.access_token) options.access_token = req.cookies.access_token || '';
      /**
      * @description :: resolveAccessTokenOwnerAsync - resolves the identify of the user performing the update.
      */
      FacebookService.resolveAccessTokenOwnerAsync(options)
      .then(function(user){

         if (!user) return res.serverError('Could not find user.')

         if (user.role === 'admin') {

            var updates;
            updates.uuid = req.param('uuid');
            if (req.param('email')) updates.email = req.param('email');
            if (req.param('name')) updates.name = req.param('name');
            if (req.param('teams')) updates.teams = req.param('teams');
            if (req.param('leagues')) updates.teams = req.param('leagues');
            if (req.param('role')) updates.teams = req.param('role');

            Player.update({uuid: updates.uuid}, updates).exec(function afterwards(err, updates) {
               if (err) return res.serverError(err)
               return res.json({
                  success: true,
                  updates: updates,
               });
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
