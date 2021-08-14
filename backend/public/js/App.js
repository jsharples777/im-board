function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/* eslint "react/react-in-jsx-scope":"off" */

/* eslint "react/jsx-no-undef":"off" */
import React from 'react';
import ReactDOM from 'react-dom';
import debug from 'debug';
import moment from 'moment';
import controller from './Controller';
import CommentSidebarView from "./component/CommentSidebarView";
import BlogEntryView from "./component/BlogEntryView";
import stateManager from "./state/StateManagementUtil";
import { isSame } from "./util/EqualityFunctions";
import DetailsSidebarView from "./component/DetailsSidebarView";
var logger = debug('app');

var Root = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(Root, _React$Component);

  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  function Root() {
    var _this;

    // @ts-ignore
    _this = _React$Component.call(this) || this;
    _this.state = {
      isLoggedIn: false,
      loggedInUserId: -1,
      entries: [],
      selectedEntry: {},
      applyUserFilter: false,
      stateNames: {
        users: 'users',
        entries: 'entries',
        selectedEntry: 'selectedEntry'
      },
      apis: {
        users: '/users',
        entries: '/blog',
        entry: '/blog',
        comment: '/comment',
        login: '/login'
      },
      ui: {
        alert: {
          modalId: "alert",
          titleId: "alert-title",
          contentId: "alert-content",
          cancelButtonId: "alert-cancel",
          confirmButtonId: "alert-confirm",
          closeButtonId: "alert-close",
          hideClass: "d-none",
          showClass: "d-block"
        },
        navigation: {
          showMyEntriesId: 'navigationItemDashboard',
          addNewEntryId: 'navigationItemAddNewEntry',
          showAllEntriesId: 'navigationItemShowAll'
        },
        blogEntry: {},
        entryDetailsSideBar: {
          dom: {
            sideBarId: 'detailsSideBar',
            formId: 'details',
            titleId: 'title',
            contentId: 'content',
            changedOnId: 'changedOn',
            resultDataKeyId: 'id',
            isDraggable: false,
            isClickable: true
          }
        },
        commentSideBar: {
          dom: {
            sideBarId: 'commentSideBar',
            headerId: 'commentHeader',
            resultsId: 'comments',
            resultsElementType: 'button',
            resultsElementAttributes: [['type', 'button']],
            resultsClasses: 'list-group-item my-list-item truncate-comment list-group-item-action',
            resultDataKeyId: 'id',
            resultLegacyDataKeyId: 'id',
            modifierClassNormal: 'float-right list-group-item-primary text-right',
            modifierClassInactive: 'float-left list-group-item-dark text-left',
            modifierClassActive: 'list-group-item-primary',
            modifierClassWarning: 'list-group-item-warning',
            iconNormal: '<i class="fas fa-trash-alt"></i>',
            iconInactive: '',
            iconActive: '',
            iconWarning: '',
            isDraggable: false,
            isClickable: true,
            newFormId: "newComment",
            commentId: "comment",
            submitCommentId: "submitComment"
          }
        }
      },
      uiPrefs: {
        navigation: {},
        blogEntry: {},
        commentSideBar: {
          view: {
            location: 'right',
            expandedSize: '50%'
          }
        },
        entryDetailsSideBar: {
          view: {
            location: 'left',
            expandedSize: '35%'
          }
        }
      },
      controller: {
        events: {
          entry: {
            eventDataKeyId: 'entry-id'
          }
        },
        dataLimit: {}
      }
    }; // event handlers

    _this.cancelDelete = _this.cancelDelete.bind(_assertThisInitialized(_this));
    _this.confirmDelete = _this.confirmDelete.bind(_assertThisInitialized(_this));
    _this.handleShowMyEntries = _this.handleShowMyEntries.bind(_assertThisInitialized(_this));
    _this.handleSelectEntryComments = _this.handleSelectEntryComments.bind(_assertThisInitialized(_this));
    _this.handleShowEditEntry = _this.handleShowEditEntry.bind(_assertThisInitialized(_this));
    _this.handleUpdateEntry = _this.handleUpdateEntry.bind(_assertThisInitialized(_this));
    _this.handleAddEntry = _this.handleAddEntry.bind(_assertThisInitialized(_this));
    _this.handleAddComment = _this.handleAddComment.bind(_assertThisInitialized(_this));
    _this.handleDeleteEntry = _this.handleDeleteEntry.bind(_assertThisInitialized(_this));
    _this.handleDeleteComment = _this.handleDeleteComment.bind(_assertThisInitialized(_this));
    controller.connectToApplication(_assertThisInitialized(_this), window.localStorage);
    return _this;
  }

  var _proto = Root.prototype;

  _proto.getCurrentUser = function getCurrentUser() {
    return controller.getLoggedInUserId();
  };

  _proto.alert = function alert(title, content) {
    this.titleEl.textContent = title;
    this.contentEl.textContent = content; // @ts-ignore

    this.modalEl.classList.remove(this.state.ui.alert.hideClass); // @ts-ignore

    this.modalEl.classList.add(this.state.ui.alert.showClass);
  };

  _proto.render = function render() {
    var _this2 = this;

    logger("Rendering App"); // @ts-ignore

    logger(this.state.entries); // @ts-ignore

    logger(this.state.applyUserFilter); // @ts-ignore

    var entriesToDisplay = this.state.entries; // @ts-ignore

    if (this.state.applyUserFilter && controller.isLoggedIn() && controller.getLoggedInUserId() > 0) {
      entriesToDisplay = entriesToDisplay.filter(function (entry) {
        return entry.createdBy === controller.getLoggedInUserId();
      });
    }

    var blog = entriesToDisplay.map(function (entry, index) {
      return /*#__PURE__*/React.createElement(BlogEntryView, {
        key: index,
        entry: entry,
        showCommentsHandler: _this2.handleSelectEntryComments,
        editEntryHandler: _this2.handleShowEditEntry,
        deleteEntryHandler: _this2.handleDeleteEntry
      });
    });
    return /*#__PURE__*/React.createElement("div", {
      className: "Root row ml-1"
    }, blog);
  };

  _proto.cancelDelete = function cancelDelete(event) {
    // @ts-ignore
    this.modalEl.classList.remove(this.state.ui.alert.showClass); // @ts-ignore

    this.modalEl.classList.add(this.state.ui.alert.hideClass);
    event.preventDefault();
  };

  _proto.confirmDelete = function confirmDelete(event) {
    // @ts-ignore
    this.modalEl.classList.remove(this.state.ui.alert.showClass); // @ts-ignore

    this.modalEl.classList.add(this.state.ui.alert.hideClass);
    event.preventDefault(); // @ts-ignore

    var entryId = this.modalEl.getAttribute(this.state.controller.events.entry.eventDataKeyId);
    logger("Handling Delete Entry " + entryId);

    if (entryId) {
      // find the entry from the state manager
      entryId = parseInt(entryId); // @ts-ignore

      var entry = stateManager.findItemInState(this.state.stateNames.entries, {
        id: entryId
      }, isSame);

      if (entry) {
        // delete the entry using the controller and remove the state manager
        controller.deleteEntry(entry); // @ts-ignore

        stateManager.removeItemFromState(this.state.stateNames.entries, entry, isSame);
      }
    }
  };

  _proto.componentDidMount = function componentDidMount() {
    logger('component Did Mount'); // add the additional views and configure them

    this.commentView = new CommentSidebarView(this, document);
    this.commentView.onDocumentLoaded(); // reset the view state

    this.detailsView = new DetailsSidebarView(this, document);
    this.detailsView.onDocumentLoaded(); // navigation item handlers

    if (document) {
      // @ts-ignore
      document.getElementById(this.state.ui.navigation.addNewEntryId).addEventListener('click', this.handleAddEntry); // @ts-ignore

      document.getElementById(this.state.ui.navigation.showMyEntriesId).addEventListener('click', this.handleShowMyEntries);
    } // alert modal dialog setup
    // @ts-ignore


    this.modalEl = document.getElementById(this.state.ui.alert.modalId); // @ts-ignore

    this.titleEl = document.getElementById(this.state.ui.alert.titleId); // @ts-ignore

    this.contentEl = document.getElementById(this.state.ui.alert.contentId); // @ts-ignore

    this.cancelBtnEl = document.getElementById(this.state.ui.alert.cancelButtonId); // @ts-ignore

    this.confirmBtnEl = document.getElementById(this.state.ui.alert.confirmButtonId); // @ts-ignore

    this.closeBtnEl = document.getElementById(this.state.ui.alert.closeButtonId); // event listeners for the confirm delete of entry

    if (this.cancelBtnEl) this.cancelBtnEl.addEventListener('click', this.cancelDelete);
    if (this.confirmBtnEl) this.confirmBtnEl.addEventListener('click', this.confirmDelete);
    if (this.closeBtnEl) this.closeBtnEl.addEventListener('click', this.cancelDelete); // ok lets try get things done

    controller.initialise();
  };

  _proto.hideAllSideBars = function hideAllSideBars() {
    this.commentView.eventHide(null);
    this.detailsView.eventHide(null);
  };

  _proto.handleShowMyEntries = function handleShowMyEntries(event) {
    logger('Handling Show My Entries');
    this.hideAllSideBars();

    if (!controller.isLoggedIn()) {
      // @ts-ignore
      window.location.href = this.state.apis.login;
      return;
    }

    this.setState({
      applyUserFilter: true
    });
  };

  _proto.handleAllEntries = function handleAllEntries(event) {
    logger('Handling Show All Entries');
    this.setState({
      applyUserFilter: false
    });
    this.hideAllSideBars();
  };

  _proto.handleAddEntry = function handleAddEntry(event) {
    logger('Handling Add Entry');
    event.preventDefault();
    this.hideAllSideBars(); // prevent anything from happening if we are not logged in

    if (!controller.isLoggedIn()) {
      // @ts-ignore
      window.location.href = this.state.apis.login;
      return;
    } // find the current user
    // @ts-ignore


    var creator = stateManager.findItemInState(this.state.stateNames.users, {
      id: controller.getLoggedInUserId()
    }, isSame);
    logger(creator); // create an empty entry

    var entry = {
      title: '',
      content: '',
      createdBy: creator.id,
      changedOn: parseInt(moment().format('YYYYMMDDHHmmss')),
      Comments: [],
      User: {
        id: creator.id,
        username: creator.username
      }
    };
    logger(entry);
    this.setState({
      selectedEntry: entry
    }); // @ts-ignore

    stateManager.setStateByName(this.state.stateNames.selectedEntry, entry);
    this.detailsView.eventShow(event);
  };

  _proto.handleAddComment = function handleAddComment(event) {
    logger('Handling Add Comment');
    event.preventDefault(); // get the comment element
    // @ts-ignore

    var commentEl = document.getElementById(this.state.ui.commentSideBar.dom.commentId);
    if (commentEl && commentEl.value.trim().length === 0) return; // prevent anything from happening if we are not logged in

    if (!controller.isLoggedIn()) {
      // @ts-ignore
      window.location.href = this.state.apis.login;
      return;
    } // find the current user
    // @ts-ignore


    var creator = stateManager.findItemInState(this.state.stateNames.users, {
      id: controller.getLoggedInUserId()
    }, isSame);
    logger(creator); // find the selected entry
    // @ts-ignore

    var entry = stateManager.getStateByName(this.state.stateNames.selectedEntry);

    if (entry && commentEl) {
      // create an empty comment
      // @ts-ignore
      var comment = {
        createdBy: creator.id,
        commentOn: entry.id,
        changedOn: parseInt(moment().format('YYYYMMDDHHmmss')),
        content: commentEl.value.trim()
      };
      commentEl.value = '';
      controller.addComment(comment);
      logger(comment);
    }
  };

  _proto.handleSelectEntryComments = function handleSelectEntryComments(event) {
    logger('Handling Select Entry Comments');
    event.preventDefault();
    this.hideAllSideBars(); // @ts-ignore

    var entryId = event.target.getAttribute(this.state.controller.events.entry.eventDataKeyId);
    logger("Handling Show Edit Entry " + entryId);

    if (entryId) {
      // find the entry from the state manager
      entryId = parseInt(entryId); // @ts-ignore

      var entry = stateManager.findItemInState(this.state.stateNames.entries, {
        id: entryId
      }, isSame);
      logger(entry);

      if (entry) {
        // select the entry and open the details sidebar
        this.setState({
          selectedEntry: entry
        }); // @ts-ignore

        stateManager.setStateByName(this.state.stateNames.selectedEntry, entry);
        this.commentView.eventShow(event);
      }
    }
  };

  _proto.handleShowEditEntry = function handleShowEditEntry(event) {
    event.preventDefault();
    this.hideAllSideBars(); // @ts-ignore

    var entryId = event.target.getAttribute(this.state.controller.events.entry.eventDataKeyId);
    logger("Handling Show Edit Entry " + entryId);

    if (entryId) {
      // find the entry from the state manager
      entryId = parseInt(entryId); // @ts-ignore

      var entry = stateManager.findItemInState(this.state.stateNames.entries, {
        id: entryId
      }, isSame);
      logger(entry);

      if (entry) {
        // select the entry and open the details sidebar
        this.setState({
          selectedEntry: entry
        }); // @ts-ignore

        stateManager.setStateByName(this.state.stateNames.selectedEntry, entry);
        this.detailsView.eventShow(event);
      }
    }
  };

  _proto.handleDeleteEntry = function handleDeleteEntry(event) {
    event.preventDefault();
    this.hideAllSideBars(); // @ts-ignore

    var entryId = event.target.getAttribute(this.state.controller.events.entry.eventDataKeyId);
    logger("Handling Delete Entry " + entryId);

    if (entryId) {
      // @ts-ignore
      this.modalEl.setAttribute(this.state.controller.events.entry.eventDataKeyId, entryId); // find the entry from the state manager

      entryId = parseInt(entryId); // @ts-ignore

      var entry = stateManager.findItemInState(this.state.stateNames.entries, {
        id: entryId
      }, isSame);
      this.alert(entry.title, "Are you sure you want to delete this blog entry?");
    }
  };

  _proto.handleDeleteComment = function handleDeleteComment(id) {
    controller.deleteComment(id);
  } // @ts-ignore
  ;

  _proto.handleUpdateEntry = function handleUpdateEntry(entry) {
    this.hideAllSideBars();
    controller.updateEntry(entry);
  };

  return Root;
}(React.Component); //localStorage.debug = 'app view-ts controller-ts socket-ts api-ts local-storage-ts state-manager-ts view-ts:blogentry view-ts:comments view-ts:details';


localStorage.debug = 'app controller-ts socket-ts';
debug.log = console.info.bind(console); // @ts-ignore

var element = /*#__PURE__*/React.createElement(Root, {
  className: "container-fluid justify-content-around"
});
ReactDOM.render(element, document.getElementById('root'));