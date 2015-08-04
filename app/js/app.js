'use strict';

var App = angular.module('App', ['ngRoute']);

App.factory('myHttpInterceptor', function($rootScope, $q) {
  return {
    'requestError': function(config) {
      $rootScope.status = 'HTTP REQUEST ERROR ' + config;
      return config || $q.when(config);
    },
    'responseError': function(rejection) {
      $rootScope.status = 'HTTP RESPONSE ERROR ' + rejection.status + '\n' +
                          rejection.data;
      return $q.reject(rejection);
    },
  };
});

App.factory('sampleService', function($rootScope, $http, $q, $log) {
  $rootScope.status = 'Retrieving data...';
  var deferred = $q.defer();
  $http.get('rest/query')
  .success(function(data, status, headers, config) {
    $rootScope.samples = data;
    deferred.resolve();
    $rootScope.status = '';
  });
  return deferred.promise;
});

App.config(function($routeProvider) {
  $routeProvider.when('/', {
    controller : 'MainCtrl',
    templateUrl: '/partials/main.html',
    resolve    : { 'sampleService': 'sampleService' },
  });
  $routeProvider.when('/invite', {
    controller : 'InsertCtrl',
    templateUrl: '/partials/insert.html',
  });
  $routeProvider.when('/update/:id', {
    controller : 'UpdateCtrl',
    templateUrl: '/partials/update.html',
    resolve    : { 'sampleService': 'sampleService' },
  });
  $routeProvider.otherwise({
    redirectTo : '/'
  });
});

App.config(function($httpProvider) {
  $httpProvider.interceptors.push('myHttpInterceptor');
});

App.controller('MainCtrl', function($scope, $rootScope, $log, $http, $routeParams, $location, $route) {

  $scope.invite = function() {
    $location.path('/invite');
  };

  $scope.update = function(sample) {
    $location.path('/update/' + sample.id);
  };

  $scope.delete = function(sample) {
    $rootScope.status = 'Deleting sample ' + sample.id + '...';
    $http.post('/rest/delete', {'id': sample.id})
    .success(function(data, status, headers, config) {
      for (var i=0; i<$rootScope.samples.length; i++) {
        if ($rootScope.samples[i].id == sample.id) {
          $rootScope.samples.splice(i, 1);
          break;
        }
      }
      $rootScope.status = '';
    });
  };

});

App.controller('InsertCtrl', function($scope, $rootScope, $log, $http, $routeParams, $location, $route) {

  $scope.submitInsert = function() {
    var sample = {
      name : $scope.name,
      description : $scope.description,
      concentration : $scope.concentration,
    };
    $rootScope.status = 'Creating...';
    $http.post('/rest/insert', sample)
    .success(function(data, status, headers, config) {
      $rootScope.samples.push(data);
      $rootScope.status = '';
    });
    $location.path('/');
  }
});

App.controller('UpdateCtrl', function($routeParams, $rootScope, $scope, $log, $http, $location) {

  for (var i=0; i<$rootScope.samples.length; i++) {
    if ($rootScope.samples[i].id == $routeParams.id) {
      $scope.sample = angular.copy($rootScope.samples[i]);
    }
  }

  $scope.submitUpdate = function() {
    $rootScope.status = 'Updating...';
    $http.post('/rest/update', $scope.sample)
    .success(function(data, status, headers, config) {
      for (var i=0; i<$rootScope.samples.length; i++) {
        if ($rootScope.samples[i].id == $scope.sample.id) {
          $rootScope.samples.splice(i,1);
          break;
        }
      }
      $rootScope.samples.push(data);
      $rootScope.status = '';
    });
    $location.path('/');
  };

});

