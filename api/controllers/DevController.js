/**
* DevController
*
* @description :: Server-side logic for managing devs
* @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
*/

var _ = require('lodash');

module.exports = {
	test: function(req, res) {
		Team.findOne({name: 'Team 1'}).exec(function(err, team) {
			if (err) return res.json({
				success: false,
				error: err
			});

			Player.find().exec(function(err, users) {

				_.forEach(users, function(user) {
					if (user.role == 'basic') {
						user.role = 'player';
						user.save(function(err) {
							if (err) sails.log.error(err);
							else sails.log.info('User updated role: ' + user.toJSON().name);
						});
					}
				});
				return res.json({
					success: true,
					users: users,
					team: team
				});
				// if (users[0]) team.players.add(users[0].uuid);
				// if (users[1]) team.players.add(users[1].uuid);
				// team.save(function(err) {
				// 	if (err) return res.json({error: err});
				// 	return res.json({
				// 		success: true,
				// 		team: team
				// 	});
				// });
			});
		});
	},
};
