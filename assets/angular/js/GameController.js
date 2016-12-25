
const MAX_PLAYERS = 4;

var initial_button_height;
function fix_button_height_for_small_windows() {
	if ($('.score-button').length == 0) return false;
	var height = window.screen.availHeight || window.innerHeight || $(window).height();
	if (!initial_button_height) {
	 	initial_button_height = $('.score-button').height();
 	}
	if (height < 650) {
		var diff = 650 - height;
		var less = diff / 4;
		var new_button_height = Math.round((initial_button_height - less) * 0.9);
		$('.score-button').css('height', new_button_height + 'px');
	} else {
		$('.score-button').css('height', initial_button_height + 'px');
	}
	return true;
}
$(window).on('resize', fix_button_height_for_small_windows);

(function() {
	'use strict';

	angular.module('gameApp')
	.controller('GameController', GameController);

	GameController.$inject = ['$scope', '$http', '$window', '$location', '$mdSidenav', '$mdDialog', '$timeout', '$document', 'APIService'];

	function GameController($scope, $http, $window, $location, $mdSidenav, $mdDialog, $timeout, $document, APIService) {
		var vm = this;

		var interval = setInterval(function() {
			if (fix_button_height_for_small_windows()) {
				clearInterval(interval);
			}
		}, 50)

		vm.environment = 'development';

		vm.timerDisplayText = '0:00';
		vm.gameStartTime;
		vm.gameLengthInSeconds = -1;

		vm.players = [];
		vm.playerNames = [];
		vm.query = '';
		vm.gameCanStart = true;
		vm.canAddPlayers = true;
		vm.buttonsDisabled = false;
		vm.gameDidStart = false;

		vm.selectedPlayers = [];

		vm.player1Score = 0;
		vm.player2Score = 0;
		vm.player3Score = 0;
		vm.player4Score = 0;

		vm.blueTeamFromQuery;
		vm.redTeamFromQuery;

		vm.blueTeamScore = vm.player1Score + vm.player2Score;
		vm.redTeamScore = vm.player3Score + vm.player4Score;

		$scope.openLeftMenu = function() {
			$mdSidenav('left').toggle();
		};

		vm.addPoint = function(playerPosition) {
			switch (playerPosition) {
				case 1:
				vm.player1Score++;
				break;
				case 2:
				vm.player2Score++;
				break;
				case 3:
				vm.player3Score++;
				break;
				case 4:
				vm.player4Score++;
				break;
				default:
				console.error('Invalid player position detected!');
				return;
			}
			console.log(vm.getPlayer(playerPosition).name + ' scored a point');
			vm.execGameLoop();
		}

		vm.minusPoint = function(playerPosition) {
			switch (playerPosition) {
				case 1:
				vm.player1Score--;
				if (vm.player1Score < 0) vm.player1Score = 0;
				break;
				case 2:
				vm.player2Score--;
				if (vm.player2Score < 0) vm.player2Score = 0;
				break;
				case 3:
				vm.player3Score--;
				if (vm.player3Score < 0) vm.player3Score = 0;
				break;
				case 4:
				vm.player4Score--;
				if (vm.player4Score < 0) vm.player4Score = 0;
				break;
				default:
				console.error('Invalid player position detected!');
				return;
			}
			console.log(vm.getPlayer(playerPosition).name + ' lost a point');
			vm.execGameLoop();
		}

		vm.execGameLoop = function() {

			vm.blueTeamScore = vm.player1Score + vm.player2Score;
			vm.redTeamScore = vm.player3Score + vm.player4Score;

			if (vm.blueTeamScore < 0) vm.blueTeamScore = 0;
			if (vm.redTeamScore < 0) vm.redTeamScore = 0;

			if (vm.blueTeamScore >= 10 || vm.redTeamScore >= 10) {
				vm.endGame();
			}
		}

		vm.endGame = function() {
			var winningTeam;
			if (vm.blueTeamScore >= 10) {
				winningTeam = 'Blue Team';
			} else {
				winningTeam = 'Red Team';
			}
			vm.saveGame(function(err, game) {
				vm.timerDisplayText = '0:00';
				vm.gameStartTime = null;
				vm.gameLengthInSeconds = -1;
				vm.players = [];
				vm.playerNames = [];
				vm.query = '';
				vm.gameCanStart = true;
				vm.canAddPlayers = true;
				vm.buttonsDisabled = false;
				vm.gameDidStart = false;
				vm.buttonsDisabled = true;

				if (err) console.error('Error: ', err);
				vm.displayGameOverDialog(winningTeam);
			});

		}

		vm.displayGameOverDialog = function(winningTeam) {
			var displayText = 'Game Stats' + '\n' + 'Game Length: ' + vm.gameLengthInSeconds;
			var alert = $mdDialog.alert()
			.parent(angular.element(document.querySelector('#gameOverviewContainer')))
			.clickOutsideToClose(false)
			.title(winningTeam + ' won!')
			.textContent('Game Stats.')
			.ariaLabel('Game Overview')
			.ok('Okay')

			$mdDialog.show(alert)
			.then(function() {
				$location.path('/play');
				vm.buttonsDisabled = false;
				// $window.location.href = '/play';
			});

		};

		vm.getPlayer = function(playerPosition) {
			var player;
			switch (playerPosition) {
				case 1:
				player = vm.getBlueTeam()[0];
				break;
				case 2:
				player = vm.getBlueTeam()[1];
				break;
				case 3:
				player = vm.getRedTeam()[0];
				break;
				case 4:
				player = vm.getRedTeam()[1];
				break;
				default:
				console.error('Invalid player position, (options are 1-4)');
			}
			if (vm.environment == 'development' && typeof player == 'undefined') {
				var players = [{name: 'Player 1'}, {name: 'Player 2'}, {name: 'Player 3'}, {name: 'Player 4'}];
				return players[playerPosition - 1]
			}
			return player;
		}

		vm.getBlueTeam = function() {
			var players = [];
			if (vm.selectedPlayers[0]) {
				players[0] = vm.selectedPlayers[0];
			}
			if (vm.selectedPlayers[1]) {
				players[1] = vm.selectedPlayers[1];
			}

			return players;
		}

		vm.getRedTeam = function() {
			var players = [];
			if (vm.selectedPlayers[2]) {
				players[0] = vm.selectedPlayers[2];
			}
			if (vm.selectedPlayers[3]) {
				players[1] = vm.selectedPlayers[3];
			}
			return players;
		}

		vm.go = function(path) {
			$window.location.href = path;
		}

		vm.changeView = function(view) {
			$location.path(view);
		}

		vm.newGame = function() {
			vm.changeView('/play/game/setup');
		}

		vm.startGame = function() {
			vm.gameDidStart = true;
			vm.gameStartTime = new Date();
			vm.startClock();
			vm.changeView('/play/game');
			vm.player1 = vm.getBlueTeam()[0];
			vm.player2 = vm.getBlueTeam()[1];
			vm.player3 = vm.getRedTeam()[0];
			vm.player4 = vm.getRedTeam()[1];

			// Use vm.player# for game logic, then find or create actual teams in/from database... just because thats how I said it's gonna be.
			APIService.findOrCreateTeam(vm.player1, vm.player2, function(err, team) {
				if (err) console.error(err);
				if (team) {
					vm.blueTeamFromQuery = team;
					console.log('Found/Created Team: ', vm.blueTeamFromQuery.name);
				}
			});
			APIService.findOrCreateTeam(vm.player3, vm.player4, function(err, team) {
				if (err) console.error(err);
				if (team) {
					vm.redTeamFromQuery = team;
					console.log('Found/Created Team: ', vm.redTeamFromQuery.name);
				}
			});
		}

		vm.saveGame = function(next) {
			console.log('GameLengthWhenSaved: ' + vm.gameLengthInSeconds);
			var data = {};
			data.blueTeamId = vm.blueTeamFromQuery.uuid;
			data.redTeamId = vm.redTeamFromQuery.uuid;
			data.player1Score = vm.player1Score;
			data.player2Score = vm.player2Score;
			data.player3Score = vm.player3Score;
			data.player4Score = vm.player4Score;
			data.gameLengthInSeconds = vm.gameLengthInSeconds;
			APIService.saveGame(data, function(err, game){
				if (err) console.error('Error: ', err);
				if (game) console.log('Game Saved!');
				return next(err);
			});
		}

		vm.addPlayer = function(player) {
			var actualPlayerCount = 0;
			for (var i = 0; i < MAX_PLAYERS; i++) {
				if (typeof vm.selectedPlayers[i] == 'undefined') {
					vm.selectedPlayers[i] = player;
					break;
				} else if (vm.selectedPlayers[i] && typeof vm.selectedPlayers[i].uuid == 'undefined') {
					vm.selectedPlayers[i] = player;
					break;
				} else {
					actualPlayerCount++;
				}
			}

			if (actualPlayerCount < 4) {
				var index = vm.players.indexOf(player);
				vm.players.splice(index, 1);
			}

			if (vm.selectedPlayers.length < 4) {
				vm.canAddPlayers = true;
				vm.gameCanStart = true;
			} else if (vm.selectedPlayers.length == 4) {
				vm.canAddPlayers = false;
				vm.gameCanStart = true;
			}

			vm.canAddPlayers = vm.selectedPlayers.length < 4;
			vm.gameCanStart = vm.selectedPlayers.length == 4;

		}

		vm.removePlayerByIndex = function(index) {
			var player = vm.selectedPlayers[index];
			if (player) {
				vm.selectedPlayers[index] = {name: 'Player ' + (index + 1)};
				vm.players.push(player);
			}

			vm.canAddPlayers = true;
			vm.gameCanStart = true;
		}

		vm.startClock = function() {
			vm.gameLengthInSeconds++;
			var minutes = Math.floor(vm.gameLengthInSeconds / 60);
			var seconds = vm.gameLengthInSeconds - (minutes * 60);
			var minuteText = '' + minutes;
			var secondsText = seconds > 9 ? '' + seconds : '0' + seconds;
			vm.timerDisplayText = minuteText + ':' + secondsText;
			if (vm.gameDidStart) { $timeout(vm.startClock, 1000); }
		}

		vm.search = function() {
			APIService.searchPlayers(vm.query, function(err, players) {
				if (players) {
					for (var i = 0; i < vm.selectedPlayers.length; i++) {
						for (var n = 0; n < players.length; n++) {
							if (vm.selectedPlayers[i].uuid == players[n].uuid) {
								players.splice(n, 1);
							}
						}
					}
					vm.players = players;
					// console.log('selected players total: ' + vm.selectedPlayers.length + '.');
					// console.log('found ' + (players.length + 1) + ' players.');
					// console.log('displaying ' + vm.players.length + ' players.');
				}
			});
		}
	}



})();
