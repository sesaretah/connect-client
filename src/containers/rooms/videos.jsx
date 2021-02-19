import React, { Component } from 'react';
import { render } from 'react-dom';
import { Page, Navbar, List, BlockTitle, Card, Fab, Icon, Preloader, Block, CardContent, CardHeader, CardFooter, Button } from 'framework7-react';
import { dict } from '../../Dict';
import { Client, LocalStream, RemoteStream } from 'ion-sdk-js';
import { IonSFUJSONRPCSignal } from 'ion-sdk-js/lib/signal/json-rpc-impl';
import { scaleDiverging, schemeBuPu } from 'd3';

class Videos extends Component {
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


        var signal = new IonSFUJSONRPCSignal("ws://172.104.246.151:7000/ws");

        this.setState({ config: config, signal: signal }, () => {
            var clientLocal = new Client(this.state.signal, this.state.config)
            this.setState({ clientLocal: clientLocal }, () => {
                this.state.signal.onopen = () => this.state.clientLocal.join("test videos");
                this.state.clientLocal.ontrack = (track, stream) => {
                    console.log("got track", track.id, "for stream", stream.id);
                    if (track.kind === "video") {
                        track.onunmute = () => {
                            var exists = this.state.streams.filter((item) => item.id === stream.id)
                            if (exists.length == 0) {
                                this.setState({ streams: this.state.streams.concat(stream) }, () => {
                                    console.log('Streams are ...', this.state.streams)
                                })
                            }

                            stream.onremovetrack = () => {
                                console.log('Stream owner left')
                                this.setState({ streams: this.state.streams.filter((item) => item.id !== stream.id) })
                                this.$$('#remoteVideos').remove();
                                this.$$('#videos').append("<div id='remoteVideos'></div>");
                            };
                        };
                    }
                };
            })

        })
    }

    start() {
        var self = this;
        LocalStream.getUserMedia({
            resolution: "vga",
            video: true,
            audio: false,
        })
            .then((media) => {
                this.setState({ media: media })
                var localVideo = document.createElement("video");
                localVideo.srcObject = media;
                localVideo.autoplay = true;
                localVideo.muted = true;
                localVideo.width = '280';
                this.state.clientLocal.publish(media);
                this.$$('#remoteVideos').append(localVideo);
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
                console.log('Attaching to stream ...', stream)

                if (this.$$('#' + stream.id).length == 0) {
                    var remoteVideo = document.createElement("video");
                    remoteVideo.srcObject = stream;
                    remoteVideo.autoplay = true;
                    remoteVideo.muted = true;
                    remoteVideo.width = '280';
                    remoteVideo.id = stream.id;
                    this.$$('#remoteVideos').append(remoteVideo);
                }

            })

            return (result)
        }
    }

    unPublish() {
        this.state.media.unpublish();
        this.state.media.getTracks().forEach(track => track.stop());
        this.$$('#remoteVideos').remove(this.state.media.id);
        this.$$('#videos').append("<div id='remoteVideos'></div>");
        this.setState({ media: null })
    }

    publishBtn() {
        if (!this.state.media) {
            return (
                <Button fill onClick={() => this.start()}>
                    <div style={{ float: 'right', paddingTop: '5px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 10l4.553 -2.276a1 1 0 0 1 1.447 .894v6.764a1 1 0 0 1 -1.447 .894l-4.553 -2.276v-4z" /><rect x="3" y="6" width="12" height="12" rx="2" /><line x1="7" y1="12" x2="11" y2="12" /><line x1="9" y1="10" x2="9" y2="14" /></svg>
                    </div>
                    <div style={{ marginTop: '0px', width: '90px' }}>{dict.start_camera}</div>
                </Button>
            )
        } else {
            return (
                <Button onClick={() => this.unPublish()}>
                    <div style={{ float: 'right', paddingTop: '5px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><line x1="3" y1="3" x2="21" y2="21" /><path d="M15 11v-1l4.553 -2.276a1 1 0 0 1 1.447 .894v6.764a1 1 0 0 1 -.675 .946" /><path d="M10 6h3a2 2 0 0 1 2 2v3m0 4v1a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2v-8a2 2 0 0 1 2 -2h1" /></svg>
                    </div>
                    <div style={{ marginTop: '0px', width: '93px' }}>{dict.end_camera}</div>
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
                <CardContent id='videos'>
                    {this.videos()}
                    <div id="remoteVideos"></div>
                </CardContent>
            </Card>
        );
    }
}
export default Videos;