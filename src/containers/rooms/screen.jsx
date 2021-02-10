import React, { Component } from 'react';
import { render } from 'react-dom';
import { Page, Navbar, List, BlockTitle, Card, Fab, Icon, Preloader, Block, CardContent, CardHeader, CardFooter } from 'framework7-react';
import { dict } from '../../Dict';
import { Client, LocalStream, RemoteStream } from 'ion-sdk-js';
import { IonSFUJSONRPCSignal } from 'ion-sdk-js/lib/signal/json-rpc-impl';

class Screen extends Component {
    constructor(props) {
        super(props);

        this.start = this.start.bind(this)

        this.state = {
            signal: null,
            config: null,
            clientLocal: null,
            streams: {}

        }
    }

    componentDidUpdate(prevProps) {

    }




    componentDidMount() {
        const localVideo = document.getElementById("local-video");
        const remotesDiv = document.getElementById("remotes");

        /* eslint-env browser */
        const joinBtns = document.getElementById("start-btns");
        var config = {
            iceServers: [
                {
                    urls: "stun:stun.l.google.com:19302",
                },
            ],
        };


        var signal = new IonSFUJSONRPCSignal( "ws://localhost:7000/ws");

        this.setState({ config: config, signal: signal }, () => {
            var clientLocal = new Client(this.state.signal, this.state.config)
            this.setState({ clientLocal: clientLocal }, () => {
                this.state.signal.onopen = () => this.state.clientLocal.join("test session");
                this.state.clientLocal.ontrack = (track, stream) => {
                    console.log("got track", track.id, "for stream", stream.id);
                    if (track.kind === "video") {
                        track.onunmute = () => {
                            if (!streams[stream.id]) {
                                console.log(stream)
                                /*
                                var remoteVideo = document.createElement("video");
                                remoteVideo.srcObject = stream;
                                remoteVideo.autoplay = true;
                                remoteVideo.muted = true;
        
                                remotesDiv.appendChild(remoteVideo);
                                */
                                stream.onremovetrack = () => {
                                    //    remotesDiv.removeChild(remoteVideo);
                                    //    streams[stream.id] = null;
                                };
                            }
                        };
                    }
                };
            })

        })






        const streams = {};





    }

    start() {
        console.log('start clicked')
        let localStream;
        LocalStream.getUserMedia({
            resolution: "vga",
            audio: false,
        })
            .then((media) => {
                console.log(media)
                //  localStream = media;
                //   localVideo.srcObject = media;
                //  localVideo.autoplay = true;
                //  localVideo.controls = true;
                //  localVideo.muted = true;
                //joinBtns.style.display = "none";
                this.state.clientLocal.publish(media);
            })
            .catch(console.error);
    };




    render() {
        return (
            <Card>
                <CardHeader>
                </CardHeader>
                <CardContent >
                    <video
                        id="local-video"
                        width="320"
                        height="240"
                    ></video>
                    <div id="remotes" class="col-6 pt-2"></div>
                </CardContent>
                <CardFooter className='editor-footer'>
                    <button  onClick={() => this.start()} >start</button>
                </CardFooter>
            </Card>
        );
    }
}
export default Screen;