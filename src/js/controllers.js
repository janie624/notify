angular.module('NotifyApp.controllers', [])

.controller('MainController', function ($scope, DeviceService, ContactService) {
  $scope.contacts = [];
  $scope.contact = {};

  $scope.registerDevice = function () {
    DeviceService.register(device).then(function (deivce) {
      console.log(device);
    }, function (error) {
      console.log(error);
    });
  };

  $scope.findContact = function () {
    ContactService.find('').then(function (contacts) {
      for(var i = 0; i < contacts.length; i++) {
        if (contacts[i].phoneNumbers && contacts[i].phoneNumbers.length) {
          var phoneNumber = contacts[i].phoneNumbers.filter(function (phoneNumber) {
            return (phoneNumber.type === 'mobile')
          })[0];

          if (phoneNumber) {
            contacts[i].mobileNumber = phoneNumber.value;
            $scope.contacts.push(contacts[i]);
          }
        }
      }
    }, function (error) {
      console.log(error);
    });
  };

  $scope.saveContact = function () {
    $scope.contact.save();
  };

  $scope.registerContacts = function () {
    ContactService.register(device, $scope.contacts).then(function (response) {
      console.log(response);
    }, function (error) {
      console.log(error);
    });
  };

  $scope.findContact();
})

.controller('LandingController', function ($scope, $sce, ObituaryService) {
  var data = ObituaryService.get();
  $scope.person = data.person;
  $scope.obituary = $sce.trustAsHtml(data.obituary);
  $scope.service = data.service;
})

.controller('MessagesController', function ($scope, $window) {
  $scope.contacts = $scope.$parent.contacts;
  $scope.includedCount = 0;
  $scope.excludedCount = $scope.contacts.length;
  $scope.message = {};
  $scope.recipientNames = '';

  $scope.sendMessage = function () {
    if (!$scope.message.body) {
      alert('The message cannot be blank.');
      return;
    }

    if ($scope.message.body.length > 1000) {
      alert('The message is limited to 1000 characters.');
      return;
    }

    if (!$scope.message.recipientIds) {
      alert('Please select recipient.');
      return;
    }

    var success = function () { console.log('Message sent successfully'); };
    var error = function (e) { console.log('Message Failed:' + e); };
    var ids = $scope.message.recipientIds;
    var options = {
      replaceLineBreaks: false,
      android: {
        intent: '' // send SMS without open any other app
        //intent: 'INTENT'  // send SMS with the native android SMS messaging
      }
    };

    for (var i = 0; i < ids.length; i++) {
      var recipient = $scope.contacts.filter(function (contact) {
        return (contact.id === ids[i])
      })[0];

      sms.send(recipient.mobileNumber, $scope.message.body, options, success, error);
    }

    alert('Messages sent successfully');
    $window.location.href = '#/';
  }

  $scope.changeRecipientNames = function () {
    var ids = $scope.message.recipientIds
      , recipientsNames = '';

    if (!ids) {
      $scope.recipientsNames = '';
      return;
    }

    for (var i = 0; i < ids.length; i++) {
      var recipient = $scope.contacts.filter(function (contact) {
        return (contact.id === ids[i])
      })[0];

      var name = recipient.name.formatted;

      if (recipientsNames === '') {
        recipientsNames = name;
      } else {
        recipientsNames += (', ' + name);
      }
    }

    $scope.recipientsNames = recipientsNames;
  };
});
