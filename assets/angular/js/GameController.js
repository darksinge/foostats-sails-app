(function() {
   'use strict';

   angular.module('gameApp')
   .controller('GameController', GameController);

   GameController.$inject = ['$scope', '$http', '$window', '$location'];

   function GameController($scope, $http, $window, $location) {
      var vm = this;

      vm.players = [];
      vm.playerNames = [];
      vm.query = '';
      vm.isReady = false;
      vm.canAddPlayers = true;

      vm.selectedPlayers = [];

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
         changeView('/play/game');
         vm.player1 = vm.getBlueTeam()[0];
         vm.player2 = vm.getBlueTeam()[1];
         vm.player3 = vm.getRedTeam()[0];
         vm.player4 = vm.getRedTeam()[1];
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
