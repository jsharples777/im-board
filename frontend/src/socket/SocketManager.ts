import debug from 'debug';
import SocketListener from "./SocketListener";

const sDebug = debug('socket-ts');

class SocketManager {
    protected listener:SocketListener|null;
    protected socket:any|null;


    constructor() {
        this.callbackForMessage = this.callbackForMessage.bind(this);
        this.callbackForData = this.callbackForData.bind(this);
        this.listener = null;
        this.socket = null;
    }

    private callbackForMessage(message:any):void {
        sDebug(`Received message : ${message}`);
        if (this.listener) this.listener.handleMessage(message);
    }

    /*
    *
    *  expecting a JSON data object with the following attributes
    *  1.  type: "create"|"update"|"delete"
    *  2.  objectType: string name of the object type changed
    *  3.  data: the new representation of the object
    *  4.  user: application specific id for the user who made the change
    *        - the application view is required to implement getCurrentUser() to compare the user who made the change
    *
     */
    private callbackForData(message:any):void {
        sDebug(`Received data`);
        try {
            const dataObj = JSON.parse(message);
            sDebug(dataObj);
            if (this.listener === null) return;
            if (dataObj.user === this.listener.getCurrentUser()) {
                sDebug("change made by this user, ignoring");
            }
            else {
                sDebug("change made by another user, passing off to the application");
                this.listener.handleDataChangedByAnotherUser(dataObj);
            }

        }
        catch (err) {
            sDebug('Not JSON data');
        }
    }

    public setListener(listener:SocketListener) {
        sDebug('Setting listener');
        this.listener = listener;
        sDebug('Creating socket connection');
        // @ts-ignore
        this.socket = io();
        sDebug('Waiting for messages');
        this.socket.on('message',this.callbackForMessage);
        this.socket.on('data',this.callbackForData)
    }

    public sendMessage(message:string):void {
        this.socket.emit('message',message);
    }
}

let socketManager = new SocketManager();
export default socketManager;