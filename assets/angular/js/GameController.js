(function() {
   'use strict';

   angular.module('gameApp')
   .controller('GameController', GameController);

   GameController.$inject = ['$http', '$window', '$location'];

   function GameController($http, $window, $location) {
      var vm = this;

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
      }

   }

})();
