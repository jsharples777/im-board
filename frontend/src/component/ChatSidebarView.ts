import debug from 'debug';
import SidebarView from './SidebarView';
import {StateManager} from '../state/StateManager';
import {ChatEventListener} from "../socket/ChatEventListener";
import {NotificationController} from "../socket/NotificationController";
import {ChatLog, ChatManager} from "../socket/ChatManager";
import {Message} from "../socket/ChatReceiver";
import browserUtil from "../util/BrowserUtil";
import moment from "moment";


const csLogger = debug('chat-sidebar');
const csLoggerDetail = debug('chat-sidebar:detail');

class ChatSidebarView extends SidebarView implements ChatEventListener {
    // @ts-ignore
    protected chatRoomDiv: HTMLElement;
    // @ts-ignore
    protected chatLogDiv: HTMLElement;
    // @ts-ignore
    protected chatForm: HTMLElement;
    // @ts-ignore
    protected commentEl: HTMLElement;
    // @ts-ignore
    protected sendMessageButton: HTMLElement;
    // @ts-ignore
    protected leaveChatButton: HTMLElement;

    protected selectedChatLog: ChatLog | null = null;

    constructor(applicationView: any, htmlDocument: HTMLDocument, stateManager: StateManager) {
        super(applicationView, htmlDocument, applicationView.state.ui.chatSideBar, applicationView.state.uiPrefs.chatSideBar, stateManager);

        this.config = applicationView.state;

        // handler binding
        this.updateView = this.updateView.bind(this);
        this.eventClickItem = this.eventClickItem.bind(this);
        this.handleAddMessage = this.handleAddMessage.bind(this);
        this.handleChatLogsUpdated = this.handleChatLogsUpdated.bind(this);
        this.handleChatLogUpdated = this.handleChatLogUpdated.bind(this);
        this.handleChatStarted = this.handleChatStarted.bind(this);
        this.handleUserDrop = this.handleUserDrop.bind(this);
        this.leaveChat = this.leaveChat.bind(this);

        NotificationController.getInstance().addListener(this);
    }

    private leaveChat(event:Event) {
        event.preventDefault();
        event.stopPropagation();
        if (this.selectedChatLog) {
            ChatManager.getInstance().leaveChat(this.selectedChatLog.roomName);
            this.selectedChatLog = null;
            this.clearChatLog();
            this.checkCanComment();
        }
        this.updateView('',{});
    }

    handleUserDrop(event:Event) {
        csLogger('drop event on current chat room');
        if (this.selectedChatLog) {
            // @ts-ignore
            const draggedObjectJSON = event.dataTransfer.getData(this.config.ui.draggable.draggableDataKeyId);
            const draggedObject = JSON.parse(draggedObjectJSON);
            csLogger(draggedObject);

            if (draggedObject[this.config.ui.draggable.draggedType] === this.config.ui.draggable.draggedTypeUser) {
                //add the user to the current chat if not already there
                ChatManager.getInstance().sendInvite(draggedObject.username,this.selectedChatLog.roomName);
            }
        }

    }


    handleChatLogUpdated(log: ChatLog): void {
        csLogger(`Handling chat log updates`);
        this.checkCanComment();
        this.renderChatLog(log);
        this.updateView('',{})
    }

    handleAddMessage(event: Event): void {
        event.preventDefault();
        event.stopPropagation();
        csLogger(`Handling message event`);
        if (this.selectedChatLog) {
            // @ts-ignore
            if (this.commentEl && this.commentEl.value.trim().length === 0) return;
            // @ts-ignore
            const messageContent = this.commentEl.value.trim();
            // @ts-ignore
            this.commentEl.value = '';

            let sentMessage:Message|null = ChatManager.getInstance().sendMessage(this.selectedChatLog.roomName, messageContent);
            if (sentMessage) {
                // add the message to our display
                let messageEl = this.addChatMessage(sentMessage);
                // scroll to bottom
                browserUtil.scrollSmoothTo(messageEl);
            }
        }
    }

    private checkCanComment() {
        if (this.selectedChatLog) {
            if (this.commentEl) this.commentEl.removeAttribute("readonly");
            if (this.sendMessageButton) this.sendMessageButton.removeAttribute("disabled");
            if (this.leaveChatButton) this.sendMessageButton.removeAttribute("disabled");
        } else {
            if (this.commentEl) this.commentEl.setAttribute("readonly", "true");
            if (this.sendMessageButton) this.sendMessageButton.setAttribute("disabled", "true");
            if (this.leaveChatButton) this.leaveChatButton.setAttribute("disabled", "true");
        }

    }


    onDocumentLoaded() {
        super.onDocumentLoaded();
        // @ts-ignore
        this.chatLogDiv = document.getElementById(this.uiConfig.dom.chatLogId);
        // @ts-ignore
        this.commentEl = document.getElementById(this.uiConfig.dom.commentId);
        // @ts-ignore
        this.chatForm = document.getElementById(this.uiConfig.dom.newFormId);
        // @ts-ignore
        this.sendMessageButton = document.getElementById(this.uiConfig.dom.submitCommentId);
        // @ts-ignore
        this.leaveChatButton = document.getElementById(this.uiConfig.dom.leaveChatId);
        // @ts-ignore
        this.chatRoomDiv = document.getElementById(this.uiConfig.dom.chatLogRoomId);

        this.chatRoomDiv.addEventListener('dragover', (event) => {csLoggerDetail('Dragged over'); if (this.selectedChatLog) event.preventDefault();});
        this.chatRoomDiv.addEventListener('drop', this.handleUserDrop);


        this.chatForm.addEventListener('submit', this.handleAddMessage);
        this.leaveChatButton.addEventListener('click',this.leaveChat);

        this.checkCanComment();

        this.updateView('', {});
    }

