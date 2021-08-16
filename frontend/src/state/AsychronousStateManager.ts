export default interface AsychronousStateManager {
    getConfiguredStateNames():string[];
    hasCompletedRun():boolean;
    forResetForGet():void;
}