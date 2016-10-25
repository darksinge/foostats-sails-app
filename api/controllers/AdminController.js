/**

@description :: AdminController.js

*/


module.exports = {

  admin: function(req, res) {

    if (req.isAuthenticated()) {

        UserService.fetchPlayer(req, function(err, user) {
            if (err) return serverError(err);
            if (!user) return res.view('userViews/admin');
            return res.view('userViews/admin', {
                user: user
            });
        });
    } else {
        return res.forbidden('You are not permitted to perform this action.');
    }
  },

  adminCreate: function(req, res, next) {
    FacebookService.resolveAccessTokenOwnerAsync(req.headers)
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

    var updates = {};
    if (req.param('uuid')) updates.uuid = req.param('uuid');

    if (!updates.uuid) return res.serverError('Could not perform update. Reason: player uuid not provided.')

    /**
    * @description :: resolveAccessTokenOwnerAsync - resolves the identify of the user performing the update.
    */
    FacebookService.resolveAccessTokenOwnerAsync(req.headers)
    .then(function(user){
      if (user.role === 'admin') {

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


}
