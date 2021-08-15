export default interface StateChangeListener {
    stateChanged(name:string, newValue:any):void;
    stateChangedItemAdded(name:string, itemAdded:any):void;
    stateChangedItemRemoved(name:string, itemRemoved:any):void;
    stateChangedItemUpdated(name:string, itemUpdated:any, itemNewValue:any):void;
}