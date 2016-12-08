/**
* sessionAuth
*
* @module      :: Policy
* @description :: Simple policy to allow any authenticated user
*                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
* @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
*
*/

var passport = require('passport');

module.exports = function(req, res, next) {
	if (req.user) {
		Player.findOne({uuid: req.user.uuid}).exec(function(err, player) {
			if (player) {
				res.locals = req.options.locals || {};
				res.locals.user = player.toJSON();
			}
			return next();
		});
	} else {
		JWTService.authenticate(req, res, function(err, user) {
			if (err) {
				return res.status(500).json({
					error: err,
					info: info,
					success: false
				});
			}

			if (user) {
				res.locals = req.options.locals || {};
				res.locals.user = user.toJSON();
			}

			return next();
		});
	}
};
