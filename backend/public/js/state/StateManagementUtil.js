import debug from 'debug';
var smLogger = debug('state-manager-ts');

/** To Do - make state unchangeable outside of this class (i.e. deep copies) */
var StateManagementUtil = /*#__PURE__*/function () {
  /*
    Singleton
   */
  StateManagementUtil.create = function create() {
    if (StateManagementUtil._instance === null) {
      StateManagementUtil._instance = new StateManagementUtil();
    }

    return StateManagementUtil._instance;
  };

  function StateManagementUtil() {
    this.applicationState = [];
    this.stateChangeListeners = [];
  }

  var _proto = StateManagementUtil.prototype;

  _proto.isStatePresent = function isStatePresent(name) {
    var result = this.applicationState.findIndex(function (element) {
      return element.name === name;
    }) >= 0;
    smLogger("State Manager: Checking state of " + name + " is present = " + result);
    return result;
  };

  _proto.informChangeListenersForStateWithName = function informChangeListenersForStateWithName(name, stateObjValue) {
    smLogger("State Manager: Informing state listeners of " + name);
    var foundIndex = this.stateChangeListeners.findIndex(function (element) {
      return element.name === name;
    });

    if (foundIndex >= 0) {
      smLogger("State Manager: Found state listeners of " + name);
      /* let each state change listener know */

      var changeListenersForName = this.stateChangeListeners[foundIndex];

      for (var index = 0; index < changeListenersForName.listeners.length; index++) {
        smLogger("State Manager: Found state listener of " + name + " - informing");
        var listener = changeListenersForName.listeners[index];
        listener.stateChanged(name, stateObjValue);
      }
    }
  }
  /*
      Add a state listener for a given state name
      the listener should be a function with two parameters
      name - string - the name of the state variable that they want to be informed about
      stateObjValue - object - the new state value
     */
  ;

  _proto.addChangeListenerForName = function addChangeListenerForName(name, listener) {
    smLogger("State Manager: Adding state listener for " + name);
    var foundIndex = this.stateChangeListeners.findIndex(function (element) {
      return element.name === name;
    });

    if (foundIndex >= 0) {
      var changeListenersForName = this.stateChangeListeners[foundIndex];
      changeListenersForName.listeners.push(listener);
    } else {
      smLogger("State Manager: Adding state listener for " + name + " - first occurrence");
      var listenersNameArrayPair = {
        name: name,
        listeners: [listener]
      };
      this.stateChangeListeners.push(listenersNameArrayPair);
    }
  };

  _proto.getStateByName = function getStateByName(name) {
    smLogger("State Manager: Getting state for " + name);
    var stateValueObj = {};
    var foundIndex = this.applicationState.findIndex(function (element) {
      return element.name === name;
    });

    if (foundIndex >= 0) {
      // get the current state
      var stateNameValuePair = this.applicationState[foundIndex];
      stateValueObj = stateNameValuePair.value;
      smLogger("State Manager: Found previous state for " + name);
      smLogger(stateValueObj);
    } else {
      // create the state if not already present
      stateValueObj = this.addStateByName(name, []);
    }

    return stateValueObj;
  };

  _proto.setStateByName = function setStateByName(name, stateObjectForName) {
    smLogger("State Manager: Setting state for " + name);
    smLogger(stateObjectForName);
    var foundIndex = this.applicationState.findIndex(function (element) {
      return element.name === name;
    });

    if (foundIndex >= 0) {
      // set the current state
      var stateNameValuePair = this.applicationState[foundIndex];
      stateNameValuePair.value = stateObjectForName;
    } else {
      // create the state if not already present
      this.addStateByName(name, stateObjectForName);
    }

    this.informChangeListenersForStateWithName(name, stateObjectForName);
    return stateObjectForName;
  };

  _proto.addStateByName = function addStateByName(name, stateObjForName) {
    /* create a new state attribute for the application state */
    if (!this.isStatePresent(name)) {
      smLogger("State Manager: Adding state for " + name + " - first occurrence");
      smLogger(stateObjForName, 201);
      var stateNameValuePair = {
        name: name,
        value: stateObjForName
      };
      this.applicationState.push(stateNameValuePair);
    } else {
      /* get the current state value and replace it */
      this.setStateByName(name, stateObjForName);
    }

    return stateObjForName;
  };

  _proto.addNewItemToState = function addNewItemToState(name, item) {
    // assumes state is an array
    smLogger("State Manager: Adding item to state " + name);
    var state = this.getStateByName(name);
    state.push(item);
    smLogger(state);
    this.informChangeListenersForStateWithName(name, state);
  };

  _proto.findItemInState = function findItemInState(name, item, testForEqualityFunction) {
    // assumes state is an array
    var result = {};
    var state = this.getStateByName(name);
    var foundIndex = state.findIndex(function (element) {
      return testForEqualityFunction(element, item);
    });
    smLogger("Finding item in state " + name + " - found index " + foundIndex);
    smLogger(item);

    if (foundIndex >= 0) {
      result = state[foundIndex];
    }

    return result;
  };

  _proto.isItemInState = function isItemInState(name, item, testForEqualityFunction) {
    // assumes state is an array
    var result = false;
    var state = this.getStateByName(name);
    var foundIndex = state.findIndex(function (element) {
      return testForEqualityFunction(element, item);
    });

    if (foundIndex >= 0) {
      result = true;
    }

    return result;
  };

  _proto.removeItemFromState = function removeItemFromState(name, item, testForEqualityFunction) {
    var result = false;
    var state = this.getStateByName(name);
    var foundIndex = state.findIndex(function (element) {
      return testForEqualityFunction(element, item);
    });

    if (foundIndex >= 0) {
      result = true; // remove the item from the state

      smLogger('State Manager: Found item - removing ');
      state.splice(foundIndex, 1);
      smLogger(state);
      this.setStateByName(name, state);
    }

    return result;
  };

  _proto.updateItemInState = function updateItemInState(name, item, testForEqualityFunction) {
    var result = false;
    var state = this.getStateByName(name);
    var foundIndex = state.findIndex(function (element) {
      return testForEqualityFunction(element, item);
    });

    if (foundIndex >= 0) {
      result = true; // remove the item from the state

      smLogger('State Manager: Found item - replacing ');
      state.splice(foundIndex, 1, item); //state.push(item);

      smLogger(state);
      this.setStateByName(name, state);
    } else {
      // add the item to the state
      this.addNewItemToState(name, item);
    }

    return result;
  };

  return StateManagementUtil;
}();

StateManagementUtil._instance = null;
var stateManager = StateManagementUtil.create();
export default stateManager;