/**
 * Team.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
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
    name: {
      type: 'string',
      unique: true
    },
    games: {
      collection: 'game',
      via: 'game',
      through: 'statistics'
    },
    players: {
      collection: 'player',
      via: 'teams',
      dominant: true
    },
    leagues: {
      collection: 'league',
      via: 'teams'
    }
  },

  beforeCreate: function(values, cb) {
    return (function loop() {
      Player.findOne({uuid: values.uuid}).exec(function (err, team) {
        if (err) return cb(err);
        if (team) {
          values.uuid = uuid.v4();
          loop();
        } else {
          return cb();
        }
      })
    }());
  },

};
