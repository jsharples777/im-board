export type DataMessage = {
    type:string,
    stateName: string,
    data:any,
    user:string,
};

export type ChatMessage = {
    room: string,
    message: string,
    from: string,
    created: number
}

export type InviteMessage = {
    from: string,
    message: string,
    room:string,
    created: number
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

