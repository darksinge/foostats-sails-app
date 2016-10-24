/**
* PlayerController
*
* @description :: Server-side logic for managing players
* @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
*
* To override a RESTful blueprint route for a single controller, simply create
* an action in that controller with the appropriate name: find, findOne, create,
* update, destroy, populate, add or remove.
* See https://github.com/balderdashy/sails/tree/master/lib/hooks/blueprints/actions.
*
* To override the default action that all controllers use, create an
* api/blueprints folder and  add files to it with names matching the actions to
* override (e.g. find.js, findone.js, create.js, etc.). You can take a look at
* the code for the default actions in the Sails blueprints hook for a head
* start.
*/

var request = require('request'),
Promise = require('bluebird');
FacebookService = Promise.promisifyAll(FacebookService);

var passport = require('passport');

module.exports = {

	create: function(req, res) {
		var options = req.headers;

		FacebookService.fetchFacebookUser(options, function(err, facebookUser) {
			if (err) return res.serverError(err);

			// Check that a player with facebookUser.email does not already exist.
			Player.findOne({email: facebookUser.email}).exec(function(err, player) {
				if (err) return res.serverError(err);
				if (player) {
					return res.json({
						success: false,
						error: 'A player with that email address already exists.'
					})
				}

				Player.create({
					email: facebookUser.email,
					name: facebookUser.name,
				}).exec(function(err, player) {
					if (err) return res.serverError(err);
					return res.json({
						success: true,
						player: player,
					});
				});
			})
		});
	},

	update: function(req, res) {

		// access_token - the access token of the person performing the update.
		var access_token = req.headers.access_token

		// updatee - the user for whom updates are being requested for.
		var updateeId = req.param('uuid');

		if (!updateeId || !access_token) {
			return res.json({
				success: false,
				error: 'You must provide an access token and the uuid of the player you are updating.',
			});
		}

		FacebookService.resolveUserCRUDAuths({
			access_token: access_token,
			updateeId: updateeId
		}, function(err) {
			if (err) return res.serverError(err)

			var updates = {};
			if (req.param('email')) updates.email = req.param('email');
			if (req.param('name')) updates.name = req.param('name');

			Player.update({uuid: updateeId}, updates).exec(function afterwards(err, updates) {
				if (err) return res.serverError(err)

				// TODO :: implement team updates
				if (req.param('teams')) {
					updates.teams = req.param('team');
				}

				// TODO :: implement league updates
				if (req.param('leagues')) {
					updates.leagues = req.param('leagues');
				}

				return res.json({
					success: true,
					updates: updates,
				});
			});
		});
	},

	destroy: function(req, res) {
		// Fetch player object and check user role.
		var values = {};
		values.access_token = req.headers.access_token;

		// If 'err' is null, you can safely assume the player object was found.
		Player.fetchPlayerObject(values, function(err, player) {
			if (err) return res.serverError(err);

			if (player.role != 'admin') return res.forbidden('You are not permitted to perform this action.');

			Player.findOne({uuid: req.param('uuid')}).exec(function(err, player) {
				if (err) return res.serverError(err);

				if (!player) {
					return res.json({
						success: false,
						error: 'player not found with that uuid.'
					});
				}

				Player.destroy(player).exec(function(err) {
					if (err) return res.negotiate(err);
					sails.log(player.name + ' has been deleted.')
					return res.json({
						success: true,
						player: player
					});
				});
			});
		});
	},



};
