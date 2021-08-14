import AbstractView from './AbstractView';

abstract class SidebarView extends AbstractView {
  protected constructor(applicationView:any, htmlDocument:HTMLDocument, uiConfig:any, uiPrefs:any) {
    super(applicationView, htmlDocument, uiConfig, uiPrefs);
    // event handlers
    this.eventHide = this.eventHide.bind(this);
    this.eventShow = this.eventShow.bind(this);
  }

  onDocumentLoaded() { // this should be called once at startup
    // hide the side bar panel
    this.eventHide(null);

    // add the event listener for the close button
    const sidePanelEl = this.document.getElementById(this.uiConfig.dom.sideBarId);
    if (sidePanelEl === null) return;

    const closeButtonEl = sidePanelEl.querySelector('.close');
    if (closeButtonEl) {
      closeButtonEl.addEventListener('click', this.eventHide);
    }
  }

  private showHide(newStyleValue:string):void {
    const sidePanelEl = this.document.getElementById(this.uiConfig.dom.sideBarId);
    if (sidePanelEl === null) return;

    switch (this.uiPrefs.view.location) {
      case 'left': {
        sidePanelEl.style.width = newStyleValue;
        break;
      }
      case 'right': {
        sidePanelEl.style.width = newStyleValue;
        break;
      }
      case 'bottom': {
        sidePanelEl.style.height = newStyleValue;
        break;
      }
      case 'top': {
        sidePanelEl.style.height = newStyleValue;
        break;
      }
    }
  }

  eventHide(event:Event|null) {
    if (event) event.preventDefault();
    this.showHide('0%');
  }

  eventShow(event:Event|null) {
    this.showHide(this.uiPrefs.view.expandedSize);
  }
}

export default SidebarView;
