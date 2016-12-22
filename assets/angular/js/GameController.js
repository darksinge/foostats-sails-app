(function() {
   'use strict';

   angular.module('gameApp')
   .controller('GameController', GameController);

   GameController.$inject = ['$scope', '$http', '$window', '$location', '$mdSidenav', '$mdDialog'];

   function GameController($scope, $http, $window, $location, $mdSidenav, $mdDialog) {
      var vm = this;

      vm.environment = 'development';

      vm.gameStartTime;
      vm.gameLength = 0;

      vm.players = [];
      vm.playerNames = [];
      vm.query = '';
      vm.isReady = false;
      vm.canAddPlayers = true;
      vm.buttonsDisabled = false;
      vm.gameDidStart = false;
      vm.previousPath = '';

      vm.selectedPlayers = [];

      vm.player1Score = 0;
      vm.player2Score = 0;
      vm.player3Score = 0;
      vm.player4Score = 0;

      vm.blueTeamScore = vm.player1Score + vm.player2Score;
      vm.redTeamScore = vm.player3Score + vm.player4Score;

      $scope.openLeftMenu = function() {
         $mdSidenav('left').toggle();
      };

      $scope.$on("$locationChangeStart", function(event) {
         if (vm.previousPath == '/play/game') {
            if (!confirm('You have unsaved changes that will be lost, go back?')) {
               event.preventDefault();
            }
         }
         console.log('previous path: ' + vm.previousPath);
         vm.previousPath = $location.path();
      });

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
            vm.buttonsDisabled = true;
            if (vm.blueTeamScore >= 10) {
               vm.winningTeam = 'Blue Team';
            } else {
               vm.winningTeam = 'Red Team';
            }
            vm.saveGame(function(err) {
               vm.displayGameOverDialog();
            });
         }
      }

      vm.displayGameOverDialog = function() {
         var displayText = 'Game Stats' + '\n' + 'Game Length: ' + vm.gameLength;
         var alert = $mdDialog.alert()
         .parent(angular.element(document.querySelector('#gameOverviewContainer')))
         .clickOutsideToClose(false)
         .title(vm.winningTeam + ' won!')
         .textContent('Game Stats.')
         .ariaLabel('Game Overview')
         .ok('Okay')

         $mdDialog.show(alert)
         .then(function() {
            $window.location.href = '/play';
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

      vm.findMe = function() {
         $http.get('https://baconipsum.com/api/?type=meat-and-filler')
         .then(function(data) {
            console.log('', data.data);
         });
      }

      vm.go = function(path) {
         $window.location.href = path;
      }

      function changeView(view) {
         $location.path(view);
      }

      vm.newGame = function() {
         changeView('/play/game/setup');
      }

      vm.startGame = function() {
         vm.gameDidStart = true;
         vm.gameStartTime = new Date();
         changeView('/play/game');
         vm.player1 = vm.getBlueTeam()[0];
         vm.player2 = vm.getBlueTeam()[1];
         vm.player3 = vm.getRedTeam()[0];
         vm.player4 = vm.getRedTeam()[1];
      }

      vm.saveGame = function(done) {
         vm.gameLength = (vm.gameStartTime - new Date()) / 1000;
         return done();
      }

      vm.addPlayer = function(player) {
         if (vm.selectedPlayers.length < 4) {
            vm.selectedPlayers.push(player);
         }
         if (vm.selectedPlayers.length == 4) {
            vm.canAddPlayers = false;
            vm.isReady = true;
         } else if (vm.selectedPlayers.length < 4) {
            vm.canAddPlayers = true;
         }
         var index = vm.players.indexOf(player);
         vm.players.splice(index, 1);
      }

      vm.removePlayer = function(player) {
         var players = [];
         var index = vm.selectedPlayers.indexOf(player);
         vm.selectedPlayers.splice(index, 1);
         vm.canAddPlayers = true;
         vm.isReady = false;
      }

      vm.search = function() {
         $http.get('/play/players/search?keywords=' + vm.query)
         .then(function(data) {
            var players = data.data.players;
            vm.players = players;
            console.log('found ' + (players.length + 1) + ' players.');
         })
         .catch(function(err) {
            console.error('', err);
         });
      }
   }



})();
