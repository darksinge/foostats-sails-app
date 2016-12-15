/**
* Player.js
*
* @description :: Player Model
* @param {string} uuid - Primary key.
* @param {string} email - Player's email address.
* @param {string} name - Player's display name.
* @param {collection} teams - The teams the player is associated with.
* @param {collection} singlePlayerAchievments - Achievements earned by player in 2 player games.
* @param {collection} teamAchievements - Achievements earned by player in 4 player games.
* @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
*/

var uuid = require('node-uuid');

module.exports = {

	attributes: {
		uuid: {
			type: 'string',
			primaryKey: true,
			uuid: true,
			required: true,
			unique: true,
			defaultsTo: function() {
				return uuid.v4();
			}
		},
		email: {
			type: 'string',
			email: true,
			unique: true
		},
		firstName: 'string',
		lastName: 'string',
		teams: {
			collection: 'team',
			via: 'players',
			dominant: true
		},
		achievements: {
			collection: 'achievement',
			via: 'achievements',
			through: 'playerachievement'
		},
		role: {
			type: 'string',
			enum: ['admin', 'player'],
			defaultsTo: function() {
				return 'player';
			}
		},
		facebookId: {
			type: 'string',
			unique: true
		},
		facebookToken: 'string',
		username: 'string',
		connections: {
			collection: 'player',
			via: 'connections'
		},

		toJSON: function() {
			var obj = this.toObject();
			delete obj.facebookToken;
			if (!obj.username) obj.username = obj.firstName + ' ' + obj.lastName;
			obj.name = obj.firstName + ' ' + obj.lastName;
			return obj;
		}

	},

	createDummyPlayers: function(done) {
		var player1 = {};
		var player2 = {};
		var player3 = {};
		var player4 = {};

		player1.firstName = 'Tom';
		player1.lastName = 'Davis';
		player1.email = 'tom.davis@usu.edu';

		player2.firstName = 'Case';
		player2.lastName = 'Haws';
		player2.email = 'case.haws@usu.edu';

		player3.firstName = 'Dustin';
		player3.lastName = 'Homan';
		player3.email = 'dustin.e.homan@usu.edu';

		player4.firstName = 'Megan';
		player4.lastName = 'Maples';
		player4.email = 'megan.maples@usu.edu';

		var players = [player1, player2, player3, player4];
		var count = 0;
		var created = [];
		(function createOne(player) {
			if (player) {
				Player.create(player).exec(function(err, player) {
					if (err) return done(err, false);
					sails.log.info('Created new player: ', player);
					created.push(player);
					return createOne(players[count++]);
				});
			} else {
				return done(null, player);
			}

		})(players[count++]);



	},

	beforeCreate: function(values, next) {
		if (values.email == 'cr.blackburn89@gmail.com') values.role = 'admin';
		if (!values.role) values.role = 'basic';
		if (!values.username && values.firstName && values.lastName) values.username = values.firstName + ' ' + values.lastName;

		(function checkForUuidCollisions(_values) {
			Player.findOne({uuid: _values.uuid}).exec(function(err, player) {
				if (err) return next(err);
				if (player) {
					_values.uuid = uuid.v4();
					return checkForUuidCollisions(_values);
				} else {
					return next();
				}
			});
		})(values);
	}

};
