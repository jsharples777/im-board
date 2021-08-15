import {AbstractStateManager, stateValue} from "./AbstractStateManager";

export class AggregateStateManager extends AbstractStateManager {
    private stateManagers:AbstractStateManager[];
    private static _instance:AggregateStateManager;

    public static getInstance() {
        if (!(AggregateStateManager._instance)) {
            AggregateStateManager._instance = new AggregateStateManager();
        }
        return AggregateStateManager._instance;
    }

    private constructor() {
        super();
        this.stateManagers = [];
    }

    public addStateManager(stateManager:AbstractStateManager) {
        this.stateManagers.push(stateManager);
        stateManager.suppressEvents();
    }

    public _addNewNamedStateToStorage(state: stateValue): void {
        this.stateManagers.forEach((manager) => {
           manager._addNewNamedStateToStorage(state);
        });
    }

    public _getState(name: string): stateValue {
        let state:stateValue = {
            name: name,
            value: []
        }
        if (this.stateManagers.length > 0) {
            state = this.stateManagers[0]._getState(name);
        }
        return state;
    }

    public _isStatePresent(name: string): boolean {
        let result = false;
        if (this.stateManagers.length > 0) {
            result = this.stateManagers[0]._isStatePresent(name);
        }
        return result;
    }

    public _replaceNamedStateInStorage(state: stateValue): void {
        this.stateManagers.forEach((manager) => {
            manager._replaceNamedStateInStorage(state);
        });
    }

    public _saveState(name: string, stateObj: any): void {
        this.stateManagers.forEach((manager) => {
            manager._saveState(name,stateObj);
        });
    }


}