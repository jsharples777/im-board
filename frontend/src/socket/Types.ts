export type Invitation = {
    from:string,
    room:string,
    message:string,
    created:number,
    userList:string[],
    type: InviteType,
    requiresAcceptDecline: boolean,
    subject:string
}

export type Message = {
    from: string,
    room: string,
    message: string,
    created: number,
    priority: number,
    attachment?: any
}

export type JoinLeft = {
    username: string,
    room: string,
    userList: string[]
}

export enum Priority {
    Normal,
    High,
    Urgent
}

export enum InviteType {
    ChatRoom,
    ScoreSheet
}

export type ChatLog = {
    roomName: string,
    users: string[],
    messages: Message[],
    lastViewed: number,
    numOfNewMessages: number
}
