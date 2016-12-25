/**
* Team.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
*/

var uuid = require('node-uuid');
var _ = require('lodash');

module.exports = {

   attributes: {
      uuid: {
         type: 'string',
         uuid: true,
         primaryKey: true,
         required: true,
         unique: true,
         defaultsTo: function(){
            return uuid.v4();
         }
      },
      name: {
         type: 'string',
         unique: true,
         required: true
      },
      games: {
         collection: 'game',
         via: 'game',
         through: 'teamgame'
      },
      player1: {
         model: 'player'
      },
      player2: {
         model: 'player'
      },
      leagues: {
         collection: 'league',
         via: 'teams'
      },
      toJSON: function() {
         var obj = this.toObject();
         obj.players = [obj.player1, obj.player2];
         return obj;
      }
   },

   beforeCreate: function(values, done) {
      return done();
   },

   afterCreate: function(values, done) {
      Teamplayer.create({
         player: values.player1, team: values.uuid
      }).exec(function(err, teamplayer) {
         if (err) return done(err);
         Teamplayer.create({
            player: values.player2,
            team: values.uuid
         }).exec(function(err, teamplayer) {
            if (err) return done(err);
            return done();
         });
      });
   },

   afterUpdate: function(values, done) {
      Teamplayer.create({
         player: values.player1.uuid, team: values.uuid
      }).exec(function(err, teamplayer) {
         if (err) return done(err);
         Teamplayer.create({
            player: values.player2.uuid,
            team: values.uuid
         }).exec(function(err, teamplayer) {
            if (err) return done(err);
            return done();
         });
      });
   },

   beforeUpdate: function(values, done) {
      Team.findOne({uuid: values.uuid}).populate('players').exec(function(err, team) {
         if (err) return done(err);
         if (!team) return done(new Error('Update failed, team not found.'));
         return done(null, team);
      });
   },

   // removes teams that have no players
   prune: function() {
      Team.find().populate('players').exec(function(err, teams) {
         if (err) return sails.log.error(err);
         _.forEach(teams, function(team) {
            if (team.players.length === 0) {
               Team.destroy({uuid: team.uuid}).exec(function(err) {
                  if (err) return sails.log.error(err);
                  else return sails.log.info('Team deleted.');
               });
            }
         });
      });
   },

};
