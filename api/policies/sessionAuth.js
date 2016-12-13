/**
* sessionAuth
*
* @module      :: Policy
* @description :: Simple policy to allow any authenticated user
*                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
* @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
*
*/

module.exports = function(req, res, next) {
	if (req.headers.access_token) {
		FacebookService.verifyAccessToken(req.headers.access_token)
		.then(function(user) {
			req.user = user.toJSON();
			res.locals = req.options.locals || {};
			res.locals.user = user;
			return next();
		})
		.catch(function(err) {
			sails.log.error(err);
			return res.json({error: JSON.stringify(err, null, 2)});
		});
	} else {
		JWTService.authenticate(req, res, function(err, user, info) {
			if (err) {
				return res.status(500).json({
					error: err,
					info: info,
					success: false
				});
			}

			if (info && info.name == 'TokenExpiredError') {
				res.cookie('fooError', 'Your session has expired, please log back in.');
				return res.redirect('/login');
			}

			if (!user) {
				res.cookie('fooError', 'You are not logged in.');
				return res.redirect('/login');
			}

			req.user = user;
			res.locals = req.options.locals || {};
			res.locals.user = user;
			return next();
		});
	}

};
