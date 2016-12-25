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
      gameLengthInSeconds: {
         type: 'integer'
      },
      matchToken: {
         type: 'string',
         uuid: true,
         required: true,
         defaultsTo: function() {
            return uuid.v4();
         }
      },
      matchOrder: {
         type: 'integer',
         defaultsTo: 1
      },
      blueTeam: {
         model: 'team'
      },
      redTeam: {
         model: 'team'
      },
      player1Score: {
         type: 'integer',
         defaultsTo: 0
      },
      player2Score: {
         type: 'integer',
         defaultsTo: 0
      },
      player3Score: {
         type: 'integer',
         defaultsTo: 0
      },
      player4Score: {
         type: 'integer',
         defaultsTo: 0
      },
      toJSON: function() {
         var obj = this.toObject();
         obj.teams = [obj.blueTeam, obj.redTeam];
         return obj;
      }
   },

};
