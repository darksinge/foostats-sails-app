/**

@description :: UserController.js

*/

var _ = require('lodash');

module.exports = {

	dashboard: function(req, res) {
		Player.find().exec(function(err, users) {
			if (err) return res.serverError(err);
			if (!users) {
				return res.serverError('Oops! Something went wrong.');
			}

			for (var i = 0; i < users.length; i++) {
				if (users[i].uuid === req.user.uuid) {
					res.locals.user = users[i].toJSON();
					users[i] = 'delete';
				}
			}

			while (users.indexOf('delete') !== -1) {
				users.splice(users.indexOf('delete'), 1);
			}

			return res.view('user/dashboard', {
				players: users
			});
		});
	},

	addConnection: function(res, res) {
		var connection = req.param('connection');
		if (!connection) {
			res.cookie('fooError', 'missing parameter \'connection\', which is the uuid of the player you are trying to add as a connection');
			return res.redirect('/dashboard');
		}

		if (!req.user) {
			res.cookie('fooMessage', 'You are not logged in, please log in again.');
			return res.redirect('/login');
		}

		Player.findOne({uuid: req.user.uuid}).exec(function(err, player) {
			if (err) {
				res.cookie('fooError', err.message);
				return res.redirect('/dashboard');
			}

			if (!player) {
				res.cookie('fooError', 'Something went terribly wrong, please try logging out and logging back in again.');
				return res.redirect('/dashboard');
			}

			player.connections.add(connection);
			player.save(function(err) {
				if (err) {
					res.cookie('fooError', err.message);
				}
				return res.redirect('/dashboard');
			});
		});

	},

}
