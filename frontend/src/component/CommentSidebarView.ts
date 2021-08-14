import debug from 'debug';
import moment from 'moment';

import controller from "../Controller";
import stateManager from '../state/StateManagementUtil';
import {isSame} from '../util/EqualityFunctions';

import SidebarView from './SidebarView';
import StateChangeListener from "../state/StateChangeListener";

const viewLogger = debug('view-ts:comments');

class CommentSidebarView extends SidebarView implements StateChangeListener{
    protected commentHeaderEl:HTMLElement|null;
    protected newCommentFormEl:HTMLElement|null;
    protected newCommentTextEl:HTMLElement|null;
    protected newCommentSubmitEl:HTMLElement|null;


    constructor(applicationView:any, htmlDocument:HTMLDocument) {
        super(applicationView, htmlDocument, applicationView.state.ui.commentSideBar, applicationView.state.uiPrefs.commentSideBar);

        // handler binding
        this.updateView = this.updateView.bind(this);

        // elements
        this.commentHeaderEl = htmlDocument.getElementById(this.uiConfig.dom.headerId);
        this.newCommentFormEl = htmlDocument.getElementById(this.uiConfig.dom.newFormId);
        if (this.newCommentFormEl) this.newCommentFormEl.addEventListener('submit', this.applicationView.handleAddComment);
        this.newCommentTextEl = htmlDocument.getElementById(this.uiConfig.dom.commentId);
        this.newCommentSubmitEl = htmlDocument.getElementById(this.uiConfig.dom.submitCommentId);

        // register state change listening
        stateManager.addChangeListenerForName(this.config.stateNames.selectedEntry, this);
    }

    getIdForStateItem(name:string, item:any) {
        return item.id;
    }

    getLegacyIdForStateItem(name:string, item:any) {
        return item.id;
    }

    getDisplayValueForStateItem(name:string, item:any) {
        viewLogger(`Getting display value for comment ${item.id} with content ${item.content}`)
        // find the user for the item from the createdBy attribute
        const createdBy = stateManager.findItemInState(this.config.stateNames.users, {id: item.createdBy}, isSame);
        const createdOn = moment(item.changedOn,'YYYYMMDDHHmmss').format('DD/MM/YYYY HH:mm');
        return `${item.content} - ${createdBy.username} on ${createdOn}  `;
    }

    getModifierForStateItem(name:string, item:any) {
        let result = 'inactive'
        if (item.createdBy === controller.getLoggedInUserId()) {
            result = 'normal';
        }
        return result;
    }

    getSecondaryModifierForStateItem(name:string, item:any) {
        return 'normal';
    }

    eventClickItem(event:MouseEvent) {
        event.preventDefault();
        let entry = stateManager.getStateByName(this.config.stateNames.selectedEntry);

        viewLogger(event.target);
        // @ts-ignore
        let id = event.target.getAttribute(this.uiConfig.dom.resultDataKeyId);
        if (!id) {
            //get the id from the containing element
            // @ts-ignore
            let parentEl = event.target.parentNode;
            id = parentEl.getAttribute(this.uiConfig.dom.resultDataKeyId);
        }
        // @ts-ignore
        viewLogger(`Comment ${event.target.innerText} with id ${id} clicked`, 20);
        if (id) {
            id = parseInt(id);
            // find the comment in the selected entry
            let comment = entry.Comments.find((comment:any) => comment.id === id);
            if (comment) {
                viewLogger(`Comment created by ${comment.createdBy} and current user is ${controller.getLoggedInUserId()}`);
                // only able to delete if the comment was created by the current user
                if (comment.createdBy === controller.getLoggedInUserId()) {
                    this.applicationView.handleDeleteComment(parseInt(id));
                }
            }
        }
    }


    updateView(name:string, newState:any) {
        viewLogger('Updating view');
        viewLogger(newState);
        if (controller.isLoggedIn()) {
            if (this.newCommentTextEl) this.newCommentTextEl.removeAttribute("readonly");
            if (this.newCommentSubmitEl) this.newCommentSubmitEl.removeAttribute("disabled");
        } else {
            if (this.newCommentTextEl) this.newCommentTextEl.setAttribute("readonly", "true");
            if (this.newCommentSubmitEl) this.newCommentSubmitEl.setAttribute("disabled", "true");
        }

        if (newState && newState.Comments) {
            if (this.commentHeaderEl) this.commentHeaderEl.innerHTML = newState.title;
            viewLogger(newState.Comments);
            this.createResultsForState(name, newState.Comments);
        }
    }

    getDragData(event:DragEvent) {}
}

export default CommentSidebarView;
