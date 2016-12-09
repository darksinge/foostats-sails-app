

var passport = require('passport');

module.exports = {
	authenticate: function(req, res, done) {
		passport.authenticate('jwt', function(err, user, info) {
			return done(err, user, info);
		})(req, res);
	},
}
