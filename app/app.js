'use strict';

// Declare app level module which depends on views, and components
angular.module('pel', [
  'ngRoute',
  'pel.view1',
  'pel.view2',
  'pel.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
