export default interface StateChangeListener {
    stateChanged(name:string, newValue:any):void;
}