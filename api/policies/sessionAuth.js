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
};
