/**
 * League.js
 *
 * @description :: League Model - used to track stats of players within a group
 * @param {string} uuid - primary key.
 * @param {string} name - league name.
 * @param {collection} teams - the teams within the league.
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
    teams: {
      collection: 'team',
      via: 'leagues',
      dominant: true
    }
  },

  beforeCreate: function(values, cb) {
    return (function loop() {
      Player.findOne({uuid: values.uuid}).exec(function (err, league) {
        if (err) return cb(err);
        if (league) {
          values.uuid = uuid.v4();
          loop();
        } else {
          return cb();
        }
      })
    }());
  },

};
