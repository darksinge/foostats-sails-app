(function() {
	'use strict';

	const GAME_ROUTE = "/game";

	angular.module('gameApp')
	.factory('APIService', APIService);

	APIService.$inject = ['$http'];

	function APIService($http) {
		var service = {};

		service.createGame = function(next) {
			$http.post(GAME_ROUTE)
			.then(function(data) {
				return next(null, data.data)
			})
			.catch(function(err) {
				return console.error('Error: ', err);
				return next(err, false);
			});
		}

		service.saveGame = function(game, next) {
			$http.put(GAME_ROUTE + '/' + game.uuid)
		}

		return service;
	}

})();