    getIdForStateItem(name: string, item: any) {
        return item.roomName;
    }

    getLegacyIdForStateItem(name: string, item: any) {
        return item.roomName;
    }

    getDisplayValueForStateItem(name: string, item: any) {
        return item.users.join(',');
    }

    getModifierForStateItem(name: string, item: any) {
        let result = 'inactive';
        if (this.selectedChatLog) {
            if (this.selectedChatLog.roomName === item.roomName) {
                result = 'active';
            }

        }
        return result;
    }

    getSecondaryModifierForStateItem(name: string, item: any) {
        return this.getModifierForStateItem(name, item);
    }

    protected getBadgeValue(name: string, item: any): number {
        return item.numOfNewMessages;
    }

    addChatMessage(message: Message): HTMLElement {
        let chatMessageEl = document.createElement('div');
        browserUtil.addRemoveClasses(chatMessageEl, "message");
        // are we dealing with an "join"/"exit" message?
        if (message.from.trim().length === 0) {
            let messageSenderEl = document.createElement('div');
            browserUtil.addRemoveClasses(messageSenderEl, 'message-sender');
            messageSenderEl.innerText = message.message;
            chatMessageEl.appendChild(messageSenderEl);
        }
        else {

            if (message.from === ChatManager.getInstance().getCurrentUser()) {
                browserUtil.addRemoveClasses(chatMessageEl, "my-message");
            } else {
                let messageSenderEl = document.createElement('div');
                browserUtil.addRemoveClasses(messageSenderEl, 'message-sender');
                messageSenderEl.innerText = message.from + '   ' + moment(message.created, 'YYYYMMDDHHmmss').format('DD/MM/YYYY ');
                chatMessageEl.appendChild(messageSenderEl);
            }

            let contentEl = document.createElement('div');
            if (message.from === ChatManager.getInstance().getCurrentUser()) {
                browserUtil.addRemoveClasses(contentEl, "my-message-content");
            } else {
                browserUtil.addRemoveClasses(contentEl, 'message-content');
            }
            contentEl.innerText = message.message;
            chatMessageEl.appendChild(contentEl);
        }

        this.chatLogDiv.appendChild(chatMessageEl);
        return chatMessageEl;
    }

    private clearChatLog() {
        browserUtil.removeAllChildren(this.chatLogDiv);
    }

    reRenderChatMessages(chatLog: ChatLog) {
        browserUtil.removeAllChildren(this.chatLogDiv);
        let messageEl:HTMLElement|null = null;
        chatLog.messages.forEach((message: Message) => {
            messageEl = this.addChatMessage(message);
        });
        // scroll to the last message (if any)
        if (messageEl) browserUtil.scrollTo(messageEl);
    }


    renderChatLog(chatLog: ChatLog) {
        csLoggerDetail(`Chat Log ${chatLog.roomName} rendering`);
        if (this.selectedChatLog) {
            if (this.selectedChatLog.roomName === chatLog.roomName) {
                this.selectedChatLog = chatLog;
                ChatManager.getInstance().touchChatLog(chatLog.roomName);
                // render the chat conversation
                this.reRenderChatMessages(chatLog);
            }
        }
        this.updateView('', {});
    }

    eventClickItem(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
        console.log(event.target);
        // @ts-ignore
        const room = event.target.getAttribute(this.uiConfig.dom.resultDataKeyId);
        // @ts-ignore
        const dataSource = event.target.getAttribute(this.uiConfig.dom.resultDataSourceId);

        // @ts-ignore
        csLoggerDetail(`Chat Log ${event.target} with id ${room} clicked from ${dataSource}`);
        this.selectedChatLog = ChatManager.getInstance().getChatLog(room);
        if (this.selectedChatLog) {
            this.checkCanComment();
            this.renderChatLog(this.selectedChatLog);
        }
    }


    updateView(name: string, newState: any) {
        csLoggerDetail(`Updating state with chat manager`);
        newState = ChatManager.getInstance().getChatLogs();
        csLoggerDetail(newState);
        this.createResultsForState(name, newState);
        this.checkCanComment();
    }

    getDragData(event: DragEvent) {}
    protected eventDeleteClickItem(event: MouseEvent): void {
        event.preventDefault();
        event.stopPropagation();
        console.log(event.target);
        // @ts-ignore
        const room = event.target.getAttribute(this.uiConfig.dom.resultDataKeyId);
        // @ts-ignore
        const dataSource = event.target.getAttribute(this.uiConfig.dom.resultDataSourceId);

        // @ts-ignore
        csLoggerDetail(`Chat Log ${event.target} with id ${room} deleted from ${dataSource}`);

        if (room) {
            let log: ChatLog|null = ChatManager.getInstance().getChatLog(room);
            if (log) {
                ChatManager.getInstance().leaveChat(room);
                if (this.selectedChatLog && (this.selectedChatLog.roomName === room)) {
                    this.selectedChatLog = null;
                    this.clearChatLog();
                    this.checkCanComment();
                }
                this.updateView('', {});
            }
        }


    }

    handleChatLogsUpdated(): void {
        if (this.selectedChatLog) {
            ChatManager.getInstance().touchChatLog(this.selectedChatLog.roomName);
            // render the chat conversation
            this.reRenderChatMessages(this.selectedChatLog);
        }
        this.updateView('', {});
        this.checkCanComment();
    }

    handleChatStarted(log: ChatLog): void {
        this.selectedChatLog = log;
        this.renderChatLog(log);
        this.updateView('',{});
    }

    handleOfflineMessagesReceived(messages: Message[]): void {
    }


}

export default ChatSidebarView;
