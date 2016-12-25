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

	saveGame: function(req, res) {
		// var gameId = req.param('game');
		var blueTeamId = req.param('blue');
		var redTeamId = req.param('red');
		var player1Score = req.param('p1s');
		var player2Score = req.param('p2s');
		var player3Score = req.param('p3s');
		var player4Score = req.param('p4s');
		var gameLengthInSeconds = req.param('length');

		Game.create({
			blueTeam: blueTeamId,
			redTeam: redTeamId,
			player1Score: player1Score,
			player2Score: player2Score,
			player3Score: player3Score,
			player4Score: player4Score,
			gameLengthInSeconds: gameLengthInSeconds
		}).exec(function(err, game) {
			if (err) {
				return res.json({
					success: false,
					error: err
				});
			}

			if (!game) {
				return res.json({
					success: false,
					error: 'Unknown error, game could not be created'
				});
			}
			return res.json({
				success: true,
				 game: game
			 });
		});

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
	},

	findOrCreateTeam: function(req, res) {
		var player1 = req.param('player1');
		var player2 = req.param('player2');
		Team.findOne({
			player1: player1,
			player2: player2
		})
		.populate('player1')
		.populate('player2')
		.exec(function(err, team) {
			if (err) return res.status(500).json({error: err});
			if (!team) {
				Player.find({
					uuid: [player1, player2]
				}).exec(function(err, players) {
					if (err) return res.status(500).json({error: err});
					var player1 = players[0];
					var player2 = players[1];
					if (!player1 || !player2) { return res.json({success: false, error: 'One or both player id\'s are invalid.'}); }

					Team.create({
						name: 'Team ' + player1.firstName + '-' + player2.firstName + ':' + player1.uuid.slice(0, 3) + player2.uuid.slice(0, 3),
						player1: player1,
						player2: player2
					})
					.populate('player1')
					.populate('player2')
					.exec(function(err, team) {
						if (err) return res.status(500).json({error: err});
						return res.json({
							success: true,
							team: team
						});
					});
				});
			}

			if (team) {
				return res.json({
					success: true,
					team: team
				});
			}
		});
	},
};
