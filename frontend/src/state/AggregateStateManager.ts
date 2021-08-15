import {AbstractStateManager, stateValue} from "./AbstractStateManager";
import {equalityFunction} from "../util/EqualityFunctions";

type managerWithFilters = {
    manager:AbstractStateManager,
    filters:string[]
}

export class AggregateStateManager extends AbstractStateManager {
    private stateManagers:managerWithFilters[];
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

    public addStateManager(stateManager:AbstractStateManager,filters:string[] = []) {
        let mWF:managerWithFilters = {
            manager: stateManager,
            filters: filters
        };
        this.stateManagers.push(mWF);
        stateManager.suppressEvents();
    }

    private stateNameInFilters(name:string,filters:string[]):boolean {
        let foundIndex = filters.findIndex((filter) => filter === name);
        return (foundIndex >= 0);
    }

    public _addNewNamedStateToStorage(state: stateValue): void {
        this.stateManagers.forEach((managerWithFilters) => {
           if (!this.stateNameInFilters(state.name,managerWithFilters.filters)) {
               managerWithFilters.manager._addNewNamedStateToStorage(state);
           }
        });
    }

    public _getState(name: string): stateValue {
        let state:stateValue = {
            name: name,
            value: []
        }
        if (this.stateManagers.length > 0) {
            state = this.stateManagers[0].manager._getState(name);
        }
        return state;
    }

    public _isStatePresent(name: string): boolean {
        let result = false;
        if (this.stateManagers.length > 0) {
            result = this.stateManagers[0].manager._isStatePresent(name);
        }
        return result;
    }

    public _replaceNamedStateInStorage(state: stateValue): void {
        this.stateManagers.forEach((managerWithFilters) => {
            if (!this.stateNameInFilters(state.name,managerWithFilters.filters)) {
                managerWithFilters.manager._replaceNamedStateInStorage(state);
            }
        });
    }

    public _saveState(name: string, stateObj: any): void {
        this.stateManagers.forEach((managerWithFilters) => {
            if (!this.stateNameInFilters(name,managerWithFilters.filters)) {
                managerWithFilters.manager._saveState(name,stateObj);
            }
        });
    }

    _addItemToState(name: string, stateObj: any): void {
        this.stateManagers.forEach((managerWithFilters) => {
            if (!this.stateNameInFilters(name,managerWithFilters.filters)) {
                managerWithFilters.manager._addItemToState(name,stateObj);
            }
        });
    }

    _removeItemFromState(name: string, stateObj: any, testForEqualityFunction: equalityFunction): void {
        this.stateManagers.forEach((managerWithFilters) => {
            if (!this.stateNameInFilters(name,managerWithFilters.filters)) {
                managerWithFilters.manager._removeItemFromState(name,stateObj,testForEqualityFunction);
            }
        });
    }

    _updateItemInState(name: string, stateObj: any, testForEqualityFunction: equalityFunction): void {
        this.stateManagers.forEach((managerWithFilters) => {
            if (!this.stateNameInFilters(name,managerWithFilters.filters)) {
                managerWithFilters.manager._updateItemInState(name,stateObj,testForEqualityFunction);
            }
        });
    }


}