angular.module('NotifyApp.directives', [])

  .directive('checklistModel', function ($parse, $compile) {
    function contains(arr, item, comparator) {
      if (angular.isArray(arr)) {
        for (var i = arr.length; i--;) {
          if (comparator(arr[i], item)) {
            return true;
          }
        }
      }
      return false;
    }

    function add(arr, item, comparator) {
      arr = angular.isArray(arr) ? arr : [];
      if(!contains(arr, item, comparator)) {
        arr.push(item);
      }
      return arr;
    }  

    function remove(arr, item, comparator) {
      if (angular.isArray(arr)) {
        for (var i = arr.length; i--;) {
          if (comparator(arr[i], item)) {
            arr.splice(i, 1);
            break;
          }
        }
      }
      return arr;
    }

    function postLinkFn(scope, elem, attrs) {
      $compile(elem)(scope);
      var getter = $parse(attrs.checklistModel);
      var setter = getter.assign;
      var checklistChange = $parse(attrs.checklistChange);
      var value = $parse(attrs.checklistValue)(scope.$parent);
      var comparator = angular.equals;

      if (attrs.hasOwnProperty('checklistComparator')){
        comparator = $parse(attrs.checklistComparator)(scope.$parent);
      }

      scope.$watch('checked', function(newValue, oldValue) {
        if (newValue === oldValue) { 
          return;
        } 
        var current = getter(scope.$parent);
        if (newValue === true) {
          setter(scope.$parent, add(current, value, comparator));
        } else {
          setter(scope.$parent, remove(current, value, comparator));
        }

        if (checklistChange) {
          checklistChange(scope);
        }
      });
      
      function setChecked(newArr, oldArr) {
        scope.checked = contains(newArr, value, comparator);
      }

      if (angular.isFunction(scope.$parent.$watchCollection)) {
        scope.$parent.$watchCollection(attrs.checklistModel, setChecked);
      } else {
        scope.$parent.$watch(attrs.checklistModel, setChecked, true);
      }
    }

    return {
      restrict: 'A',
      priority: 1000,
      terminal: true,
      scope: true,
      compile: function(tElement, tAttrs) {
        if (tElement[0].tagName !== 'INPUT' || tAttrs.type !== 'checkbox') {
          throw 'checklist-model should be applied to `input[type="checkbox"]`.';
        }

        if (!tAttrs.checklistValue) {
          throw 'You should provide `checklist-value`.';
        }

        tElement.removeAttr('checklist-model');
        tElement.attr('ng-model', 'checked');

        return postLinkFn;
      }
    };
  })

  .directive('selectRecipient', function () {
    return {
      restrict: 'A',
      link: function (scope, elem) {
        scope.change = function () {
          console.log();
          if (scope.selected) { 
            scope.$parent.$parent.includedCount -= 1;
            scope.$parent.$parent.excludedCount += 1;
          } else {
            scope.$parent.$parent.includedCount += 1;
            scope.$parent.$parent.excludedCount -= 1;
          }
          scope.selected = !scope.selected;
        }
      }
    };
  });