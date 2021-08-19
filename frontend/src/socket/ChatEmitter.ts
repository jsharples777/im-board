export interface ChatEmitter {
    login():void;
    logout():void;

    joinChat(room:string):void;
    leaveChat(room:string):void;

    sendMessage(room:string, message:string):void;

}