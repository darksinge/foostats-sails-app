/**

@description :: UserController.js

*/

var _ = require('lodash');

module.exports = {

	dashboard: function(req, res) {
      var fooError;
      var fooMessage;
      if (req.cookies.fooError) fooError = req.cookies.fooError;
      if (req.cookies.fooMessage) fooMessage = req.cookies.fooMessage;

      res.clearCookie('fooError');
      res.clearCookie('fooMessage');

      Player.findOne({uuid: req.user.uuid}).populate('teams').exec(function(err, user) {
         if (err) {
            res.cookie('fooError', JSON.stringify(err, null, 2));
            return res.redirect('/dashboard');
         }

         if (!user) {
            res.cookie('fooError', 'There was an error, please contact a system administrator.');
            return res.redirect('/login');
         }

         var query = [];
         _.forEach(user.teams, function(team) {
            query.push(team.uuid);
         });
         Team.find(query).populate('players').exec(function(err, teams) {
            if (err) res.serverError(err);
            if (!teams) teams = [];

            user = user.toJSON();
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
      })
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
      var teamName = req.param('teamName');

      if (!connectionId || !teamName) {
         res.cookie('fooError', 'You must provide a team name to create a team');
         return res.redirect('/dashboard');
      }

      Player.findOne({uuid: req.user.uuid}).exec(function(err, player1) {
         if (err) {
            res.cookie('fooError', err.message);
            return res.redirect('/dashboard');
         }

         if (!player1) return res.serverError(new Error('Player not found!'));

         Player.findOne({uuid: connectionId}).exec(function(err, player2) {
            if (err) {
               res.cookie('fooError', err.message);
               return res.redirect('/dashboard');
            }

            if (!player2) return res.serverError(new Error('Player not found!'));

            Team.create({name: teamName}).exec(function(err, team) {
               if (err) {
                  res.cookie('fooError', err.message);
                  return res.redirect('/dashboard');
               }

               team.players.add(player1.uuid);
               team.players.add(player2.uuid);
               team.save(function(err) {
                  if (err) {
                     res.cookie('fooError', err.message);
                  }
                  return res.redirect('/dashboard');
               });
            });
         });
      });
   },

}
