(function() {
   'use strict';

   angular.module('gameApp', ['ngMaterial', 'ngRoute'])
   .config(function($routeProvider, $httpProvider) {
      
      $routeProvider
      .when('/play', {
         templateUrl: '/angular/templates/menu.html'
      })
      .when('/play/game', {
         templateUrl: '/angular/templates/game.html'
      })
      .when('/play/game/setup', {
         templateUrl: '/angular/templates/game_setup.html'
      })
      .otherwise({
         redirectTo: '/play'
      });
   });

})();
