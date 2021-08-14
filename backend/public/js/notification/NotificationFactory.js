import BootstrapNotification from "./BootstrapNotification";

var NotificationFactory = /*#__PURE__*/function () {
  function NotificationFactory() {}

  var _proto = NotificationFactory.prototype;

  _proto.createNotification = function createNotification(manager) {
    return new BootstrapNotification(manager);
  };

  return NotificationFactory;
}();

var notificationFactory = new NotificationFactory();
export default notificationFactory;