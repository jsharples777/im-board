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
    private currentUserList:string[];
    
    private constructor() {
        this.callUser = this.callUser.bind(this);
        this.currentUserList = [];
    }
    
    public initialise(applicationView:any) {
        if (controller.isLoggedIn()) {
            // @ts-ignore  - is for the WebRTC peer via Nodejs
            this.peer = new Peer(controller.getLoggedInUsername(), {path: '/peerjs', host: '/', });//port: '3000'});
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
        this.currentUserList = [];
    }

    private addVideoStream(username: string, stream: MediaStream, isCurrentUser = false) {
        // check to see if they are already there
        let index = this.currentUserList.findIndex((user) => user === username);
        if (index >= 0) return;

        this.currentUserList.push(username);

        const videoCardHolder = document.createElement('div');
        videoCardHolder.setAttribute("id", username);
        browserUtil.addRemoveClasses(videoCardHolder, 'col-sm-12 col-md-4 col-lg-3');
        const videoCard = document.createElement('div');
        browserUtil.addRemoveClasses(videoCard,'card');
        const videoCardTitle = document.createElement('div');
        browserUtil.addRemoveClasses(videoCardTitle, 'card-header');
        videoCardTitle.innerHTML = `<h5 class="card-title">${username}</h5>`;
        const videoCardBody = document.createElement('div');
        browserUtil.addRemoveClasses(videoCardBody, 'card-body p-0');
        const video = document.createElement('video');
        browserUtil.addRemoveClasses(video, 'video');

        videoCard.appendChild(videoCardTitle);
        videoCard.appendChild(videoCardBody);
        videoCardBody.appendChild(video);

        if (isCurrentUser) {
            const videoCardFooter = document.createElement('div');
            browserUtil.addRemoveClasses(videoCardFooter, 'card-footer');
            const footerContent = document.createElement('div');
            browserUtil.addRemoveClasses(footerContent,'d-flex w-100 justify-content-between mt-2');
            const stopVideoButton = document.createElement('button');
            stopVideoButton.setAttribute('type','button');
            browserUtil.addRemoveClasses(stopVideoButton,'btn btn-circle btn-warning');
            stopVideoButton.innerHTML = '<i class="fas fa-video-slash"></i>';
            const muteMicButton = document.createElement('button');
            muteMicButton.setAttribute('type','button');
            browserUtil.addRemoveClasses(muteMicButton,'btn btn-circle btn-warning');
            muteMicButton.innerHTML = '<i class="fa fa-microphone"></i>';

            footerContent.appendChild(stopVideoButton);
            footerContent.appendChild(muteMicButton);

            videoCardFooter.appendChild(footerContent);

            videoCard.appendChild(videoCardFooter);

            stopVideoButton.addEventListener('click',() => {
                const isPaused = video.paused;
                if (isPaused) {
                    video.play();
                    browserUtil.addRemoveClasses(stopVideoButton,'btn-success',false);
                    browserUtil.addRemoveClasses(stopVideoButton,'btn-warning',true);

                }
                else {
                    video.pause();
                    browserUtil.addRemoveClasses(stopVideoButton,'btn-success',true);
                    browserUtil.addRemoveClasses(stopVideoButton,'btn-warning',false);
                }

            });
            muteMicButton.addEventListener('click',() => {
                const isMuted = video.muted;
                if (isMuted) {
                    video.muted = false;
                    browserUtil.addRemoveClasses(muteMicButton,'btn-success',false);
                    browserUtil.addRemoveClasses(muteMicButton,'btn-warning',true);

                }
                else {
                    video.muted = true;
                    browserUtil.addRemoveClasses(muteMicButton,'btn-success',true);
                    browserUtil.addRemoveClasses(muteMicButton,'btn-warning',false);
                }

            });
        }

        videoCardHolder.appendChild(videoCard);
        video.srcObject = stream;
        video.addEventListener("loadedmetadata", () => {
            video.play();
            if (this.webrtcDiv) this.webrtcDiv.append(videoCardHolder);
        });
    };

    public callUser(userId: string) {
        // wait a small time for the sockets and peer to sync
        const interval = setTimeout(() => {
            callLogger(`Calling user ${userId}`);
            if (this.myVideoStream) {
                const call = this.peer.call(userId, this.myVideoStream);
                call.on('stream', (userVideoStream: any) => {
                    callLogger(`User ${userId} answered, showing stream`);
                    this.addVideoStream(userId, userVideoStream, false);
                });
            }
        },5000);


    };

    public removeUser(userId:string) {
        let index = this.currentUserList.findIndex((user) => user === userId);
        if (index >= 0) {
            this.currentUserList.splice(index,1);
        }
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