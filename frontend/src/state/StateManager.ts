import {equalityFunction} from "../util/EqualityFunctions";
import {StateChangeInformer} from "./StateChangeInformer";
import StateChangeListener from "./StateChangeListener";

export type stateValue = { name: string, value: any};
export type stateListeners = {name:string, listeners: StateChangeListener[]};
export enum stateEventType {
    ItemAdded,
    ItemUpdated,
    ItemDeleted,
    StateChanged
}

export interface StateManager extends StateChangeInformer {

    getStateByName(name: string): any;

    setStateByName(name: string, stateObjectForName: any, informListeners: boolean): void;

    addNewItemToState(name: string, item: any, isPersisted: boolean): void;

    findItemInState(name: string, item: any, testForEqualityFunction: equalityFunction): any;

    isItemInState(name: string, item: any, testForEqualityFunction: equalityFunction): boolean;

    removeItemFromState(name: string, item: any, testForEqualityFunction: equalityFunction): boolean;

    updateItemInState(name: string, item: any, testForEqualityFunction: equalityFunction): boolean;
}