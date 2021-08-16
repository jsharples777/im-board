import {AbstractStateManager, stateEventType, stateValue} from "./AbstractStateManager";
import {equalityFunction} from "../util/EqualityFunctions";
import {jsonRequest, RequestType} from "../network/Types";
import downloader from "../network/DownloadManager";
import debug from 'debug';
import AsychronousStateManager from "./AsynchronousStateManager";

const apiSMLogger = debug('state-manager-api');

type ApiConfig = {
    stateName:string,
    serverURL:string,
    api:string
    isActive:boolean
}

export class RESTApiStateManager extends AsychronousStateManager{
    private static _instance:RESTApiStateManager;

    public static getInstance() {
        if (!(RESTApiStateManager._instance)) {
            RESTApiStateManager._instance = new RESTApiStateManager();
        }
        return RESTApiStateManager._instance;
    }

    protected configuration:ApiConfig[] = [];
    protected bHasCompletedRun:boolean = false;

    protected constructor() {
        super();
        this.forceSaves = false;
        this.bHasCompletedRun = false;

        this.callbackForAddItem = this.callbackForAddItem.bind(this);
        this.callbackForRemoveItem = this.callbackForRemoveItem.bind(this);
        this.callbackForUpdateItem = this.callbackForUpdateItem.bind(this);
        this.callbackForGetItems = this.callbackForGetItems.bind(this);
    }

    getConfiguredStateNames(): string[] {
       let results:string[] = [];
       this.configuration.forEach((config) => {
          results.push(config.stateName);
       });
       return results;
    }
    hasCompletedRun(): boolean {
        return this.bHasCompletedRun;
    }
    forceResetForGet(): void {
        this.bHasCompletedRun = false;
    }

    public initialise(config:ApiConfig[]) {
        this.configuration = config;
    }

    protected getConfigurationForStateName(name:string) {
        let config:ApiConfig = {
            stateName:name,
            serverURL:'',
            api:'',
            isActive:false
        }
        let foundIndex = this.configuration.findIndex((config) => config.stateName === name);
        if (foundIndex >= 0) {
            config = this.configuration[foundIndex];
        }
        return config;
    }
    private callbackForRemoveItem(data: any, status: number,associatedStateName:string) {
        apiSMLogger('callback for remove item - assuming client state manager has already removed');
        if (status >= 200 && status <= 299) { // do we have any data?
            apiSMLogger(data);
        }
    }
    private callbackForUpdateItem(data: any, status: number,associatedStateName:string) {
        apiSMLogger('callback for remove item - assuming client state manager has already updated');
        if (status >= 200 && status <= 299) { // do we have any data?
            apiSMLogger(data);
        }
    }
    private callbackForGetItems(data: any, status: number,associatedStateName:string) {
        apiSMLogger('callback for add item');
        if (status >= 200 && status <= 299) { // do we have any data?
            apiSMLogger(data);
            this.informChangeListenersForStateWithName(associatedStateName,data,stateEventType.StateChanged);
        }
    }

    private callbackForAddItem(data: any, status: number,associatedStateName:string) {
        apiSMLogger('callback for add item');
        if (status >= 200 && status <= 299) { // do we have any data?
            apiSMLogger(data);
            let config:ApiConfig = this.getConfigurationForStateName(associatedStateName);
            this.informChangeListenersForStateWithName(associatedStateName,data,stateEventType.ItemAdded);
        }
    }

    _addNewNamedStateToStorage(state: stateValue): void { /* assume model on the other end exists */ }

    _getState(name: string): stateValue {
        apiSMLogger(`Getting All ${name}`);
        let config:ApiConfig = this.getConfigurationForStateName(name);
        if (config.isActive) {
            const jsonRequest: jsonRequest = {
                url: config.serverURL + config.api,
                type: RequestType.GET,
                params: {},
                callback: this.callbackForGetItems,
                associatedStateName:name
            };
            downloader.addApiRequest(jsonRequest, true);

        }
        else {
            apiSMLogger(`No configuration for state ${name}`);
        }
        let state:stateValue = { name: name, value: []};
        return state;
    }

    _ensureStatePresent(name: string): void { /* assume state exists */ }

    _replaceNamedStateInStorage(state: stateValue): void { /* not going to replace all state */ }

    _saveState(name: string, stateObj: any): void { /* not going to replace all state */ }

    _addItemToState(name: string, stateObj: any,isPersisted:boolean = false): void {
        if (isPersisted) return; // dont add complete objects to the state - they are already processed
        apiSMLogger(`Adding item to ${name}`);
        apiSMLogger(stateObj);
        let config: ApiConfig = this.getConfigurationForStateName(name);
        if (config.isActive) {
            const jsonRequest: jsonRequest = {
                url: config.serverURL + config.api,
                type: RequestType.POST,
                params: stateObj,
                callback: this.callbackForAddItem,
                associatedStateName: name
            };
            downloader.addApiRequest(jsonRequest, true);

        } else {
            apiSMLogger(`No configuration for state ${name}`);
        }
    }


    _removeItemFromState(name: string, stateObj: any, testForEqualityFunction: equalityFunction): void {
        apiSMLogger(`Removing item to ${name}`);
        apiSMLogger(stateObj);
        let config: ApiConfig = this.getConfigurationForStateName(name);
        if (config.isActive) {
            const jsonRequest: jsonRequest = {
                url: config.serverURL + config.api,
                type: RequestType.DELETE,
                params: {
                    id: stateObj.id
                },
                callback: this.callbackForRemoveItem,
                associatedStateName: name
            };
            downloader.addApiRequest(jsonRequest, true);

        } else {
            apiSMLogger(`No configuration for state ${name}`);
        }
    }

    _updateItemInState(name: string, stateObj: any, testForEqualityFunction: equalityFunction): void {
        apiSMLogger(`Updating item in ${name}`);
        apiSMLogger(stateObj);
        let config: ApiConfig = this.getConfigurationForStateName(name);
        if (config.isActive) {
            const jsonRequest: jsonRequest = {
                url: config.serverURL + config.api,
                type: RequestType.PUT,
                params: stateObj,
                callback: this.callbackForUpdateItem,
                associatedStateName: name
            };
            downloader.addApiRequest(jsonRequest, true);

        } else {
            apiSMLogger(`No configuration for state ${name}`);
        }
    }
}