import {AbstractStateManager} from "./AbstractStateManager";

abstract class AsynchronousStateManager extends AbstractStateManager {
    public abstract getConfiguredStateNames():string[];
    public abstract hasCompletedRun():boolean;
    public abstract forceResetForGet():void;
}

export default AsynchronousStateManager;