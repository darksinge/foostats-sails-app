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

// var passport = require('passport');
var passport = sails.config.passport;

module.exports = {

    facebookLogout: function(req, res) {
        req.logout();
        req.authenticated = false;
        res.clearCookie('access_token')
        res.clearCookie('facebook_id')
        res.clearCookie('fooError')
        res.clearCookie('fooMessage')
        return res.redirect('/');
    },

    facebook: function(req, res) {
        return passport.facebookAuth(req, res);
    },

    facebookCallback: function(req, res) {
        return passport.facebookCallback(req, res, function(err) {
            if (err) {
                sails.log.error(err);
                return res.redirect('/login');
            }

            req.logIn(req.user, function(err) {
                if (err) return res.serverError(err);
                sails.log.info(req.user.firstName + ' ' + req.user.lastName + ' logged in.');
                res.cookie('access_token', req.user.facebookToken);
                res.cookie('facebook_id', req.user.facebookId);
                return res.redirect('/dashboard');
            });
        });
    },

};
