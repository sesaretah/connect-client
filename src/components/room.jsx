import React from "react";
import ModelStore from "../stores/ModelStore";
import * as MyActions from "../actions/MyActions";
import {  Panel, View} from 'framework7-react';


import $ from 'jquery';
import { dict } from "../Dict";
import { conf } from "../conf";
import Janus from "../janus.js";
import RoomShow from "../containers/rooms/show";
import { 
    sessionCreate, addParticipant, exisitingParticipant, registerUsername
   } from "./janus-tools.js"

//import {newRemoteFeed} from "./newRemoteFeed.js"

export default class Layout extends React.Component {
    constructor() {
        super();

        //.sessionCreate = sessionCreate.bind(this);
        //this.registerUsername = registerUsername.bind(this);
        //this.pageAfterIn = this.pageAfterIn.bind(this);
        //this.streamAttacher = this.streamAttacher.bind(this);
        //this.streamDettacher = this.streamDettacher.bind(this);
        //this.unmute = this.unmute.bind(this);
        //this.getInstance = this.getInstance.bind(this);
        //this.setInstance = this.setInstance.bind(this);
        //this.addParticipant = addParticipant.bind(this);
        //this.removeParticipant = this.removeParticipant.bind(this);
        //this.exisitingParticipant = exisitingParticipant.bind(this);
        //this.findParticpantByUuid = this.findParticpantByUuid.bind(this);
        //this.participantIndex = this.participantIndex.bind(this);
        //this.findParticpantById = this.findParticpantById.bind(this);
        //this.findFeedByRfid = this.findFeedByRfid.bind(this);
        //this.findFeedById = this.findFeedById.bind(this);



        this.state = {
            /*
            token: window.localStorage.getItem("token"),
            shortners: null,
            server: conf.janusServer,
            janus: null,
            sfutest: null,
            opaqueId: "videoroomtest-" + Janus.randomString(12),
            roomId: 1234,
            webrtcUp: null,
            myusername: null,
            mixertest: null,
            myid: null,
            mystream: null,
            pin: null,
            userUUID: null,
            fullname: null,
            isOwner: false,
            muted: true,
            participants: [],
            room: null,
            notification: {},
            chats: [],
            panelOpen: false,*/
        };
    }
    componentWillMount() {
        ModelStore.on("got_instance", this.getInstance);
        ModelStore.on("set_instance", this.setInstance);
    }

    componentWillUnmount() {
        ModelStore.removeListener("got_instance", this.getInstance);
        ModelStore.removeListener("set_instance", this.setInstance);
        window.removeEventListener("beforeunload", this.unPublishData);
    }

    componentDidMount() {
        MyActions.getInstance('rooms', 1, this.state.token);
        window.addEventListener("beforeunload", this.unPublishData);
        if(window.innerWidth > 960) {
            this.setState({panelOpen: true})
            console.log('>960')
        }


    }

    submitParticipation(activity) {
        var data = { room_id: this.state.id, activity: activity }
        MyActions.setInstance('participations', data, this.state.token);
    }




    getInstance() {
        var room = ModelStore.getIntance()
        var klass = ModelStore.getKlass()
        if (room && klass === 'Room') {
            this.setState({
                room: room,
                id: room.id,
                roomId: room.room_id,
                pin: room.pin,
                //userUUID: room.user_uuid,
                fullname: room.user_fullname,
                title: room.title,
                isOwner: room.is_owner
            }, () => this.submitParticipation('joined'));
        }
        console.log(room)
    }

    pageAfterIn() {
        var self = this;
        self.sessionCreate();
    }

    setInstance() {
        var participation = ModelStore.getIntance()
        var klass = ModelStore.getKlass()
        if (participation && klass === 'Participation') {
            this.setState({
                userUUID: participation.uuid,
            }, () => this.pageAfterIn());
        }
        console.log(participation)
    }


    render() {
        const {
            token,
            shortners,
            urls,
            publishedMicrophone,
            publishedCamera,
            publishedDesktop,
            feeds,
            muted,
            lowFeeds,
            requests,
            participants,
            room,
            notification,
            chats,
            isOwner,
            roomId,
            panelOpen
        } = this.state;
        return (
            <React.Fragment>

            <RoomShow participants={participants} panelOpen={panelOpen}
            />
            </React.Fragment>
        );
    }
}