/**
* PlayerController
*
* @description :: PlayerController.js is used to serve json API responses
*/

module.exports = {
	// FOR JSON API RESPONSE ROUTE HANDLING ONLY

	createPlayer: 'Players must be created through auth routes',

	create: function(req, res) {
		return res.json({
			success: false,
			info: 'New players must be created via a new Facebook login.'
		});
	},

	find: function(req, res) {
		Player.find().populate('teams').populate('achievements').exec(function(err, players) {
			if (err) return res.serverError(err);
			return res.json({
				success: true,
				size: players.length,
				players: players
			});
		});
	},

	

};
