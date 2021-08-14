import debug from 'debug';
import downloader from "./network/DownloadManager";
import stateManager from "./state/StateManagementUtil";
import { isSame } from "./util/EqualityFunctions";
import notifier from "./notification/NotificationManager";
import socketManager from "./socket/SocketManager";
import { RequestType } from "./network/Types";
var cLogger = debug('controller-ts');

var Controller = /*#__PURE__*/function () {
  function Controller() {}

  var _proto = Controller.prototype;

  _proto.connectToApplication = function connectToApplication(applicationView, clientSideStorage) {
    this.applicationView = applicationView;
    this.clientSideStorage = clientSideStorage;
    this.config = this.applicationView.state; // setup Async callbacks for the fetch requests

    this.callbackForUsers = this.callbackForUsers.bind(this);
    this.callbackForEntries = this.callbackForEntries.bind(this);
    this.callbackForCreateEntry = this.callbackForCreateEntry.bind(this);
    this.callbackForCreateComment = this.callbackForCreateComment.bind(this); // state listener

    this.stateChanged = this.stateChanged.bind(this);
    stateManager.addChangeListenerForName(this.config.stateNames.entries, this);
    return this;
  };

  _proto.stateChanged = function stateChanged(name, value) {
    cLogger("State changes " + name);
    cLogger(value);
    this.applicationView.setState({
      isLoggedIn: this.isLoggedIn(),
      loggedInUserId: this.getLoggedInUserId(),
      selectedEntry: {},
      entries: value
    });
  }
  /*
  *
  * Call back functions for database operations
  *
   */
  ;

  _proto.callbackForUsers = function callbackForUsers(data, status) {
    cLogger('callback for all users');
    var users = [];

    if (status >= 200 && status <= 299) {
      // do we have any data?
      cLogger(data);
      var cbUsers = data; // covert the data to the AppType User

      cbUsers.forEach(function (cbUser) {
        var user = {
          id: cbUser.id,
          username: cbUser.username
        };
        users.push(user);
      });
    }

    stateManager.setStateByName(this.config.stateNames.users, users);
  };

  Controller.convertJSONCommentToComment = function convertJSONCommentToComment(jsonComment) {
    var comment = {
      id: jsonComment.id,
      content: jsonComment.content,
      createdBy: jsonComment.createdBy,
      changedOn: jsonComment.changedOn,
      commentOn: jsonComment.commentOn
    };
    return comment;
  };

  Controller.convertJSONUserToUser = function convertJSONUserToUser(jsonUser) {
    var user = {
      id: jsonUser.id,
      username: jsonUser.username
    };
    return user;
  };

  Controller.convertJSONEntryToBlogEntry = function convertJSONEntryToBlogEntry(jsonEntry) {
    var entry = {
      id: jsonEntry.id,
      title: jsonEntry.title,
      content: jsonEntry.content,
      createdBy: jsonEntry.createdBy,
      changedOn: jsonEntry.changedOn,
      User: null,
      Comments: []
    };
    var cbUser = jsonEntry.user;

    if (cbUser) {
      entry.User = Controller.convertJSONUserToUser(cbUser);
    }

    var cbComments = jsonEntry.comments;

    if (cbComments) {
      cbComments.forEach(function (cbComment) {
        var comment = Controller.convertJSONCommentToComment(cbComment);
        entry.Comments.push(comment);
      });
    }

    return entry;
  };

  _proto.callbackForEntries = function callbackForEntries(data, status) {
    cLogger('callback for all entries');
    var entries = [];

    if (status >= 200 && status <= 299) {
      // do we have any data?
      cLogger(data);
      data.forEach(function (cbEntry) {
        var entry = Controller.convertJSONEntryToBlogEntry(cbEntry);
        entries.push(entry);
      });
    }

    stateManager.setStateByName(this.config.stateNames.entries, entries);
  };

  _proto.callbackForCreateEntry = function callbackForCreateEntry(data, status) {
    cLogger('callback for create entry');
    var entry = null;

    if (status >= 200 && status <= 299) {
      // do we have any data?
      cLogger(data);

      var _entry = Controller.convertJSONEntryToBlogEntry(data);

      stateManager.addNewItemToState(this.config.stateNames.entries, _entry);
    }
  };

  _proto.callbackForCreateComment = function callbackForCreateComment(data, status) {
    cLogger('callback for create comment');
    var comment = null;

    if (status >= 200 && status <= 299) {
      // do we have any data?
      var _comment = Controller.convertJSONCommentToComment(data);

      cLogger(_comment); // find the corresponding entry in state

      var entry = stateManager.findItemInState(this.config.stateNames.entries, {
        id: _comment.commentOn
      }, isSame);
      cLogger(entry);

      if (entry) {
        cLogger('callback for create comment - updating entry'); // update the entry with the new comment

        entry.Comments.push(_comment); // update the entry in the state manager

        stateManager.updateItemInState(this.config.stateNames.entries, entry, isSame); // reselect the same entry

        stateManager.setStateByName(this.config.stateNames.selectedEntry, entry);
        cLogger(entry);
      }
    }
  }
  /*
  *
  *   API calls
  *
   */
  ;

  _proto.getAllUsers = function getAllUsers() {
    cLogger('Getting All Users');
    var jsonRequest = {
      url: this.getServerAPIURL() + this.config.apis.users,
      type: RequestType.GET,
      params: {},
      callback: this.callbackForUsers
    };
    downloader.addApiRequest(jsonRequest, true);
  };

  _proto.getAllEntries = function getAllEntries() {
    cLogger('Getting All Entries');
    var jsonRequest = {
      url: this.getServerAPIURL() + this.config.apis.entries,
      type: RequestType.GET,
      params: {},
      callback: this.callbackForEntries
    };
    downloader.addApiRequest(jsonRequest, true);
  };

  _proto.apiDeleteComment = function apiDeleteComment(id) {
    var deleteCommentCB = function deleteCommentCB(data, status) {
      cLogger('callback for delete comment');

      if (status >= 200 && status <= 299) {
        // do we have any data?
        cLogger(data);
      }
    };

    var jsonRequest = {
      url: this.getServerAPIURL() + this.config.apis.comment,
      type: RequestType.DELETE,
      params: {
        id: id
      },
      callback: deleteCommentCB
    };
    downloader.addApiRequest(jsonRequest);
  };

  _proto.apiDeleteEntry = function apiDeleteEntry(entry) {
    var deleteCB = function deleteCB(data, status) {
      cLogger('callback for delete entry');

      if (status >= 200 && status <= 299) {
        // do we have any data?
        cLogger(data);
      }
    };

    if (entry) {
      var jsonRequest = {
        url: this.getServerAPIURL() + this.config.apis.entries,
        type: RequestType.DELETE,
        params: {
          id: entry.id
        },
        callback: deleteCB
      };
      downloader.addApiRequest(jsonRequest);
    }
  };

  _proto.apiCreateEntry = function apiCreateEntry(entry) {
    if (entry) {
      var jsonRequest = {
        url: this.getServerAPIURL() + this.config.apis.entries,
        type: RequestType.POST,
        params: entry,
        callback: this.callbackForCreateEntry
      };
      downloader.addApiRequest(jsonRequest, true);
    }
  };

  _proto.apiCreateComment = function apiCreateComment(comment) {
    if (comment) {
      var jsonRequest = {
        url: this.getServerAPIURL() + this.config.apis.comment,
        type: RequestType.POST,
        params: comment,
        callback: this.callbackForCreateComment
      };
      downloader.addApiRequest(jsonRequest, true);
    }
  };

  _proto.apiUpdateEntry = function apiUpdateEntry(entry) {
    var updateCB = function updateCB(data, status) {
      cLogger('callback for update entry');

      if (status >= 200 && status <= 299) {
        // do we have any data?
        cLogger(data);
      }
    };

    if (entry) {
      var jsonRequest = {
        url: this.getServerAPIURL() + this.config.apis.entries,
        type: RequestType.PUT,
        params: entry,
        callback: updateCB
      };
      downloader.addApiRequest(jsonRequest);
    }
  }
  /*
  *
  * Simple Application state (URL, logged in user)
  *
   */
  ;

  _proto.getServerAPIURL = function getServerAPIURL() {
    var result = "/api"; // @ts-ignore

    if (window.ENV && window.ENV.serverURL) {
      // @ts-ignore
      result = window.ENV.serverURL;
    }

    return result;
  };

  _proto.isLoggedIn = function isLoggedIn() {
    var isLoggedIn = false;

    try {
      // @ts-ignore
      if (loggedInUserId) {
        isLoggedIn = true;
      }
    } catch (error) {}

    cLogger("Are logged in: " + isLoggedIn);
    return isLoggedIn;
  };

  _proto.getLoggedInUserId = function getLoggedInUserId() {
    var result = -1;

    try {
      // @ts-ignore
      if (loggedInUserId) {
        // @ts-ignore
        result = loggedInUserId;
      }
    } catch (error) {}

    cLogger("Logged in user id: " + result);
    return result;
  }
  /*
    Get the base data for the application (users, entries)
   */
  ;

  _proto.initialise = function initialise() {
    cLogger('Initialising data state'); // listen for socket events

    socketManager.setListener(this); // load the users

    this.getAllUsers(); // load the entries

    this.getAllEntries();
  } // Lets delete a comment
  ;

  _proto.deleteComment = function deleteComment(id) {
    var entry = stateManager.getStateByName(this.config.stateNames.selectedEntry);

    if (entry) {
      cLogger("Handling delete comment for " + entry.id + " and comment " + id); // find the comment in the entry and remove it from the state

      var comments = entry.Comments;
      var foundIndex = comments.findIndex(function (element) {
        return element.id === id;
      });

      if (foundIndex >= 0) {
        // remove comment from the array
        cLogger('Found comment in entry - removing');
        comments.splice(foundIndex, 1);
        cLogger(entry); // update the statement manager

        stateManager.setStateByName(this.config.stateNames.selectedEntry, entry);
        stateManager.updateItemInState(this.config.stateNames.entries, entry, isSame);
      }
    }

    this.apiDeleteComment(id);
  };

  _proto.deleteEntry = function deleteEntry(entry) {
    if (entry) {
      cLogger("Handling delete entry for " + entry.id); // update the state manager

      stateManager.removeItemFromState(this.config.stateNames.entries, entry, isSame); // initiate a call to remove from the database

      this.apiDeleteEntry(entry);
    }
  };

  _proto.updateEntry = function updateEntry(entry) {
    if (entry) {
      cLogger(entry);

      if (entry.id) {
        cLogger("Handling update for entry " + entry.id); // update the state manager

        stateManager.updateItemInState(this.config.stateNames.entries, entry, isSame); // update the database

        this.apiUpdateEntry(entry);
      } else {
        cLogger("Handling create for entry"); // new entry

        this.apiCreateEntry(entry);
      }
    }
  };

  _proto.addComment = function addComment(comment) {
    if (comment) {
      cLogger(comment);
      cLogger("Handling create for comment");
      this.apiCreateComment(comment);
    }
  }
  /*
  *  sockets -
  *  Handling data changes by other users
  *
   */
  ;

  _proto.handleMessage = function handleMessage(message) {
    cLogger(message);
  };

  _proto.getCurrentUser = function getCurrentUser() {
    return this.getLoggedInUserId();
  };

  _proto.handleDataChangedByAnotherUser = function handleDataChangedByAnotherUser(message) {
    cLogger("Handling data change " + message.type + " on object type " + message.objectType + " made by user " + message.user);
    var changeUser = stateManager.findItemInState(this.config.stateNames.users, {
      id: message.user
    }, isSame);
    var stateObj = message.data;
    cLogger(stateObj); // ok lets work out where this change belongs

    try {
      switch (message.type) {
        case "create":
          {
            switch (message.objectType) {
              case "Comment":
                {
                  // updating comments is more tricky as it is a sub object of the blog entry
                  // find the entry in question
                  var changedEntry = stateManager.findItemInState(this.config.stateNames.entries, {
                    id: stateObj.commentOn
                  }, isSame);

                  if (changedEntry) {
                    var comment = Controller.convertJSONCommentToComment(stateObj); // add the new comment

                    changedEntry.Comments.push(comment); // update the state

                    stateManager.updateItemInState(this.config.stateNames.entries, changedEntry, isSame); // was this entry current open by the user?

                    var currentSelectedEntry = stateManager.getStateByName(this.config.stateNames.selectedEntry);

                    if (currentSelectedEntry) {
                      if (currentSelectedEntry.id === changedEntry.id) {
                        stateManager.setStateByName(this.config.stateNames.selectedEntry, changedEntry);
                      }
                    }

                    var username = "unknown";

                    if (changeUser) {
                      username = changeUser.username;
                    }

                    notifier.show(changedEntry.title, username + " added comment " + stateObj.content);
                  }

                  break;
                }

              case "BlogEntry":
                {
                  var entry = Controller.convertJSONEntryToBlogEntry(stateObj);
                  cLogger("Converting to BlogEntry type for Create");
                  cLogger(entry); // add the new item to the state

                  stateManager.addNewItemToState(this.config.stateNames.entries, entry);
                  var _username = "unknown";

                  if (changeUser) {
                    _username = changeUser.username;
                  }

                  notifier.show(stateObj.title, _username + " added new entry");
                  break;
                }

              case "User":
                {
                  var user = Controller.convertJSONUserToUser(stateObj); // add the new item to the state

                  stateManager.addNewItemToState(this.config.stateNames.users, user);
                  notifier.show(stateObj.username, stateObj.username + " has just registered.", 'message');
                  break;
                }
            }

            break;
          }

        case "update":
          {
            switch (message.objectType) {
              case "BlogEntry":
                {
                  var _entry2 = Controller.convertJSONEntryToBlogEntry(stateObj);

                  cLogger("Converting to BlogEntry type for Update");
                  cLogger(_entry2); // update the item in the state

                  stateManager.updateItemInState(this.config.stateNames.entries, _entry2, isSame); // the entry could be selected by this (different user) but that would only be for comments, which is not what changed, so we are done

                  break;
                }
            }

            break;
          }

        case "delete":
          {
            switch (message.objectType) {
              case "Comment":
                {
                  // removing comments is more tricky as it is a sub object of the blog entry
                  // find the entry in question
                  var _changedEntry = stateManager.findItemInState(this.config.stateNames.entries, {
                    id: stateObj.commentOn
                  }, isSame);

                  cLogger(_changedEntry);

                  if (_changedEntry) {
                    // remove the comment
                    var comments = _changedEntry.Comments;
                    var foundIndex = comments.findIndex(function (element) {
                      return element.id === stateObj.id;
                    });

                    if (foundIndex >= 0) {
                      // remove comment from the array
                      cLogger('Found comment in entry - removing');
                      comments.splice(foundIndex, 1);
                      cLogger(_changedEntry); // update the state

                      stateManager.updateItemInState(this.config.stateNames.entries, _changedEntry, isSame); // was this entry current open by the user?

                      var _currentSelectedEntry = stateManager.getStateByName(this.config.stateNames.selectedEntry);

                      if (_currentSelectedEntry) {
                        if (_currentSelectedEntry.id === _changedEntry.id) {
                          stateManager.setStateByName(this.config.stateNames.selectedEntry, _changedEntry);
                        }
                      }
                    }
                  }

                  break;
                }

              case "BlogEntry":
                {
                  cLogger("Deleting Blog Entry with id " + stateObj.id);
                  var deletedEntry = stateManager.findItemInState(this.config.stateNames.entries, stateObj, isSame);
                  cLogger(deletedEntry);

                  if (deletedEntry) {
                    cLogger("Deleting Blog Entry with id " + deletedEntry.id);
                    stateManager.removeItemFromState(this.config.stateNames.entries, deletedEntry, isSame); // the current user could be accessing the comments in the entry that was just deleted

                    var _currentSelectedEntry2 = stateManager.getStateByName(this.config.stateNames.selectedEntry);

                    if (_currentSelectedEntry2) {
                      if (_currentSelectedEntry2.id === deletedEntry.id) {
                        cLogger("Deleted entry is selected by user, closing sidebars"); // ask the application to close any access to the comments

                        this.applicationView.hideAllSideBars();
                      }
                    }

                    notifier.show(deletedEntry.title, deletedEntry.User.username + " has deleted this entry.", 'danger');
                  }

                  break;
                }
            }

            break;
          }
      }
    } catch (err) {
      cLogger(err);
    }
  };

  return Controller;
}();

var controller = new Controller();
export default controller;