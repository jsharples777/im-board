function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

import moment from 'moment';
import debug from 'debug';
import SidebarView from './SidebarView';
import stateManager from '../state/StateManagementUtil';
var viewLogger = debug('view-ts:details');

var DetailsSidebarView = /*#__PURE__*/function (_SidebarView) {
  _inheritsLoose(DetailsSidebarView, _SidebarView);

  function DetailsSidebarView(applicationView, htmlDocument) {
    var _this;

    _this = _SidebarView.call(this, applicationView, htmlDocument, applicationView.state.ui.entryDetailsSideBar, applicationView.state.uiPrefs.entryDetailsSideBar) || this; // handler binding

    _this.updateView = _this.updateView.bind(_assertThisInitialized(_this));
    _this.eventClickItem = _this.eventClickItem.bind(_assertThisInitialized(_this)); // field and form elements

    _this.formEl = document.getElementById(_this.uiConfig.dom.formId);
    _this.titleEl = document.getElementById(_this.uiConfig.dom.titleId);
    _this.contentEl = document.getElementById(_this.uiConfig.dom.contentId);
    _this.changeOnEl = document.getElementById(_this.uiConfig.dom.changedOnId); // register state change listening

    stateManager.addChangeListenerForName(_this.config.stateNames.selectedEntry, _assertThisInitialized(_this)); // listen for form submissions

    if (_this.formEl) {
      // @ts-ignore
      _this.formEl.addEventListener('submit', _this.eventClickItem);
    }

    return _this;
  }

  var _proto = DetailsSidebarView.prototype;

  _proto.getIdForStateItem = function getIdForStateItem(name, item) {
    return item.id;
  };

  _proto.getLegacyIdForStateItem = function getLegacyIdForStateItem(name, item) {
    return item.id;
  };

  _proto.eventClickItem = function eventClickItem(event) {
    event.preventDefault();
    viewLogger('Handling submit Details Sidebar View');
    viewLogger(event.target);
    var entry = stateManager.getStateByName(this.config.stateNames.selectedEntry);
    viewLogger(entry);
    entry.title = this.titleEl ? this.titleEl.value.trim() : '';
    entry.content = this.contentEl ? this.contentEl.value.trim() : '';
    entry.changedOn = parseInt(moment().format('YYYYMMDDHHmmss'));
    viewLogger(entry);
    if (this.titleEl) this.titleEl.value = '';
    if (this.contentEl) this.contentEl.value = '';
    if (this.changeOnEl) this.changeOnEl.innerText = 'Last Changed On:';
    this.applicationView.handleUpdateEntry(entry);
  };

  _proto.updateView = function updateView(name, newState) {
    viewLogger('Handling update of Details Sidebar View');
    viewLogger(newState);
    var entry = newState;

    if (entry && entry.title) {
      if (this.titleEl) this.titleEl.value = entry.title;
      if (this.contentEl) this.contentEl.value = entry.content;
      if (this.changeOnEl) this.changeOnEl.innerText = "Last Changed On: " + moment(entry.changedOn, 'YYYYMMDDHHmmss').format('DD/MM/YYYY');
    } else {
      if (this.titleEl) this.titleEl.value = '';
      if (this.contentEl) this.contentEl.value = '';
      if (this.changeOnEl) this.changeOnEl.innerText = "Last Changed On: ";
    }
  };

  _proto.getDisplayValueForStateItem = function getDisplayValueForStateItem(name, item) {
    return "";
  };

  _proto.getDragData = function getDragData(event) {};

  _proto.getModifierForStateItem = function getModifierForStateItem(name, item) {
    return "";
  };

  _proto.getSecondaryModifierForStateItem = function getSecondaryModifierForStateItem(name, item) {
    return "";
  };

  return DetailsSidebarView;
}(SidebarView);

export default DetailsSidebarView;