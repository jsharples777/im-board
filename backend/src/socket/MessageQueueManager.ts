import {ChatMessage, InviteMessage, QueuedMessages} from "./SocketTypes";
import debug from 'debug';

const mqLogger = debug('message-queue');


enum Status {
    LoggedOut,
    LoggedIn
}

type UserQueue = {
    username: string,
    status: Status,
    invites: InviteMessage[],
    messages: ChatMessage[]
}


export default class MessageQueueManager {
    private static _instance: MessageQueueManager;

    public static getInstance(): MessageQueueManager {
        if (!MessageQueueManager._instance) {
            MessageQueueManager._instance = new MessageQueueManager();
        }
        return MessageQueueManager._instance;
    }

    private messageQueue: UserQueue[] = [];

    private constructor() {
    }

    public setUserHasLoggedInAndReturnQueuedItems(username: string): QueuedMessages | null {
        // find the user queue if any
        let queueItems: QueuedMessages | null = null;
        let index = this.messageQueue.findIndex((queue) => queue.username === username);
        if (index >= 0) {
            mqLogger(`User ${username} has logged back in, messages in queue`);
            let queue: UserQueue = this.messageQueue[index];
            queue.status = Status.LoggedIn;
            mqLogger(queue);
            queueItems = {
                invites: [...queue.invites],
                messages: [...queue.messages]
            }
            mqLogger(queueItems);
            // remove the queued items from memory
            queue.invites = [];
            queue.messages = [];
        }
        else {
            let queue:UserQueue = {
                username: username,
                status: Status.LoggedIn,
                invites: [],
                messages: []
            }
            this.messageQueue.push(queue);
        }
        return queueItems;
    }

    public setUserHasLoggedOut(username: string) {
        // create a new queue for the user
        let queue: UserQueue;
        let index = this.messageQueue.findIndex((queue) => queue.username === username);
        mqLogger(`User ${username} has logged out, emptying queues, and setting status to logged out`);
        if (index >= 0) {
            queue = this.messageQueue[index];
            queue.status = Status.LoggedOut;
            queue.invites = [];
            queue.messages = [];
        }
        else {
            queue = {
                username: username,
                status: Status.LoggedOut,
                invites: [],
                messages: []
            }
            this.messageQueue.push(queue);
        }
    }

    public isUserLoggedIn(username:string):boolean {
        let queue: UserQueue;
        let result = false;
        let index = this.messageQueue.findIndex((queue) => queue.username === username);
        if (index >= 0) {
            queue = this.messageQueue[index];
            mqLogger(`User ${username} is logged in ${queue.status}`);
            result = (queue.status === Status.LoggedIn);
        }
        else {
            mqLogger(`User ${username} is NOT logged in`);
            queue = {
                username: username,
                status: Status.LoggedOut,
                invites: [],
                messages: []
            }
            this.messageQueue.push(queue);
        }
        return result;
    }

    public queueInviteForUser(username:string,message:InviteMessage) {
        let index = this.messageQueue.findIndex((queue) => queue.username === username);
        let queue: UserQueue;
        if (index >= 0) {
            queue = this.messageQueue[index];
            if (queue.status === Status.LoggedIn) return;
            queue.invites.push(message);
        }
        else {
            queue = {
                username: username,
                status: Status.LoggedOut,
                invites: [message],
                messages: []
            }
            this.messageQueue.push(queue);
        }
        mqLogger(`Queuing invite from ${message.from} to room ${message.room} to user ${username}`);
        queue.invites.push(message);

    }

    public queueMessageForUser(username:string,message:ChatMessage) {
        let index = this.messageQueue.findIndex((queue) => queue.username === username);
        let queue: UserQueue;
        if (index >= 0) {
            queue = this.messageQueue[index];
            if (queue.status === Status.LoggedIn) return;
            queue.messages.push(message);
        }
        else {
            queue = {
                username: username,
                status: Status.LoggedOut,
                invites: [],
                messages: [message]
            }
            this.messageQueue.push(queue);
        }
        mqLogger(`Queuing message from ${message.from} to room ${message.room} to user ${username}`);
    }
}