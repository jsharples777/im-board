import moment from 'moment';
import debug from 'debug';

import SidebarView from './SidebarView';
import stateManager from '../state/StateManagementUtil';
import {BlogEntry} from "../AppTypes";

const viewLogger = debug('view-ts:details');

class DetailsSidebarView extends SidebarView{
  protected formEl:HTMLElement|null;
  protected titleEl:HTMLInputElement|null;
  protected contentEl:HTMLTextAreaElement|null;
  protected changeOnEl:HTMLLabelElement|null;

  constructor(applicationView:any, htmlDocument:HTMLDocument) {
    super(applicationView, htmlDocument, applicationView.state.ui.entryDetailsSideBar, applicationView.state.uiPrefs.entryDetailsSideBar);

    // handler binding
    this.updateView = this.updateView.bind(this);
    this.eventClickItem = this.eventClickItem.bind(this);

    // field and form elements
    this.formEl = document.getElementById(this.uiConfig.dom.formId);
    this.titleEl = <HTMLInputElement>document.getElementById(this.uiConfig.dom.titleId);
    this.contentEl = <HTMLTextAreaElement>document.getElementById(this.uiConfig.dom.contentId);
    this.changeOnEl = <HTMLLabelElement>document.getElementById(this.uiConfig.dom.changedOnId);

    // register state change listening
    stateManager.addChangeListenerForName(this.config.stateNames.selectedEntry, this);

    // listen for form submissions
    if (this.formEl) { // @ts-ignore
      this.formEl.addEventListener('submit',this.eventClickItem);
    }
  }

  getIdForStateItem(name:string, item:any) {
    return item.id;
  }

  getLegacyIdForStateItem(name:string, item:any) {
    return item.id;
  }

  eventClickItem(event:MouseEvent) {
    event.preventDefault();
    viewLogger('Handling submit Details Sidebar View');
    viewLogger(event.target);
    let entry = stateManager.getStateByName(this.config.stateNames.selectedEntry);
    viewLogger(entry);
    entry.title = (this.titleEl)?this.titleEl.value.trim():'';
    entry.content = (this.contentEl)?this.contentEl.value.trim():'';
    entry.changedOn = parseInt(moment().format('YYYYMMDDHHmmss'));
    viewLogger(entry);
    if (this.titleEl) this.titleEl.value = '';
    if (this.contentEl) this.contentEl.value = '';
    if (this.changeOnEl) this.changeOnEl.innerText = 'Last Changed On:';
    this.applicationView.handleUpdateEntry(entry);
  }


  updateView(name:string, newState:any) {
    viewLogger('Handling update of Details Sidebar View');
    viewLogger(newState);
    let entry = <BlogEntry>newState;
    if (entry && entry.title) {
      if (this.titleEl) this.titleEl.value = entry.title;
      if (this.contentEl) this.contentEl.value = entry.content;
      if (this.changeOnEl) this.changeOnEl.innerText = "Last Changed On: " + moment(entry.changedOn,'YYYYMMDDHHmmss').format('DD/MM/YYYY');
    }
    else {
      if (this.titleEl) this.titleEl.value = '';
      if (this.contentEl) this.contentEl.value = '';
      if (this.changeOnEl) this.changeOnEl.innerText = "Last Changed On: ";
    }
  }

  protected getDisplayValueForStateItem(name: string, item: any): string {
    return "";
  }

  protected getDragData(event: DragEvent): any {
  }

  protected getModifierForStateItem(name: string, item: any): string {
    return "";
  }

  protected getSecondaryModifierForStateItem(name: string, item: any): string {
    return "";
  }

}

export default DetailsSidebarView;
