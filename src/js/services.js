angular.module('NotifyApp.services', [])

  .factory('DeviceService', function ($http) {
    var root = 'http://localhost:3000/devices';

    return {
      register: function (device) {
        return $http.post(root, device);
      }
    }
  })

  .factory('ObituaryService', function ($http) {
    return {
      get: function () {
        return orbituarySample();
      }
    }
  })

  .factory('ContactService', function ($rootScope, $q, $http) {

    return {
      create: function () {
        return navigator.contacts.create()
      },
      find: function (filter) {
        var deferred = $q.defer();

        if (!(typeof window.cordova === 'object')) {
          deferred.resolve(contactsSample());
          return deferred.promise;
        }

        var options = new ContactFindOptions();
        options.filter = filter;
        options.multiple = true;
        var fields = ['displayName'];
        navigator.contacts.find(fields, function (contacts) {
          $rootScope.$apply(function () {
            deferred.resolve(contacts);
          });
        }, function (error) {
          $rootScope.$apply(function () {
            deferred.reject(error);
          });
        }, options);

        return deferred.promise;
      },
      register: function (device, contacts) {
        return $http.post('http://localhost:3000/contacts', { uuid: device.uuid, contacts: contacts });
      }
    };
});

function contactsSample () {
  return [
    { name: { formatted: 'Alex'},
      phoneNumbers: [{ type: 'mobile', value: '12345678900' }]
    },
    { name: { formatted: 'Lora'},
      phoneNumbers: [{ type: 'mobile', value: '12345678900' }]
    },
    { name: { formatted: 'Super'},
      phoneNumbers: [{ type: 'work', value: '12345678900' }]
    },
    { name: { formatted: 'Eva'},
      phoneNumbers: [{ type: 'mobile', value: '12345678900' }]
    },
    { name: { formatted: 'Philip'},
      phoneNumbers: [{ type: 'mobile', value: '12345678900' }]
    },
  ];
}

function orbituarySample () {
  return {
    person: {
      image: 'https://s3.amazonaws.com/realdo/uploads/emma.jpg',
      name: 'Emma Watson Stone',
      birth: 'December 26, 1978',
      death: 'October 5, 2014'
    },
    obituary: 'Emma Watson Stone of Dallas, Texas passed away February 1, 2015 at the age of 32. She was born July 1, 1982 to Roy "Dale" and Kerrie(Lynn) Kelley in Dallas, Texas. Emma was a 2000 graduate of Plano High School. She enjoyed his carrer as bartender and her passion for playing durms. <br> She is survived by her parents, Dale and Kerrie Kelly and grandparents, Patsy and Barney Biscoe of Carrollton, Texas. <br> Emma was proceded in death by her grandmother, Jeana Lynn.',
    service: {
      date: 'July 22, 2015',
      time: '4:00pm',
      address: 'Turrentine-Jackson-Morrow Chapel 2525 Central Expressway North Allen, TX 75013'
    }
  }
}