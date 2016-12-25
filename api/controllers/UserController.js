/**

@description :: UserController.js

*/

var _ = require('lodash');
var request = require('request');

function undoTeamCreate(team) {
   Team.destroy({uuid: team.uuid}).exec(function(err) {
      if (err) sails.log.error(err);
      else sails.log.info('encountered an error, team deleted.');
   });
}

module.exports = {

   dashboard: function(req, res) {
      var fooError;
      var fooMessage;
      if (req.cookies.fooError) fooError = req.cookies.fooError;
      if (req.cookies.fooMessage) fooMessage = req.cookies.fooMessage;

      res.clearCookie('fooError');
      res.clearCookie('fooMessage');

      var user;

      Player.find().populate('teams').exec(function(err, players) {
         if (err) {
            res.cookie('fooError', JSON.stringify(err, null, 2));
            return res.redirect('/dashboard');
         }

         if (!players) {
            res.cookie('fooError', 'There was an error, please contact a system administrator.');
            return res.redirect('/login');
         }

         _.forEach(players, function(value) {
            if (value.uuid == req.user.uuid) {
               user = value;
            }
         });

         if (!user) {
            res.cookie('fooError', 'There was an error, please contact a system administrator.');
            return res.redirect('/login');
         }

         Team.find({or: [
               {player1: user.uuid},
               {player2: user.uuid}
            ]})
         .populate('player1')
         .populate('player2')
         .exec(function(err, teams) {
            if (err) res.serverError(err);
            if (!teams) teams = [];

            user = user.toJSON();

            for (var i = 0; i < teams.length; i++) {
               teams[i] = teams[i].toJSON();
            }

            user.teams = teams;
            res.locals.user = user;

            Player.find().exec(function(err, users) {
               if (err) return res.serverError(err);
               if (!users) {
                  return res.serverError('Oops! Something went wrong.');
               }

               for (var i = 0; i < users.length; i++) {
                  if (users[i].uuid === user.uuid) {
                     users[i] = 'delete';
                     break;
                  }
               }

               while (users.indexOf('delete') !== -1) {
                  users.splice(users.indexOf('delete'), 1);
               }

               return res.view('user/dashboard', {
                  players: users,
                  error: fooError,
                  message: fooMessage
               });
            });
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

   addTeam: function(req, res) {
      var connectionId = req.param('connectionId');
      var requesterId = req.user.uuid;
      var teamName = req.param('teamName');

      Team.prune();

      if (!teamName) {
         res.cookie('fooError', 'You must provide a team name!');
         return res.redirect('/dashboard');
      }

      var connectionId = '20cf4a42-5957-4eb5-a0cb-7fd436ac3ae2';
		var requesterId = 'bbe04cec-6214-4c3c-b6d0-0c53f34a50a2';
		Player.find({or: [
			{uuid: connectionId},
			{uuid: requesterId}
		]})
		.populate('teams')
		.exec(function(err, players) {
			if (err) { return sails.log.error(err); }
			if (!players) { return sails.log.error(new Error('Players not found!')); }
			var player1 = players[0];
			var player2 = players[1];

         if (!player1 || !player2) {
            return sails.log.error(new Error('Found wrong number of players, expecting two!'));
         }

			var player1Teams = _.keyBy(player1.teams, 'uuid');
			var player2Teams = _.keyBy(player2.teams, 'uuid');

			var teamId = null;

			_.forEach(player1Teams, function(value, key) {
				if (player2Teams[key] && !teamId) {
					teamId = key;
				}
			});

         if (!teamId) {
            Team.create({
   				name: teamName,
   				player1: player1,
   				player2: player2
   			})
   			.populate('player1')
   			.populate('player2')
   			.exec(function(err, team) {
               if (err) {
                  var errObj = JSON.parse(JSON.stringify(err));
                  if (errObj.error == 'E_VALIDATION' && errObj.summary == '1 attribute is invalid') {
                     res.cookie('fooError', 'That team name has already been taken, please choose a different name.');
                  } else {
                     res.cookie('fooError', JSON.stringify(err, null, 2));
                  }
               }
   				return res.redirect('/dashboard');
   			});
         }

			if (teamId) {
				Team.findOne({uuid: teamId})
				.populate('player1')
				.populate('player2')
				.exec(function(err, team) {
					if (err) return res.json({error: err});
               res.cookie('fooError', 'You already belong to a team with that player.');
					return res.redirect('/dashboard');
				});
			}
		});
   },

   leaveTeam: function(req, res) {

      var userId = req.user.uuid;
      var teamId = req.param('teamId');

      if (!teamId) {
         res.cookie('fooError', 'Team ID was not provided');
         res.redirect('/dashboard');
      }

      var siteUrl = process.env.NODE_ENV === 'production' ? 'https://foostats.herokuapp.com' : 'http://localhost:1337';
      var url = siteUrl + '/team/' + teamId + '/players/' + userId;

      var options = {
         url: url,
         headers: {
            'Authorization': 'Bearer ' + req.cookies.jwtToken
         }
      }

      request.del(options, function(err, response, body){
         if (err) {
            sails.log.error(err);
            undoTeamCreate(team.uuid);
            res.cookie('fooError', JSON.stringify(err, null, 2));
            return res.redirect('/dashboard');
         }
         Team.prune();
         return res.redirect('/dashboard');
      });
   }

}
