/**
* PlayerController
*
* @description :: PlayerController.js is used to serve json API responses
*/

module.exports = {
	// FOR JSON API RESPONSE ROUTE HANDLING ONLY

	findOne: function(req, res) {

		var id = req.params.id;
		sails.log.info("ID: " + id);
		if (id) {
			return res.json({
				success: true,
				id: id
			});
		}

		return res.json({
			success: false,
			id: null
		});


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
