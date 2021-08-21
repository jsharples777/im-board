export type Invitation = {
    from:string,
    room:string,
    message:string,
    created:number
}

export type Message = {
    from: string,
    room: string,
    message: string,
    created: number,
    priority: number
}

export type JoinLeft = {
    username: string,
    room: string,
    userList: string[]
}

export interface ChatReceiver {
    receiveLogin(username:string):void;
    receiveLogout(username:string):void;
    receiveInvitation(invite:Invitation):void;
    receiveMessage(message:Message):void;
    receiveQueuedMessages(messages:any):void;
    receiveQueuedInvites(invites:any):void;
    receiveJoinedRoom(users:JoinLeft):void;
    receivedLeftRoom(users:JoinLeft):void;
    receiveUserList(users:string[]):void;
}