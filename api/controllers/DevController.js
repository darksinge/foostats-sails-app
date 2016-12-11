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
				console.log(team.players.length);
			});

			return res.json({
				teams: teams
			});

		});
	},
};
