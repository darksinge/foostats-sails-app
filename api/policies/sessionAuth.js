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

		if (!user) {
			return res.json({
				success: false,
				info: info,
				error: err
			});
		}

		req.user = user;
		res.locals = req.options.locals || {};
		res.locals.user = user;
		return next();
	});
};
