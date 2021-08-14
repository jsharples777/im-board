function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

import Notification from "./Notification";

var BulmaNotification = /*#__PURE__*/function (_Notification) {
  _inheritsLoose(BulmaNotification, _Notification);

  function BulmaNotification(notificationManager) {
    return _Notification.call(this, notificationManager) || this;
  } // Make the notification visible on the screen


  var _proto = BulmaNotification.prototype;

  _proto.show = function show(title, message, topOffset, context, duration) {
    var _this = this;

    if (topOffset === void 0) {
      topOffset = 0;
    }

    if (context === void 0) {
      context = 'info';
    }

    if (duration === void 0) {
      duration = 3000;
    }

    // Creating the notification container div
    var containerNode = document.createElement('div');
    containerNode.className = 'notification note note-visible';
    containerNode.style.top = topOffset + "px"; // Adding the notification title node

    var titleNode = document.createElement('p');
    titleNode.className = 'note-title';
    titleNode.textContent = title; // Adding the notification message content node

    var messageNode = document.createElement('p');
    messageNode.className = 'note-content';
    messageNode.textContent = message; // Adding a little button on the notification

    var closeButtonNode = document.createElement('button');
    closeButtonNode.className = 'delete';
    closeButtonNode.addEventListener('click', function () {
      _this.notificationManager.remove(containerNode);
    }); // Appending the container with all the elements newly created

    containerNode.appendChild(closeButtonNode);
    containerNode.appendChild(titleNode);
    containerNode.appendChild(messageNode);
    containerNode.classList.add("is-" + context); // Inserting the notification to the page body

    var containerEl = document.getElementById(this.containerId);
    if (containerEl) containerEl.appendChild(containerNode); // Default duration delay

    if (duration <= 0) {
      duration = 2000;
    }

    setTimeout(function () {
      _this.notificationManager.remove(containerNode);
    }, duration);
    return containerNode;
  };

  return BulmaNotification;
}(Notification);

export { BulmaNotification as default };