/**
* AuthController
*
* @description :: Server-side logic for user authentication
* @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
*
* To override a RESTful blueprint route for a single controller, simply create
* an action in that controller with the appropriate name: find, findOne, create,
* update, destroy, populate, add or remove.
* See https://github.com/balderdashy/sails/tree/master/lib/hooks/blueprints/actions.
*
* To override the default action that all controllers use, create an
* api/blueprints folder and  add files to it with names matching the actions to
* override (e.g. find.js, findone.js, create.js, etc.). You can take a look at
* the code for the default actions in the Sails blueprints hook for a head
* start.

*/

var passport = require('passport');

module.exports = {

    facebookLogout: function(req, res) {
        if (!req.session.user) return res.redirect('/')
        req.session.user = null;
        return res.redirect('/');
    },

    facebook: function(req, res) {
        PassportService.facebookAuth(req, res)
    },

    facebookCallback: function(req, res) {

        PassportService.facebookCallback(req, res, function(err, user) {

            if (err) {
                sails.log.error('AuthController.js\n', err);
                return res.redirect('/');
            } else if (!user) {
                sails.log.error('Null User passed back from facebook callback.')
                return res.redirect('/');
            }

            req.logIn(user, function(err) {
                if (err) return res.serverError(err);
                return res.view('/userViews/dashboard', {
                    user: user
                });
            });
            // var uuid = req.session.passport.user;
            // Player.findOne({uuid:uuid}).exec(function(err, player) {
            //     if ((err) || (!player)) return res.view('404');
            //
            //     sails.log.info('Facebook authentication successful!');
            //
            //     req.user = player;
            //     req.session.authenticated = true;
            //     return res.redirect('userViews/dashboard', {
            //         user: req.user
            //     });
            // });
        });
    },

};
