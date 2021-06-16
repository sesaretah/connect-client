import React, { Component } from 'react';
import { render } from 'react-dom';
import { Page, Navbar, List, BlockTitle, Card, Fab, Icon, Preloader, Block, CardContent, CardHeader, CardFooter, Button } from 'framework7-react';
import { dict } from '../../Dict';
import { Client, LocalStream, RemoteStream } from 'ion-sdk-js';
import { IonSFUJSONRPCSignal } from 'ion-sdk-js/lib/signal/json-rpc-impl';
import { conf } from "../../conf";

class Screen extends Component {
    constructor(props) {
        super(props);

        this.start = this.start.bind(this)
        this.videos = this.videos.bind(this)
        this.unPublish = this.unPublish.bind(this)
        this.publishBtn = this.publishBtn.bind(this)

        this.state = {
            signal: null,
            config: null,
            clientLocal: null,
            streams: [],
            media: null,

        }
    }

    componentDidUpdate(prevProps) {

    }

    componentDidMount() {
        var config = {
            iceServers: [
                {
                    urls: "stun:stun.l.google.com:19302",
                },
            ],
        };


        var signal = new IonSFUJSONRPCSignal(conf.ionSignalServer);

        this.setState({ config: config, signal: signal }, () => {
            var clientLocal = new Client(this.state.signal, this.state.config)
            this.setState({ clientLocal: clientLocal }, () => {
                this.state.signal.onopen = () => this.state.clientLocal.join("test session");
                this.state.clientLocal.ontrack = (track, stream) => {
                    console.log("got track", track.id, "for stream", stream.id);
                    if (track.kind === "video") {
                        track.onunmute = () => {
                            this.setState({ streams: this.state.streams.concat(stream) })
                            stream.onremovetrack = () => {
                                console.log('Stream owner left')
                                this.setState({ streams: this.state.streams.filter((item) => item.id !== stream.id) })
                                this.$$('#remotes').remove();
                                this.$$('#screen').append("<div id='remotes'></div>");
                            };
                        };
                    }
                };
            })

        })
    }

    start() {
        var self = this;
        LocalStream.getDisplayMedia({
            resolution: "vga",
            audio: false,
        })
            .then((media) => {
                console.log(media)
                this.setState({ media: media })
                var localVideo = document.createElement("video");
                localVideo.srcObject = media;
                localVideo.autoplay = true;
                localVideo.muted = true;
                localVideo.width = this.$$('#screen').width() - 20;
                this.state.clientLocal.publish(media);
                this.$$('#remotes').append(localVideo);
                media.getVideoTracks()[0].onended = function () {
                    self.unPublish()
                };
            })
            .catch(console.error);
    };

    videos() {
        var result = []
        if (this.state.streams) {
            this.state.streams.map((stream) => {
                if (this.$$('#' + stream.id).length == 0) {
                    var remoteVideo = document.createElement("video");
                    remoteVideo.srcObject = stream;
                    remoteVideo.autoplay = true;
                    remoteVideo.muted = true;
                    remoteVideo.width = this.$$('#screen').width() - 20;
                    this.$$('#remotes').append(remoteVideo);
                }
            })

            return (result)
        }
    }

    unPublish() {
        this.state.media.unpublish();
        this.state.media.getTracks().forEach(track => track.stop());
        this.$$('#remotes').remove(this.state.media.id);
        this.$$('#screen').append("<div id='remotes'></div>");
        this.setState({ media: null })
    }

    publishBtn() {
        if (!this.state.media) {
            return (
                <Button fill onClick={() => this.start()}>
                    <div style={{ float: 'right', paddingTop: '5px' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M21 12v3a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-10a1 1 0 0 1 1 -1h9" /><line x1="7" y1="20" x2="17" y2="20" /><line x1="9" y1="16" x2="9" y2="20" /><line x1="15" y1="16" x2="15" y2="20" /><path d="M17 4h4v4" /><path d="M16 9l5 -5" /></svg>
                    </div>
                    <div style={{ marginTop: '0px', width: '70px' }}>{dict.share}</div>
                </Button>
            )
        } else {
            return (
                <Button onClick={() => this.unPublish()}>
                    <div style={{ float: 'right', paddingTop: '5px' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M21 12v3a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-10a1 1 0 0 1 1 -1h9" /><line x1="7" y1="20" x2="17" y2="20" /><line x1="9" y1="16" x2="9" y2="20" /><line x1="15" y1="16" x2="15" y2="20" /><path d="M17 8l4 -4m-4 0l4 4" /></svg>
                    </div>
                    <div style={{ marginTop: '0px', width: '90px' }}>{dict.unshare}</div>
                </Button>
            )
        }
    }

    render() {
        return (
            <Card>
                <CardHeader>
                    {this.publishBtn()}
                </CardHeader>
                <CardContent id='screen'>
                    {this.videos()}
                    <div id="remotes"></div>
                </CardContent>
            </Card>
        );
    }
}
export default Screen;