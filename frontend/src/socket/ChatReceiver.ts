export type Invitation = {
    from:string,
    room:string
}

export type Message = {
    from: string,
    room: string,
    message: string,
}

export interface ChatReceiver {
    receiveInvitation(invite:Invitation):void;
    receiveMessage(room:string,message:string):void;
    receiveQueuedMessages(messages:any):void;
    receiveQueuedInvites(invites:any):void;
}