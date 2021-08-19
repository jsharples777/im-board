export type DataMessage = {
    type:string,
    stateName: string,
    data:any,
    user:string,
};

export type ChatMessage = {
    room: string,
    message: string,
    user: string,
}

export type InviteMessage = {
    from: string,
    message: string,
    room:string
}

export type ChatUser = {
    socketId: any,
    username: string,
}

export type ChatRoom = {
    name: string
    users: ChatUser[]
}

export type QueuedMessages = {
    invites:InviteMessage[],
    messages:ChatMessage[]
}

