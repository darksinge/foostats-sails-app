(function() {
	'use strict';

	const GAME_ROUTE = '/api/game';
	const TEAM_ROUTE = '/api/team';
	const PLAYER_ROUTE = '/api/player';

	angular.module('gameApp')
	.factory('APIService', APIService);

	APIService.$inject = ['$http'];

	function APIService($http) {
		var service = {};

		service.searchPlayers = function(query, next) {
			$http.get('/play/players/search?keywords=' + query)
			.then(function(data) {
				var players = data.data.players;
				return next(null, players)
			})
			.catch(function(err) {
				console.error('', err);
				return next(err);
			});
		}

		service.findOrCreateTeam = function(player1, player2, next) {
			var p1Id = player1.uuid ? player1.uuid : player1;
			var p2Id = player2.uuid ? player2.uuid : player2;
			var params = '?player1=' + p1Id + '&player2=' + p2Id;
			$http.post(TEAM_ROUTE + '/findorcreate' + params)
			.then(function(data) {
				var team = data.data.team;
				return next(null, team);
			})
			.catch(function(err) {
				return next(err);
			});
		}

		service.saveGame = function(data, next) {
			var params = '?blue=' + data.blueTeamId
			+ '&red=' + data.redTeamId
			+ '&p1s=' + data.player1Score
			+ '&p2s=' + data.player2Score
			+ '&p3s=' + data.player3Score
			+ '&p4s=' + data.player4Score
			+ '&length=' + data.gameLengthInSeconds;

			$http.post(GAME_ROUTE + '/save' + params)
			.then(function(data) {
				return next(null, data.data.game);
			})
			.catch(function(err) {
				return next(err);
			});
		}

		return service;
	}

})();
