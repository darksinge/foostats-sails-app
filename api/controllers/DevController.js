/**
* DevController
*
* @description :: Server-side logic for managing devs
* @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
*/

'use strict';

var _ = require('lodash');

module.exports = {
	test: function(req, res) {
		Team.find().populate('players').exec(function(err, teams) {
			if (err) return res.json({
				error: err
			});

			_.forEach(teams, function(team) {
				_.forEach(team.players, function(t_player) {
					Player.findOne({uuid: t_player.uuid}).exec(function(err, player) {
						if (err) {
							return sails.log.error('Error looking up player: ERROR:  ', err);
						} else if (!player) {
							return sails.log.error('Player update failed, could not find player.');
						} else {
							sails.log.info('Adding team to player: ' + player.firstName + ', ' + team.name);
							player.teams.add(team.name);
							player.save(function(err) {
								if (err) {
									// sails.log.error('Error saving team to player: ERROR:  ', err);
									console.log(JSON.stringify(err, null, 2));
								}
								else sails.log.info('Player team saved.');
							});
						}
					});
				});
			});

			return res.json({
				teams: teams
			});

			// _.forEach(teams, function(team) {
			// 	var players = team['players'];
			// 	sails.log.info(JSON.stringify(teams, null, 2));
			// });

		});
	},
};
