function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

import debug from 'debug';
import moment from 'moment';
import controller from "../Controller";
import stateManager from '../state/StateManagementUtil';
import { isSame } from '../util/EqualityFunctions';
import SidebarView from './SidebarView';
var viewLogger = debug('view-ts:comments');

var CommentSidebarView = /*#__PURE__*/function (_SidebarView) {
  _inheritsLoose(CommentSidebarView, _SidebarView);

  function CommentSidebarView(applicationView, htmlDocument) {
    var _this;

    _this = _SidebarView.call(this, applicationView, htmlDocument, applicationView.state.ui.commentSideBar, applicationView.state.uiPrefs.commentSideBar) || this; // handler binding

    _this.updateView = _this.updateView.bind(_assertThisInitialized(_this)); // elements

    _this.commentHeaderEl = htmlDocument.getElementById(_this.uiConfig.dom.headerId);
    _this.newCommentFormEl = htmlDocument.getElementById(_this.uiConfig.dom.newFormId);
    if (_this.newCommentFormEl) _this.newCommentFormEl.addEventListener('submit', _this.applicationView.handleAddComment);
    _this.newCommentTextEl = htmlDocument.getElementById(_this.uiConfig.dom.commentId);
    _this.newCommentSubmitEl = htmlDocument.getElementById(_this.uiConfig.dom.submitCommentId); // register state change listening

    stateManager.addChangeListenerForName(_this.config.stateNames.selectedEntry, _assertThisInitialized(_this));
    return _this;
  }

  var _proto = CommentSidebarView.prototype;

  _proto.getIdForStateItem = function getIdForStateItem(name, item) {
    return item.id;
  };

  _proto.getLegacyIdForStateItem = function getLegacyIdForStateItem(name, item) {
    return item.id;
  };

  _proto.getDisplayValueForStateItem = function getDisplayValueForStateItem(name, item) {
    viewLogger("Getting display value for comment " + item.id + " with content " + item.content); // find the user for the item from the createdBy attribute

    var createdBy = stateManager.findItemInState(this.config.stateNames.users, {
      id: item.createdBy
    }, isSame);
    var createdOn = moment(item.changedOn, 'YYYYMMDDHHmmss').format('DD/MM/YYYY HH:mm');
    return item.content + " - " + createdBy.username + " on " + createdOn + "  ";
  };

  _proto.getModifierForStateItem = function getModifierForStateItem(name, item) {
    var result = 'inactive';

    if (item.createdBy === controller.getLoggedInUserId()) {
      result = 'normal';
    }

    return result;
  };

  _proto.getSecondaryModifierForStateItem = function getSecondaryModifierForStateItem(name, item) {
    return 'normal';
  };

  _proto.eventClickItem = function eventClickItem(event) {
    event.preventDefault();
    var entry = stateManager.getStateByName(this.config.stateNames.selectedEntry);
    viewLogger(event.target); // @ts-ignore

    var id = event.target.getAttribute(this.uiConfig.dom.resultDataKeyId);

    if (!id) {
      //get the id from the containing element
      // @ts-ignore
      var parentEl = event.target.parentNode;
      id = parentEl.getAttribute(this.uiConfig.dom.resultDataKeyId);
    } // @ts-ignore


    viewLogger("Comment " + event.target.innerText + " with id " + id + " clicked", 20);

    if (id) {
      id = parseInt(id); // find the comment in the selected entry

      var comment = entry.Comments.find(function (comment) {
        return comment.id === id;
      });

      if (comment) {
        viewLogger("Comment created by " + comment.createdBy + " and current user is " + controller.getLoggedInUserId()); // only able to delete if the comment was created by the current user

        if (comment.createdBy === controller.getLoggedInUserId()) {
          this.applicationView.handleDeleteComment(parseInt(id));
        }
      }
    }
  };

  _proto.updateView = function updateView(name, newState) {
    viewLogger('Updating view');
    viewLogger(newState);

    if (controller.isLoggedIn()) {
      if (this.newCommentTextEl) this.newCommentTextEl.removeAttribute("readonly");
      if (this.newCommentSubmitEl) this.newCommentSubmitEl.removeAttribute("disabled");
    } else {
      if (this.newCommentTextEl) this.newCommentTextEl.setAttribute("readonly", "true");
      if (this.newCommentSubmitEl) this.newCommentSubmitEl.setAttribute("disabled", "true");
    }

    if (newState && newState.Comments) {
      if (this.commentHeaderEl) this.commentHeaderEl.innerHTML = newState.title;
      viewLogger(newState.Comments);
      this.createResultsForState(name, newState.Comments);
    }
  };

  _proto.getDragData = function getDragData(event) {};

  return CommentSidebarView;
}(SidebarView);

export default CommentSidebarView;