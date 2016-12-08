

var passport = require('passport');

module.exports = {
	authenticate: function(req, res, done) {
		if (!req.cookies.jwtToken) return done();
		req.headers.authorization = 'JWT ' + req.cookies.jwtToken;
		passport.authenticate('jwt', function(err, user, info) {
			return done(err, user, info);
		})(req, res);
	},
}
