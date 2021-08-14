function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

import AbstractView from './AbstractView';

var SidebarView = /*#__PURE__*/function (_AbstractView) {
  _inheritsLoose(SidebarView, _AbstractView);

  function SidebarView(applicationView, htmlDocument, uiConfig, uiPrefs) {
    var _this;

    _this = _AbstractView.call(this, applicationView, htmlDocument, uiConfig, uiPrefs) || this; // event handlers

    _this.eventHide = _this.eventHide.bind(_assertThisInitialized(_this));
    _this.eventShow = _this.eventShow.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = SidebarView.prototype;

  _proto.onDocumentLoaded = function onDocumentLoaded() {
    // this should be called once at startup
    // hide the side bar panel
    this.eventHide(null); // add the event listener for the close button

    var sidePanelEl = this.document.getElementById(this.uiConfig.dom.sideBarId);
    if (sidePanelEl === null) return;
    var closeButtonEl = sidePanelEl.querySelector('.close');

    if (closeButtonEl) {
      closeButtonEl.addEventListener('click', this.eventHide);
    }
  };

  _proto.showHide = function showHide(newStyleValue) {
    var sidePanelEl = this.document.getElementById(this.uiConfig.dom.sideBarId);
    if (sidePanelEl === null) return;

    switch (this.uiPrefs.view.location) {
      case 'left':
        {
          sidePanelEl.style.width = newStyleValue;
          break;
        }

      case 'right':
        {
          sidePanelEl.style.width = newStyleValue;
          break;
        }

      case 'bottom':
        {
          sidePanelEl.style.height = newStyleValue;
          break;
        }

      case 'top':
        {
          sidePanelEl.style.height = newStyleValue;
          break;
        }
    }
  };

  _proto.eventHide = function eventHide(event) {
    if (event) event.preventDefault();
    this.showHide('0%');
  };

  _proto.eventShow = function eventShow(event) {
    this.showHide(this.uiPrefs.view.expandedSize);
  };

  return SidebarView;
}(AbstractView);

export default SidebarView;