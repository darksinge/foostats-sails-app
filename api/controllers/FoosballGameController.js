/**
 * FoosballGameController
 *
 * @description :: Server-side logic for managing Foosballgames
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function(req, res) {
		return res.view('user/game', {
			layout: 'gameLayout'
		})
	},

	search: function(req, res) {
		var searchTerms = req.param('keywords');

		Player.find({
			or: [
				{ lastName: {contains: searchTerms} },
				{ firstName: {contains: searchTerms} }
			]
		}).exec(function(err, players) {
			if (err) sails.log.error(err);

			if (!players) {
				return res.json({
					success: false,
					players: []
				});
			}

			return res.json({
				success: true,
				players: players
			});
		});
	}
};
