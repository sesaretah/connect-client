import React, { Component } from 'react';
import { render } from 'react-dom';
import { Page, Navbar, List, BlockTitle, Card, Fab, Icon, Preloader, Block, CardContent, CardHeader, CardFooter, Button } from 'framework7-react';
import { dict } from '../../Dict';
import { Client, LocalStream, RemoteStream } from 'ion-sdk-js';
import { IonSFUJSONRPCSignal } from 'ion-sdk-js/lib/signal/json-rpc-impl';

class Saved extends Component {
    constructor(props) {
        super(props);
        this.getVideos = this.getVideos.bind(this)
        this.videos = this.videos.bind(this)

        this.state = {
            videos: []
        }
    }

    componentDidUpdate(prevProps) {

    }

    componentDidMount() {
        this.getVideos()



    }

    async getVideos() {
        this.setState({
            videos: []
        })
        var videos =  await window.db.videos
        .toArray();
        console.log('Saved videos....', videos)
        this.setState({
            videos: videos
        })
    }

    videos(){
        var self = this;
        if(this.state.videos){
            this.state.videos.map((video) => {
                if (video.blob.size !== 0 && this.$$('#saved-' + video.id).length == 0){
                    var url = URL.createObjectURL(video.blob);
                    var vid = document.createElement('video');
                    //vid.srcObject = video.blob
                    vid.width = 320
                    vid.src = url
                    vid.type = "video/webm";
                    vid.id = 'saved-' + video.id
                    vid.controls = true;
                    console.log(vid)
                    self.$$('#saved-videos').append(vid);
                }

            })

        }
    }




    render() {
        return (
            <Card>
                <CardHeader>
                </CardHeader>
                <CardContent id='saved-videos'>
                    {this.videos()}
                </CardContent>
            </Card>
        );
    }
}
export default Saved;