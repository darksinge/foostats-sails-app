/**

@description :: UserController.js

*/

module.exports = {

   dashboard: function(req, res) {
		Player.findOne({uuid: req.user.uuid}).exec(function(err, user) {
			if (err) return res.serverError(err);
			if (!user) {
				res.cookie('fooMessage', 'You are not logged in, please log in again.');
	         return res.redirect('/login');
			}

			res.locals.user = user.toJSON();

			return res.view('user/dashboard');


		});
   },

}
