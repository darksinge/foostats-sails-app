/**
 * Game.js
 *
 * @description :: Game Model
 * @param  {string} uuid - primary key of game.
 * @param {integer} length - the length of the game in seconds.
 * @param {string} matchToken - uuid token used to identify games of the same match (i.e. best 2 out of 3, 3 out of 5).
 * @param {integer} matchOrder - id used to identify the order of a game within a match (i.e. game 1 of 3,  game 2 of 5).
 * @param {collection} teams - the participating teams.
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
      defaultsTo: function(){
        return uuid.v4();
      }
    },
    length: {
      type: 'integer'
    },
    matchToken: {
      type: 'string',
      uuid: true,
      required: true
    },
    matchOrder: {
      type: 'integer',
      defaultsTo: 1
    },
    teams: {
      collection: 'team',
      via: 'team',
      through: 'teamgame'
    }
  },

  beforeCreate: function(values, cb) {
    return (function loop() {
      Player.findOne({uuid: values.uuid}).exec(function (err, game) {
        if (err) return cb(err);
        if (game) {
          values.uuid = uuid.v4();
          loop();
        } else {
          return cb();
        }
      })
    }());
  },

};
