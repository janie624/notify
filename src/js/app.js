angular.module('NotifyApp', [
  'ngRoute',
  'mobile-angular-ui',
  'NotifyApp.controllers',
  'NotifyApp.directives',
  'NotifyApp.services'
])

.config(function ($routeProvider) {
  $routeProvider.when('/',            { templateUrl: 'home.html', reloadOnSearch: false });
  $routeProvider.when('/landing',     { templateUrl: 'landing.html', reloadOnSearch: false });
  $routeProvider.when('/messages',    { templateUrl: 'messages.html', reloadOnSearch: false });
});

if (typeof window.cordova === 'object') {
  document.addEventListener("deviceready", init, false);
} else {
  document.addEventListener("DOMContentLoaded", init, false);
}

function init () {
  var domElement = document.querySelector('body');
  angular.bootstrap(domElement, ["NotifyApp"]);
}
