import React, { Component } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";

import {
  App,
  Panel,
  View,
  Page, Row, Block, Col, Button, Navbar, Link
} from 'framework7-react';
import ModelStore from "../stores/ModelStore";
import * as MyActions from "../actions/MyActions";
import { messaging } from "../init-fcm.js";
import 'framework7-icons';
import { conf } from "../conf";
import Janus from "../janus.js";
import PanelRightPage from "../containers/layouts/PanelRightPage";
import RoomShow from "../containers/rooms/show";
import Right from "./right";
import routes from '../routes';
import {
  sessionCreate, addParticipant, exisitingParticipant, registerUsername
} from "./janus-tools.js"
const client = new W3CWebSocket('ws://127.0.0.1:8080');

export default class extends React.Component {
  constructor() {
    super();
    this.setParticipants = this.setParticipants.bind(this);
    this.sessionCreate = sessionCreate.bind(this);
    this.registerUsername = registerUsername.bind(this);
    //this.pageAfterIn = this.pageAfterIn.bind(this);
    //this.streamAttacher = this.streamAttacher.bind(this);
    //this.streamDettacher = this.streamDettacher.bind(this);
    //this.unmute = this.unmute.bind(this);
    //this.getInstance = this.getInstance.bind(this);
    //this.setInstance = this.setInstance.bind(this);
    this.addParticipant = addParticipant.bind(this);
    //this.removeParticipant = this.removeParticipant.bind(this);
    this.exisitingParticipant = exisitingParticipant.bind(this);
    this.getJsonFromUrl = this.getJsonFromUrl.bind(this);
    this.wsSend = this.wsSend.bind(this);

    this.state = {
      participants: [],
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
      fullname: null,
      userUUID: null,
      line: null,
      currentTab: null,
      currentPoint: null
    };
  }
  /*
  async componentDidMount() {
    const self = this;      
    const app = self.$f7;

    if (messaging) {
      messaging.requestPermission()
        .then(async function () {
          const token = await messaging.getToken();
          var data = { token: token }
          if (self.state.token && self.state.token.length > 10) {
            MyActions.setInstance('devices', data, self.state.token);
          }
        })
        .catch(function (err) {
          console.log("Unable to get permission to notify.", err);
        });
    }
    navigator.serviceWorker.addEventListener("message", (message) => {

      app.notification.create({
        icon: '',

        title: message.data.firebaseMessaging.payload.notification.title,
        titleRightText: '',
        cssClass: 'notification',
        subtitle: message.data.firebaseMessaging.payload.notification.body,
        closeTimeout: 5000,
      }).open();
    });


  }*/
  // Framework7 parameters here
  setParticipants() {

  }

  wsSend(msg) {
   // console.log(msg)
    client.send(JSON.stringify(msg))
  }

  componentDidMount() {
    var self = this;
    //self.sessionCreate();
    const app = this.$f7;
    console.log('this', this.getJsonFromUrl(this.$f7.view[0].history[0]))

  }

  componentWillMount() {
    var self = this;
    client.onopen = () => {
      console.log('$$$$$$$$$$$ -> WebSocket Client Connected');
      client.send(JSON.stringify({ type: 'room', id: this.state.roomId }));
    };
    client.onmessage = (message) => {
   //  console.log(message);
     var parsed = {}
      if(message.data && message.data.length > 0){
        parsed = JSON.parse(message.data)
      }

      switch(parsed.type) {
        case 'point':
          self.setState({ currentPoint: parsed.c })
          break;
        case 'line':
          self.setState({ line: parsed.c })
          break;
        case 'tab':
           self.setState({ currentTab: parsed.current })
          break;
      }

    };

  }

  getJsonFromUrl(url) {
    if (!url || !url.split("?") || !url.split("?")[1]) return [];
    var query = url.split("?")[1];
    var result = {};
    query.split("&").forEach(function (part) {
      var item = part.split("=");
      result[item[0]] = decodeURIComponent(item[1]);
    });
    return result;
  }


  render() {
    const f7params = {
      id: 'io.framework7.testapp', // App bundle ID
      name: 'Framework7', // App name
      theme: 'aurora', // Automatic theme detection
      panel: {
        rightBreakpoint: 960,
      },
      view: {
        //ignoreCache: true,
        //reloadCurrent: true
      },
      // App routes
      routes,
    };

    const {
      line,
      currentTab,
      currentPoint
    } = this.state;

    return (
      <App params={f7params}>
        <Panel resizable left cover>
          <View>
            <Page>
              <Block>Left panel content</Block>
            </Page>
          </View>
        </Panel>
        <Panel resizable right themeDark>
          <View>
            <Right
              participants={this.state.participants}
            />
          </View>
        </Panel>
        <View id="main-view" url="" pushState={true} main className="safe-areas">
          <RoomShow
            setParticipants={this.participants}
            wsSend={this.wsSend}
            line={line}
            currentTab={currentTab}
            currentPoint={currentPoint}
          />
        </View>
      </App>
    );
  }
};
