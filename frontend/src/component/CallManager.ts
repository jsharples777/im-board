import controller from "../Controller";
import debug from 'debug';
import browserUtil from "../util/BrowserUtil";

const callLogger = debug('call-manager');

export class CallManager {
    private static _instance: CallManager;
    

    public static getInstance(): CallManager {
        if (!(CallManager._instance)) {
            CallManager._instance = new CallManager();
        }
        return CallManager._instance;
    }

    private peer: any | null = null;
    private webrtcDiv: HTMLElement | null = null;
    private myVideoStream: MediaStream | null = null;    
    
    private constructor() {}
    
    public initialise(applicationView:any) {
        if (controller.isLoggedIn()) {
            // @ts-ignore  - is for the WebRTC peer via Nodejs
            this.peer = new Peer(controller.getLoggedInUsername(), {path: '/peerjs', host: '/', port: '3000'});
            this.peer.on('open', (id:any) => {
                callLogger('My peer ID is: ' + id);
            });
        }
        // @ts-ignore
        this.webrtcDiv = document.getElementById(applicationView.state.ui.scoreSheet.dom.webrtc);
    }

    public startScoreSheet() {
        if (controller.isLoggedIn()) {
            if (navigator.mediaDevices.getUserMedia) {
                callLogger('Starting scoresheet');
                navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: true,
                }).then((stream) => {
                    this.myVideoStream = stream;
                    this.addVideoStream(controller.getLoggedInUsername(), this.myVideoStream, true);
                });
            }
        }
    }
    
    public reset() {
        if (this.webrtcDiv) browserUtil.removeAllChildren(this.webrtcDiv);
    }

    private addVideoStream(username: string, stream: MediaStream, isCurrentUser = false) {
        const videoCard = document.createElement('div');
        videoCard.setAttribute("id", username);
        browserUtil.addRemoveClasses(videoCard, 'card col-sm-12 col-md-4 col-lg-3');
        const videoCardTitle = document.createElement('div');
        browserUtil.addRemoveClasses(videoCardTitle, 'card-header');
        videoCardTitle.innerHTML = `<h5 class="card-title">${username}</h5>`;
        const videoCardBody = document.createElement('div');
        browserUtil.addRemoveClasses(videoCardBody, 'card-body');
        const video = document.createElement('video');
        browserUtil.addRemoveClasses(video, 'video');

        videoCard.appendChild(videoCardTitle);
        videoCard.appendChild(videoCardBody);
        videoCardBody.appendChild(video);

        if (isCurrentUser) {
            const videoCardFooter = document.createElement('div');
            browserUtil.addRemoveClasses(videoCardFooter, 'card-footer');
            videoCardFooter.innerHTML = `<div class="d-flex w-100 justify-content-between mt-2"><button type=""button id="stopVideo" class="btn btn-circle btn-primary"><i class="fas fa-video-slash"></i></button><button type="button" id="muteButton" class="btn btn-circle btn-primary"><i class="fa fa-microphone"></i></button></div>`;
            videoCard.appendChild(videoCardFooter);
        }


        video.srcObject = stream;
        video.addEventListener("loadedmetadata", () => {
            video.play();
            if (this.webrtcDiv) this.webrtcDiv.append(videoCard);
        });
    };

    public callUser(userId: string) {
        callLogger(`Calling user ${userId}`);
        if (this.myVideoStream) {
            const call = this.peer.call(userId, this.myVideoStream);
            call.on('stream', (userVideoStream: any) => {
                callLogger(`User ${userId} answered, showing stream`);
                this.addVideoStream(userId, userVideoStream, false);
            });
        }
    };

    public removeUser(userId:string) {
        const userVideoCard = document.getElementById(userId);
        if (userVideoCard) {
            browserUtil.removeAllChildren(userVideoCard);
            // remove from parent
        }
    }

    prepareToAnswerCallFrom(userId: string) {
        if (controller.isLoggedIn()) {
            callLogger(`Preparing to answer call from ${userId}`);
            if (navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: true,
                }).then((stream) => {
                    this.myVideoStream = stream;
                    this.addVideoStream(controller.getLoggedInUsername(), this.myVideoStream, true);
                    callLogger(`Awaiting call from ${userId}`);
                    this.peer.on('call', (call: any) => {
                        callLogger(`Answering call from ${userId}`);
                        call.answer(this.myVideoStream);
                        call.on('stream', (userVideoStream: any) => {
                            callLogger(`Have answered, showing stream`);
                            this.addVideoStream(userId, userVideoStream, false);
                        });
                    });
                });
            }
        }

    }




}