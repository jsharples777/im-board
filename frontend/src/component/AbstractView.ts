import debug from 'debug';
import browserUtil from '../util/BrowserUtil';
import StateChangeListener from "../state/StateChangeListener";
import {StateManager} from "../state/StateManager";

const avLogger = debug('view-ts')

export default abstract class AbstractView implements StateChangeListener {
    protected applicationView: any;
    protected document: HTMLDocument;
    protected uiConfig: any;
    protected uiPrefs: any;

    protected config: any;

    protected stateManager: StateManager;

    protected constructor(applicationView: any, htmlDocument: HTMLDocument, uiConfig: any, uiPrefs: any, stateManager: StateManager) {
        this.applicationView = applicationView;
        this.document = document;
        this.uiConfig = uiConfig;
        this.uiPrefs = uiPrefs;
        this.config = applicationView.state;
        this.stateManager = stateManager;

        // state change listening
        this.stateChanged = this.stateChanged.bind(this);

        // event handlers
        this.eventStartDrag = this.eventStartDrag.bind(this);
        this.eventClickItem = this.eventClickItem.bind(this);
        this.eventDeleteClickItem = this.eventDeleteClickItem.bind(this);
    }

    public abstract onDocumentLoaded(): void;


    /* abstract */
    protected abstract eventClickItem(event: MouseEvent): void;
    protected abstract eventDeleteClickItem(event: MouseEvent): void;

    protected abstract getDragData(event: DragEvent): any;

    protected abstract getIdForStateItem(name: string, item: any): string;

    protected abstract getLegacyIdForStateItem(name: string, item: any): string;

    protected abstract getDisplayValueForStateItem(name: string, item: any): string;

    protected abstract getModifierForStateItem(name: string, item: any): string;

    protected abstract getSecondaryModifierForStateItem(name: string, item: any): string;

    protected abstract updateView(name: string, newState: any): void;


    protected eventStartDrag(event: DragEvent) {
        avLogger('Abstract View : drag start', 10);
        const data = JSON.stringify(this.getDragData(event));
        avLogger(data, 10);
        // @ts-ignore
        event.dataTransfer.setData(this.applicationView.state.ui.draggable.draggableDataKeyId, data);
    }

