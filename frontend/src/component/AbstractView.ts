import debug from 'debug';
import browserUtil from '../util/BrowserUtil';
import StateChangeListener from "../state/StateChangeListener";

const avLogger = debug('view-ts')

export default abstract class AbstractView implements StateChangeListener {
  protected applicationView:any;
  protected document:HTMLDocument;
  protected uiConfig:any;
  protected uiPrefs:any;

  protected config: any;

  protected constructor(applicationView:any, htmlDocument:HTMLDocument, uiConfig:any, uiPrefs:any) {
    this.applicationView = applicationView;
    this.document = document;
    this.uiConfig = uiConfig;
    this.uiPrefs = uiPrefs;
    this.config = applicationView.state;

    // state change listening
    this.stateChanged = this.stateChanged.bind(this);

    // event handlers
    this.eventStartDrag = this.eventStartDrag.bind(this);
    this.eventClickItem = this.eventClickItem.bind(this);
  }

  public abstract onDocumentLoaded():void;


  /* abstract */
  protected abstract eventClickItem(event:MouseEvent):void;

  protected abstract getDragData(event:DragEvent):any;

  protected abstract getIdForStateItem(name:string, item:any):string;
  protected abstract getLegacyIdForStateItem(name:string, item:any):string;
  protected abstract getDisplayValueForStateItem(name:string, item:any):string;
  protected abstract getModifierForStateItem(name:string, item:any):string;
  protected abstract getSecondaryModifierForStateItem(name:string, item:any):string;
  protected abstract updateView(name:string, newState:any):void;


  protected eventStartDrag(event:DragEvent) {
    avLogger('Abstract View : drag start', 10);
    const data = JSON.stringify(this.getDragData(event));
    avLogger(data, 10);
    // @ts-ignore
    event.dataTransfer.setData(this.applicationView.state.ui.draggable.draggableDataKeyId, data);
  }



  protected createResultsForState(name:string, newState:any):void {
    avLogger('Abstract View : creating Results', 10);
    avLogger(newState);
    const domConfig = this.uiConfig.dom;
    // remove the previous items from list
    const viewEl = document.getElementById(domConfig.resultsId);
    if (viewEl) browserUtil.removeAllChildren(viewEl);

    // add the new children
    newState.map((item:any, index:number) => {

      const childEl = this.document.createElement(domConfig.resultsElementType);
      browserUtil.addRemoveClasses(childEl,domConfig.resultsClasses);

      // add the key ids for selection
      childEl.setAttribute(domConfig.resultDataKeyId, this.getIdForStateItem(name, item));
      childEl.setAttribute(domConfig.resultLegacyDataKeyId, this.getLegacyIdForStateItem(name, item));
      childEl.setAttribute(domConfig.resultDataSourceId, domConfig.resultDataSourceValue);
      const displayText = this.getDisplayValueForStateItem(name, item);
      // add modifiers for patient state
      const modifier = this.getModifierForStateItem(name, item);
      const secondModifier = this.getSecondaryModifierForStateItem(name, item);
      switch (modifier) {
        case 'normal': {
          avLogger('Abstract View: normal item', 10);
          browserUtil.addRemoveClasses(childEl,domConfig.modifierClassNormal);
          if (domConfig.iconNormal !== '') {
            childEl.innerHTML = displayText + domConfig.iconNormal;
          } else {
            childEl.innerText = displayText;
          }

          switch (secondModifier) {
            case 'warning': {
              browserUtil.addRemoveClasses(childEl,domConfig.modifierClassNormal,false);
              browserUtil.addRemoveClasses(childEl,domConfig.modifierClassWarning,true);
              if (domConfig.iconWarning !== '') {
                childEl.innerHTML += domConfig.iconWarning;
              }
              break;
            }
            case 'normal': {}
          }

          break;
        }
        case 'active': {
          avLogger('Abstract View: active item', 10);
          browserUtil.addRemoveClasses(childEl,domConfig.modifierClassActive);
          if (domConfig.iconActive !== '') {
            childEl.innerHTML = displayText + domConfig.iconActive;
          } else {
            childEl.innerText = displayText;
          }
          switch (secondModifier) {
            case 'warning': {
              browserUtil.addRemoveClasses(childEl,domConfig.modifierClassNormal,false);
              browserUtil.addRemoveClasses(childEl,domConfig.modifierClassWarning,true);
              if (domConfig.iconWarning !== '') {
                childEl.innerHTML += domConfig.iconWarning;
              }
              break;
            }
            case 'normal': {}
          }
          break;
        }
        case 'inactive': {
          avLogger('Abstract View: inactive item', 10);
          browserUtil.addRemoveClasses(childEl,domConfig.modifierClassInactive);
          if (domConfig.iconInactive !== '') {
            childEl.innerHTML = displayText + domConfig.iconInactive;
          } else {
            childEl.innerText = displayText;
          }
          switch (secondModifier) {
            case 'warning': {
              if (domConfig.iconWarning !== '') {
                childEl.innerHTML += domConfig.iconWarning;
              }
              break;
            }
            case 'normal': {}
          }
          break;
        }
      }
      // add draggable actions
      if (domConfig.isDraggable) {
        childEl.setAttribute('draggable', 'true');
        childEl.addEventListener('dragstart', this.eventStartDrag);
      }
      // add selection actions
      if (domConfig.isClickable) {
        childEl.addEventListener('click', this.eventClickItem);
      }
      avLogger(`Abstract View: Adding child ${item.id}`);
      if (viewEl) viewEl.appendChild(childEl);
    });
  }

  public stateChanged(name: string, newValue: any): void {
    this.updateView(name, newValue);
  }
}
