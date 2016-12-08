/**
* PlayerController
*
* @description :: PlayerController.js is used to serve json API responses
*/

module.exports = {
	// FOR JSON API RESPONSE ROUTE HANDLING ONLY

	findOne: function(req, res) {

		

	},

	createPlayer: 'Players must be created through auth routes',

	find: function(req, res) {
		Player.find().exec(function(err, players) {
			if (err) return res.serverError(err);
			return res.json({
				success: true,
				size: players.length,
				players: players
			});
		});
	},






};
