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
			via: 'players'
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
			delete obj.facebookId;
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

	/**
	*
	* @param values - object that contains a player uuid or an access_token.
	* @param cb - takes two arguments. The first argument is an error, and the second is a player object.
	*/
	fetchPlayerObject: function(values, cb) {
		if (values.uuid) {
			Player.findOne({uuid: values.uuid}).exec(function(err, player){
				if (err) return cb(err);
				if (_.isObject(player)) {
					return cb(null, player)
				}
				return cb(new Error('player not found.'));
			});
		} else {
			FacebookService.fetchFacebookUser(values.access_token, function(err, facebookUser) {
				Player.findOne({facebookId: facebookUser.facebookId}).exec(function(err, player) {
					if (err) return done(err);
					if (!player) return done(new Error('player not found.'));
					return done(null, player);
				});
			});
		}
	},

	beforeCreate: function(values, cb) {
		if (values.email == 'cr.blackburn89@gmail.com') values.role = 'admin';
		if (!values.role) values.role = 'basic';
		if (!values.username) values.username = values.firstName + ' ' + values.lastName

		return (function loop() {
			Player.findOne({uuid: values.uuid}).exec(function (err, player) {
				if (err) return cb(err);

				if (player) {
					values.uuid = uuid.v4();
					return loop();
				}

				return cb();
			});
		}());
	}

};
