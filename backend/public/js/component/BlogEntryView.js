import React from "react";
import PropTypes from 'prop-types';
import moment from 'moment';
import debug from 'debug';
import controller from "../Controller";
var beLogger = debug('view-ts:blogentry'); // @ts-ignore

export default function BlogEntryView(_ref) {
  var entry = _ref.entry,
      showCommentsHandler = _ref.showCommentsHandler,
      editEntryHandler = _ref.editEntryHandler,
      deleteEntryHandler = _ref.deleteEntryHandler;

  if (entry) {
    beLogger("Entry " + entry.User.id + " === " + controller.getLoggedInUserId());
    var editButton;
    var deleteButton;

    if (entry.User.id === controller.getLoggedInUserId()) {
      editButton = /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "btn-primary btn-sm rounded p-1 mr-2",
        "entry-id": entry.id,
        onClick: editEntryHandler
      }, "\xA0\xA0Edit \xA0", /*#__PURE__*/React.createElement("i", {
        className: "fas fa-edit"
      }), "\xA0\xA0");
      deleteButton = /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "btn-warning btn-sm rounded p-1 mr-2",
        "entry-id": entry.id,
        onClick: deleteEntryHandler
      }, "\xA0\xA0Delete \xA0", /*#__PURE__*/React.createElement("i", {
        className: "fas fa-trash-alt"
      }), "\xA0\xA0");
    } else {
      editButton = /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "btn-outline-secondary btn-sm rounded p-1 mr-2 ",
        disabled: true
      }, "\xA0\xA0Edit \xA0", /*#__PURE__*/React.createElement("i", {
        className: "fas fa-edit"
      }), "\xA0\xA0");
      deleteButton = /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "btn-outline-secondary btn-sm rounded p-1 mr-2",
        disabled: true
      }, "\xA0\xA0Delete \xA0", /*#__PURE__*/React.createElement("i", {
        className: "fas fa-trash-alt"
      }), "\xA0\xA0");
    }

    return /*#__PURE__*/React.createElement("div", {
      className: "col-sm-12 col-md-6 col-lg-4 col-xl-3 p-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card",
      style: {
        width: "350px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-header"
    }, entry.title, "\xA0\xA0\xA0\xA0", /*#__PURE__*/React.createElement("a", {
      className: "text-decoration-none"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-comments text-secondary",
      "entry-id": entry.id,
      onClick: showCommentsHandler
    }), "\xA0\xA0", /*#__PURE__*/React.createElement("span", {
      className: "badge badge-pill badge-primary text-right",
      "entry-id": entry.id,
      onClick: showCommentsHandler
    }, "\xA0", entry.Comments.length, "\xA0"))), /*#__PURE__*/React.createElement("div", {
      className: "card-body"
    }, /*#__PURE__*/React.createElement("p", {
      className: "card-text"
    }, entry.content), editButton, deleteButton), /*#__PURE__*/React.createElement("div", {
      className: "card-footer text-right text-muted"
    }, entry.User.username, " on ", moment(entry.changedOn, 'YYYYMMDDHHmmss').format('DD/MM/YYYY'))));
  } else {
    return /*#__PURE__*/React.createElement("div", null);
  }
}
BlogEntryView.propTypes = {
  entry: PropTypes.any.isRequired,
  showCommentsHandler: PropTypes.func.isRequired,
  editEntryHandler: PropTypes.func.isRequired,
  deleteEntryHandler: PropTypes.func.isRequired
};