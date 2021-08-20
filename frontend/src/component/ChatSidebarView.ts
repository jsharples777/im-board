import debug from 'debug';
import SidebarView from './SidebarView';
import {StateManager} from '../state/StateManager';
import {ChatEventListener} from "../socket/ChatEventListener";
import {NotificationController} from "../socket/NotificationController";
import {ChatLog, ChatManager} from "../socket/ChatManager";


const csLogger = debug('chat-sidebar');
const csLoggerDetail = debug('chat-sidebar:detail');

class ChatSidebarView extends SidebarView implements ChatEventListener {
    // @ts-ignore
    protected chatLogDiv: HTMLElement;
    // @ts-ignore
    protected chatForm: HTMLElement;
    // @ts-ignore
    protected commentEl: HTMLElement;

    protected selectedChatLog:ChatLog|null = null;

    constructor(applicationView: any, htmlDocument: HTMLDocument, stateManager: StateManager) {
        super(applicationView, htmlDocument, applicationView.state.ui.chatSideBar, applicationView.state.uiPrefs.chatSideBar, stateManager);

        this.config = applicationView.state;

        // handler binding
        this.updateView = this.updateView.bind(this);
        this.eventClickItem = this.eventClickItem.bind(this);
        this.handleAddMessage = this.handleAddMessage.bind(this);

        NotificationController.getInstance().addListener(this);
    }

    handleChatLogUpdated(log: ChatLog): void {
        csLogger(`Handling chat log updates`);
        this.renderChatLog(log);
    }

    handleAddMessage(event:Event) :void {
        csLogger(`Handling message event`);
    }


    onDocumentLoaded() {
        super.onDocumentLoaded();
        // @ts-ignore
        this.chatLogDiv = document.getElementById(this.uiConfig.dom.chatLogId);
        // @ts-ignore
        this.commentEl = document.getElementById(this.uiConfig.dom.commentId);
        // @ts-ignore
        this.chatForm = document.getElementById(this.uiConfig.dom.newFormId);

        this.chatForm.addEventListener('submit',this.handleAddMessage);

        this.updateView('',{});
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
        return this.getModifierForStateItem(name,item);
    }

    protected getBadgeValue(name: string, item: any): string {
        return item.numOfNewMessages;
    }

    renderChatLog(chatLog:any) {
        csLoggerDetail(`Chat Log ${chatLog.roomName} rendering`);
        if (this.selectedChatLog) {
            if (this.selectedChatLog.roomName === chatLog.roomName) {
                this.selectedChatLog = chatLog;
                ChatManager.getInstance().touchChatLog(chatLog.roomName);
            }
        }
        this.updateView('',{});
        // render the chat conversation
    }

    eventClickItem(event: MouseEvent) {
        event.preventDefault();
        console.log(event.target);
        // @ts-ignore
        const room = event.target.getAttribute(this.uiConfig.dom.resultDataKeyId);
        // @ts-ignore
        const dataSource = event.target.getAttribute(this.uiConfig.dom.resultDataSourceId);

        // @ts-ignore
        csLoggerDetail(`Chat Log ${event.target} with id ${room} clicked from ${dataSource}`);
        this.selectedChatLog = ChatManager.getInstance().getChatLog(room);
        this.renderChatLog(this.selectedChatLog);
    }


    updateView(name: string, newState: any) {
        newState = ChatManager.getInstance().getChatLogs();
        csLogger(newState);
        this.createResultsForState(name, newState);
    }

    getDragData(event: DragEvent) {}
    protected eventDeleteClickItem(event: MouseEvent): void {}

    handleChatLogsUpdated(): void {
        this.updateView('',{});
    }


}

export default ChatSidebarView;
