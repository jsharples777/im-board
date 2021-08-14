import debug from 'debug';
var lsLogger = debug('local-storage');

var LocalStorageUtil = /*#__PURE__*/function () {
  function LocalStorageUtil(localStorage) {
    this.localStorage = localStorage;
  }

  var _proto = LocalStorageUtil.prototype;

  _proto.saveWithStorageKey = function saveWithStorageKey(key, saveData) {
    lsLogger("Local Storage: Saving with key " + key);
    lsLogger(saveData);
    var stringifiedSaveData = JSON.stringify(saveData);
    lsLogger(stringifiedSaveData);
    this.localStorage.setItem(key, stringifiedSaveData);
  };

  _proto.getWithStorageKey = function getWithStorageKey(key) {
    var savedResults = [];
    lsLogger("Local Storage: Loading with key " + key);
    var savedResultsJSON = this.localStorage.getItem(key);
    lsLogger(savedResultsJSON);

    if (savedResultsJSON !== null) {
      savedResults = JSON.parse(savedResultsJSON);
    }

    return savedResults;
  }
  /* add a new item to the local storage if not already there */
  ;

  _proto.addNewItemToKeyStorage = function addNewItemToKeyStorage(key, item) {
    if (item !== null) {
      lsLogger("Local Storage: Adding with key " + key);
      lsLogger(item);
      var previousResults = this.getWithStorageKey(key);
      previousResults.push(item);
      this.saveWithStorageKey(key, previousResults);
    }
  };

  _proto.removeItemFromKeyStorage = function removeItemFromKeyStorage(key, item) {
    if (item !== null) {
      lsLogger("Local Storage: Removing with key " + key);
      lsLogger(item);
      var previousResults = this.getWithStorageKey(key);
      var foundIndex = previousResults.findIndex(function (element) {
        return element === item;
      });

      if (foundIndex >= 0) {
        lsLogger('Local Storage: Found item - removing ');
        previousResults.splice(foundIndex, 1);
        lsLogger(previousResults, 101);
        this.saveWithStorageKey(key, previousResults);
      }
    }
  };

  _proto.removeItemFromKeyStorageWithFunctionForEquality = function removeItemFromKeyStorageWithFunctionForEquality(key, item, testForEqualityFunction) {
    if (item !== null) {
      lsLogger("Local Storage: Removing with key " + key + " and comparison function");
      lsLogger(item, 101);
      var previousResults = this.getWithStorageKey(key);
      var foundIndex = previousResults.findIndex(function (element) {
        return testForEqualityFunction(element, item);
      });

      if (foundIndex >= 0) {
        lsLogger('Local Storage: Found item - removing ');
        previousResults.splice(foundIndex, 1);
        lsLogger(previousResults, 101);
        this.saveWithStorageKey(key, previousResults);
      }
    }
  };

  return LocalStorageUtil;
}();

export { LocalStorageUtil as default };