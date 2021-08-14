import debug from 'debug';
import browserUtil from '../util/BrowserUtil';
var avLogger = debug('view-ts');

var AbstractView = /*#__PURE__*/function () {
  function AbstractView(applicationView, htmlDocument, uiConfig, uiPrefs) {
    this.applicationView = applicationView;
    this.document = document;
    this.uiConfig = uiConfig;
    this.uiPrefs = uiPrefs;
    this.config = applicationView.state; // state change listening

    this.stateChanged = this.stateChanged.bind(this); // event handlers

    this.eventStartDrag = this.eventStartDrag.bind(this);
    this.eventClickItem = this.eventClickItem.bind(this);
  }

  var _proto = AbstractView.prototype;

  _proto.eventStartDrag = function eventStartDrag(event) {
    avLogger('Abstract View : drag start', 10);
    var data = JSON.stringify(this.getDragData(event));
    avLogger(data, 10); // @ts-ignore

    event.dataTransfer.setData(this.applicationView.state.ui.draggable.draggableDataKeyId, data);
  };

  _proto.createResultsForState = function createResultsForState(name, newState) {
    var _this = this;

    avLogger('Abstract View : creating Results', 10);
    avLogger(newState);
    var domConfig = this.uiConfig.dom; // remove the previous items from list

    var viewEl = document.getElementById(domConfig.resultsId);
    if (viewEl) browserUtil.removeAllChildren(viewEl); // add the new children

    newState.map(function (item, index) {
      var childEl = _this.document.createElement(domConfig.resultsElementType);

      browserUtil.addRemoveClasses(childEl, domConfig.resultsClasses); // add the key ids for selection

      childEl.setAttribute(domConfig.resultDataKeyId, _this.getIdForStateItem(name, item));
      childEl.setAttribute(domConfig.resultLegacyDataKeyId, _this.getLegacyIdForStateItem(name, item));
      childEl.setAttribute(domConfig.resultDataSourceId, domConfig.resultDataSourceValue);

      var displayText = _this.getDisplayValueForStateItem(name, item); // add modifiers for patient state


      var modifier = _this.getModifierForStateItem(name, item);

      var secondModifier = _this.getSecondaryModifierForStateItem(name, item);

      switch (modifier) {
        case 'normal':
          {
            avLogger('Abstract View: normal item', 10);
            browserUtil.addRemoveClasses(childEl, domConfig.modifierClassNormal);

            if (domConfig.iconNormal !== '') {
              childEl.innerHTML = displayText + domConfig.iconNormal;
            } else {
              childEl.innerText = displayText;
            }

            switch (secondModifier) {
              case 'warning':
                {
                  browserUtil.addRemoveClasses(childEl, domConfig.modifierClassNormal, false);
                  browserUtil.addRemoveClasses(childEl, domConfig.modifierClassWarning, true);

                  if (domConfig.iconWarning !== '') {
                    childEl.innerHTML += domConfig.iconWarning;
                  }

                  break;
                }

              case 'normal':
                {}
            }

            break;
          }

        case 'active':
          {
            avLogger('Abstract View: active item', 10);
            browserUtil.addRemoveClasses(childEl, domConfig.modifierClassActive);

            if (domConfig.iconActive !== '') {
              childEl.innerHTML = displayText + domConfig.iconActive;
            } else {
              childEl.innerText = displayText;
            }

            switch (secondModifier) {
              case 'warning':
                {
                  browserUtil.addRemoveClasses(childEl, domConfig.modifierClassNormal, false);
                  browserUtil.addRemoveClasses(childEl, domConfig.modifierClassWarning, true);

                  if (domConfig.iconWarning !== '') {
                    childEl.innerHTML += domConfig.iconWarning;
                  }

                  break;
                }

              case 'normal':
                {}
            }

            break;
          }

        case 'inactive':
          {
            avLogger('Abstract View: inactive item', 10);
            browserUtil.addRemoveClasses(childEl, domConfig.modifierClassInactive);

            if (domConfig.iconInactive !== '') {
              childEl.innerHTML = displayText + domConfig.iconInactive;
            } else {
              childEl.innerText = displayText;
            }

            switch (secondModifier) {
              case 'warning':
                {
                  if (domConfig.iconWarning !== '') {
                    childEl.innerHTML += domConfig.iconWarning;
                  }

                  break;
                }

              case 'normal':
                {}
            }

            break;
          }
      } // add draggable actions


      if (domConfig.isDraggable) {
        childEl.setAttribute('draggable', 'true');
        childEl.addEventListener('dragstart', _this.eventStartDrag);
      } // add selection actions


      if (domConfig.isClickable) {
        childEl.addEventListener('click', _this.eventClickItem);
      }

      avLogger("Abstract View: Adding child " + item.id);
      if (viewEl) viewEl.appendChild(childEl);
    });
  };

  _proto.stateChanged = function stateChanged(name, newValue) {
    this.updateView(name, newValue);
  };

  return AbstractView;
}();

export { AbstractView as default };