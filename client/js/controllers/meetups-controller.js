// extending demo module
var demo = angular.module('demo', ['ngResource']);

demo.controller('meetupsController', ['$scope', '$resource', function ($scope, $resource) {
    var Meetup = $resource('/api/meetups');

    Meetup.query(function(results) {
      $scope.meetups = results
    });

    $scope.meetups = [];

    $scope.createMeetup = function() {
      var meetup = new Meetup();
      $scope.meetups.push({name: $scope.meetupName});
      meetup.name = $scope.meetupName;
      meetup.$save();
      $scope.meetupName = '';
    }
}]);