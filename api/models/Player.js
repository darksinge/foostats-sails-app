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
            required: true,
            unique: true
        },
        name: 'string',
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
            enum: ['admin', 'basic'],
            defaultsTo: function() {
                return 'basic';
            }
        },
        facebookId: {
            type: 'string',
            unique: true
        }

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
                Player.findOne({email: facebookUser.email}).exec(function(err, player) {
                    if (err) return done(err);
                    if (!player) return done(new Error('player not found.'));
                    return done(null, player);
                });
            });
        }
    },

    beforeCreate: function(values, cb) {
        values.role = 'basic';

        if (values.email == 'cr.blackburn89@gmail.com') values.role = 'admin';

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
    },

};