    protected createResultForItem(name: string, item: any, dataSource:any = null,deleteHandler:any = null): HTMLElement {
        avLogger('Abstract View : creating Result');
        avLogger(item);
        const domConfig = this.uiConfig.dom;

        const resultDataKeyId = this.getIdForStateItem(name, item);
        const legacyDataKeyId = this.getLegacyIdForStateItem(name, item);
        if (!dataSource) {
            dataSource = domConfig.resultDataSourceValue;
        }


        let childEl:HTMLElement = this.document.createElement(domConfig.resultsElementType);
        browserUtil.addRemoveClasses(childEl, domConfig.resultsClasses);
        // the content may be structured
        let textEl = childEl;
        if (domConfig.resultContentDivClasses) {
            let contentEl:HTMLElement = this.document.createElement('div');
            browserUtil.addRemoveClasses(contentEl, domConfig.resultContentDivClasses);
            contentEl.setAttribute(domConfig.resultDataKeyId, resultDataKeyId);
            contentEl.setAttribute(domConfig.resultLegacyDataKeyId, legacyDataKeyId);
            contentEl.setAttribute(domConfig.resultDataSourceId, dataSource);


            textEl = this.document.createElement(domConfig.resultContentTextElementType);
            browserUtil.addRemoveClasses(textEl, domConfig.resultContentTextClasses);
            textEl.setAttribute(domConfig.resultDataKeyId, resultDataKeyId);
            textEl.setAttribute(domConfig.resultLegacyDataKeyId, legacyDataKeyId);
            textEl.setAttribute(domConfig.resultDataSourceId, dataSource);

            contentEl.appendChild(textEl);
            if (domConfig.isDeleteable) {
                let deleteButtonEl:HTMLElement = this.document.createElement('button');
                deleteButtonEl.setAttribute('type','button');
                browserUtil.addRemoveClasses(deleteButtonEl,domConfig.deleteButtonClasses);
                if (domConfig.deleteButtonText) {
                    if (domConfig.deleteButtonText.trim().length() > 0) {
                        domConfig.innerText = domConfig.deleteButtonText;
                    }
                }
                if (domConfig.deleteButtonIconClasses) {
                    let iconEl = document.createElement('i');
                    browserUtil.addRemoveClasses(iconEl,domConfig.deleteButtonIconClasses);
                    iconEl.setAttribute(domConfig.resultDataKeyId, resultDataKeyId);
                    iconEl.setAttribute(domConfig.resultLegacyDataKeyId, legacyDataKeyId);
                    iconEl.setAttribute(domConfig.resultDataSourceId, dataSource);
                    deleteButtonEl.appendChild(iconEl);
                }
                deleteButtonEl.setAttribute(domConfig.resultDataKeyId, resultDataKeyId);
                deleteButtonEl.setAttribute(domConfig.resultLegacyDataKeyId, legacyDataKeyId);
                deleteButtonEl.setAttribute(domConfig.resultDataSourceId, dataSource);
                if (deleteHandler) {
                    deleteButtonEl.addEventListener('click',deleteHandler);
                }
                else {
                    deleteButtonEl.addEventListener('click',this.eventDeleteClickItem);
                }
                contentEl.appendChild(deleteButtonEl);
            }
            childEl.appendChild(contentEl);
        }


        // add the key ids for selection
        childEl.setAttribute(domConfig.resultDataKeyId, resultDataKeyId);
        childEl.setAttribute(domConfig.resultLegacyDataKeyId, legacyDataKeyId);
        childEl.setAttribute(domConfig.resultDataSourceId, dataSource);
        const displayText = this.getDisplayValueForStateItem(name, item);
        // add modifiers for patient state
        const modifier = this.getModifierForStateItem(name, item);
        const secondModifier = this.getSecondaryModifierForStateItem(name, item);
        switch (modifier) {
            case 'normal': {
                avLogger('Abstract View: normal item');
                browserUtil.addRemoveClasses(childEl, domConfig.modifierClassNormal);
                if (domConfig.iconNormal !== '') {
                    textEl.innerHTML = displayText + '  ' + domConfig.iconNormal;
                } else {
                    textEl.innerText = displayText;
                }

                switch (secondModifier) {
                    case 'warning': {
                        browserUtil.addRemoveClasses(childEl, domConfig.modifierClassNormal, false);
                        browserUtil.addRemoveClasses(childEl, domConfig.modifierClassWarning, true);
                        if (domConfig.iconWarning !== '') {
                            textEl.innerHTML += '  ' + domConfig.iconWarning;
                        }
                        break;
                    }
                    case 'normal': {
                        break;
                    }
                }

                break;
            }
            case 'active': {
                avLogger('Abstract View: active item', 10);
                browserUtil.addRemoveClasses(childEl, domConfig.modifierClassActive);
                if (domConfig.iconActive !== '') {
                    textEl.innerHTML = displayText + '  ' + domConfig.iconActive;
                } else {
                    textEl.innerText = displayText;
                }
                switch (secondModifier) {
                    case 'warning': {
                        browserUtil.addRemoveClasses(childEl, domConfig.modifierClassNormal, false);
                        browserUtil.addRemoveClasses(childEl, domConfig.modifierClassWarning, true);
                        if (domConfig.iconWarning !== '') {
                            textEl.innerHTML += '  ' + domConfig.iconWarning;
                        }
                        break;
                    }
                    case 'normal': {
                        break;
                    }
                }
                break;
            }
            case 'inactive': {
                avLogger('Abstract View: inactive item', 10);
                browserUtil.addRemoveClasses(childEl, domConfig.modifierClassInactive);
                if (domConfig.iconInactive !== '') {
                    textEl.innerHTML = displayText + '  ' + domConfig.iconInactive;
                } else {
                    textEl.innerText = displayText;
                }
                switch (secondModifier) {
                    case 'warning': {
                        if (domConfig.iconWarning !== '') {
                            textEl.innerHTML += '  ' + domConfig.iconWarning;
                        }
                        break;
                    }
                    case 'normal': {
                        break;
                    }
                    case 'active': {
                        if (domConfig.iconActive !== '') {
                            textEl.innerHTML += '  ' + domConfig.iconActive;
                        }
                        break;
                    }
                }
                break;
            }
        }
        return childEl;
    }


    protected createResultsForState(name: string, newState: any): void {
        avLogger('Abstract View : creating Results', 10);
        avLogger(newState);
        const domConfig = this.uiConfig.dom;
        // remove the previous items from list
        const viewEl = document.getElementById(domConfig.resultsId);
        if (viewEl) browserUtil.removeAllChildren(viewEl);

        // add the new children
        newState.map((item: any, index: number) => {
            const childEl = this.createResultForItem(name,item);
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

    public stateChanged(managerName: string, name: string, newValue: any): void {
        this.updateView(name, newValue);
    }

    stateChangedItemAdded(managerName: string, name: string, itemAdded: any): void {
        this.updateView(name, this.stateManager.getStateByName(name));
    }

    stateChangedItemRemoved(managerName: string, name: string, itemRemoved: any): void {
        this.updateView(name, this.stateManager.getStateByName(name));
    }

    stateChangedItemUpdated(managerName: string, name: string, itemUpdated: any, itemNewValue: any): void {
        this.updateView(name, this.stateManager.getStateByName(name));
    }

}
