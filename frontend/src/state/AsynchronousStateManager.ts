import {AbstractStateManager} from "./AbstractStateManager";

abstract class AsynchronousStateManager extends AbstractStateManager {
    public abstract getConfiguredStateNames():string[];
    public abstract hasCompletedRun(stateName:string):boolean;
    public abstract forceResetForGet(stateName:string):void;
}

export default AsynchronousStateManager;