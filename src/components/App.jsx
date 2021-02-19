import React, { Component } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import RecordRTC from 'recordrtc'
import {
  App,
  Panel,
  View,
  Page, Row, Block,
  LoginScreen,
  LoginScreenTitle,
  List,
  ListInput,
  BlockFooter,
  ListButton,
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
import Left from "./left"
import routes from '../routes';
import axios, { put } from 'axios';
import randomColor from 'randomcolor';

import {
  sessionCreate, addParticipant, exisitingParticipant, registerUsername, toggleMute
} from "./janus-tools.js"
import { dict } from '../Dict';
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
    this.toggleMute = toggleMute.bind(this);
    this.getJsonFromUrl = this.getJsonFromUrl.bind(this);
    this.wsSend = this.wsSend.bind(this);

    this.handleChangeValue = this.handleChangeValue.bind(this);
    this.login = this.login.bind(this);
    this.setInstance = this.setInstance.bind(this);
    this.newComerReset = this.newComerReset.bind(this);
    this.toggleMicrophone = this.toggleMicrophone.bind(this);

    this.uploader = this.uploader.bind(this);
    this.getInstance = this.getInstance.bind(this);
    this.recentUpload = this.recentUpload.bind(this);
    this.revertUndo = this.revertUndo.bind(this);
    this.revertTrash = this.revertTrash.bind(this);
    this.uploadedRecentlyReset = this.uploadedRecentlyReset.bind(this)


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
      currentPoint: null,
      quillDelta: null,
      cursorRange: null,
      newCursor: null,
      client: null,
      clients: [],
      typing: null,
      loginScreenOpened: true,
      username: '',
      pass: '',
      name: null,
      newComerLength: null,
      contentSync: null,
      wsConnected: false,
      muted: true,
      progressShow: false,
      progress: null,
      upload: null,
      page: null,
      undoVector: null,
      trash: false,
      userColor: randomColor({ luminosity: 'dark', hue: 'random', alpha: 0.6 }),
      uploadedRecently: false,
      remoteStream: null,
      localStream: null,
      chats: [],
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

  toggleMicrophone() {
    this.toggleMute()
    this.setState({ muted: !this.state.muted })
  }

  wsSend(msg) {
    if (this.state.wsConnected) {
      client.send(JSON.stringify(msg))
    }
  }

  componentDidMount() {
    var self = this;
    self.sessionCreate();
    MyActions.getInstance('uploads/recent', 1, this.state.token);
    const app = this.$f7;
    console.log('this', this.getJsonFromUrl(this.$f7.view[0].history[0]))
    if (this.state.token && this.state.token.length > 10) {
      MyActions.setInstance('users/validate_token', {}, this.state.token);
      this.setState({ loginScreenOpened: false })
    } else {

    }

  }


  componentWillUnmount() {
    ModelStore.removeListener("set_instance", this.setInstance);
    ModelStore.removeListener("got_instance", this.getInstance);
  }

  newComerReset() {
    this.setState({ newComerLength: null })
  }

  uploadedRecentlyReset() {
    this.setState({ uploadedRecently: false })
  }

  uploader(file) {
    var self = this;
    console.log(file)
    self.setState({ progressShow: true }, () => console.log(this.state.progressShow))
    const config = {
      onUploadProgress: function (progressEvent) {
        var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        console.log(percentCompleted)
        self.setState({ progress: percentCompleted })

      },
      headers: { 'Content-Type': 'application/json', 'Authorization': "bearer " + self.state.token }
    }

    let data = new FormData()
    data.append('upload[attached_document]', file)
    data.append('upload[room_id]', 1)//self.state.room.id)

    axios.post(conf.server + '/uploads', data, config)
      .then(res => {
        self.setState({ progressShow: false, uploadedRecently: true });
        MyActions.getInstance('uploads/recent', 1, this.state.token);
        //self.props.fileUploaded()
      })
      .catch(err => self.setState({ progressShow: false }))
  }

  recentUpload() {
    console.log('recentUpload Called ...')
    this.setState({ progressShow: true });
    MyActions.getInstance('uploads/recent', 1, this.state.token);
  }

  revertUndo() {
    this.setState({ undo: null });
  }

  revertTrash() {
    this.setState({ trash: false });
  }


  componentWillMount() {
    ModelStore.on("set_instance", this.setInstance);
    ModelStore.on("got_instance", this.getInstance);
    var self = this;
    client.onopen = () => {
      //console.log('$$$$$$$$$$$ -> WebSocket Client Connected');
      client.send(JSON.stringify({ type: 'room', id: this.state.roomId }));
      self.setState({ wsConnected: true })
    };
    client.onclose = () => {
      self.setState({ wsConnected: false })
    }
    client.onmessage = (message) => {
      //  console.log(message);
      var parsed = {}
      if (message.data && message.data.length > 0) {
        parsed = JSON.parse(message.data)
      }

      switch (parsed.type) {
        case 'room':
          console.log('client', parsed.c)
          self.setState({ client: parsed.c })
          break;
        case 'chat':
          self.setState({ chats: this.state.chats.concat(parsed.c) })
          break;
        case 'page':
          self.setState({ page: parsed.c })
          break;
        case 'undo':
          self.setState({ undoVector: parsed.c })
          break;
        case 'trash':
          self.setState({ trash: true })
          break;
        case 'newUpload':
          self.recentUpload();
          break;
        case 'contentSync':
          self.setState({ contentSync: parsed.c })
          break;
        case 'newComer':
          console.log('newComer', parsed.c)
          self.setState({ newComerLength: parsed.c })
          break;
        case 'newCursor':
          self.setState({ newCursor: parsed.c })
          break;
        case 'typing':
          self.setState({ typing: parsed.c })
          break;
        case 'point':
          self.setState({ currentPoint: parsed.c })
          break;
        case 'quill':
          self.setState({ quillDelta: parsed.c })
          break;
        case 'cursor':
          self.setState({ cursorRange: parsed.c })
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

  handleChangeValue(obj) {
    this.setState(obj);
  }

  login() {
    this.$$('.btn').hide();
    this.$$('.btn-notice').text(dict.submitting);
    var data = { name: this.state.name, pass: this.state.pass, user: { email: 'test@example.com' } }
    if (this.state.name && this.state.name.length > 0) {
      MyActions.setInstance('users/sign_up', data);
    } else {
      const self = this;
      self.$f7.dialog.alert(dict.incomplete_data, dict.alert);
    }
  }

  setInstance() {
    var self = this;
    var klass = ModelStore.getKlass()
    var user = ModelStore.getIntance();
    if (user && klass === 'SignUp') {
      window.localStorage.setItem('token', user.token);
      //this.$f7router.navigate('/');
      window.location.reload()
    }
    if (klass === 'Validate') {
      console.log('registering name ...')
      this.setState({ name: user.name, fullname: user.name, userUUID: user.uuid }, () => {
        self.sessionCreate();
      })
    }
    console.log(user, klass)

  }

  getInstance() {
    var upload = ModelStore.getIntance()
    var klass = ModelStore.getKlass()
    if (upload && klass === 'Upload') {
      this.setState({
        upload: upload,
      }, () => {
        if (!upload.converted) {
          console.log('Cheking for conversion ...')
          setTimeout(() => this.recentUpload(), 10000);
        } else {
          this.setState({ progressShow: false });
        }
      });

    }
    console.log(upload, klass)
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
      currentPoint,
      quillDelta,
      cursorRange,
      clients,
      client,
      newCursor,
      typing,
      name,
      newComerLength,
      contentSync,
      muted,
      userUUID,
      progress,
      progressShow,
      upload,
      page,
      undoVector,
      trash,
      userColor,
      participants,
      uploadedRecently,
      remoteStream,
      localStream,
      chats,
    } = this.state;

    return (
      <App params={f7params}>
        <Panel resizable left cover>
          <View>
            <Left
              wsSend={this.wsSend}
              chats={chats}
            />
          </View>
        </Panel>
        <Panel resizable right themeDark>
          <View>
            <Right
              participants={participants}
              handleChangeValue={this.handleChangeValue}
              muted={muted}
              userUUID={userUUID}
              toggleMicrophone={this.toggleMicrophone}
              userColor={userColor}
            />
          </View>
        </Panel>
        <View id="main-view" url="" pushState={true} main className="safe-areas">
          <RoomShow
            //setParticipants={this.participants}
            wsSend={this.wsSend}
            line={line}
            currentTab={currentTab}
            currentPoint={currentPoint}
            quillDelta={quillDelta}
            cursorRange={cursorRange}
            client={client}
            typing={typing}
            newCursor={newCursor}
            name={name}
            newComerLength={newComerLength}
            contentSync={contentSync}
            newComerReset={this.newComerReset}
            uploader={this.uploader}
            progress={progress}
            progressShow={progressShow}
            upload={upload}
            recentUpload={this.recentUpload}
            page={page}
            undoVector={undoVector}
            revertUndo={this.revertUndo}
            trash={trash}
            revertTrash={this.revertTrash}
            userColor={userColor}
            participants={participants}
            userUUID={userUUID}
            uploadedRecently={uploadedRecently}
            uploadedRecentlyReset={this.uploadedRecentlyReset}
            remoteStream={remoteStream}
            localStream={localStream}
          />
          <LoginScreen
            className="demo-login-screen"
            opened={this.state.loginScreenOpened}
            onLoginScreenClosed={() => {
              this.handleChangeValue({ loginScreenOpened: false });
            }}
          >
            <Page loginScreen>
              <LoginScreenTitle>{dict.login}</LoginScreenTitle>
              <List form>
                <ListInput
                  label={dict.name}
                  className='fs-14'
                  type="text"
                  placeholder="Your username"
                  value={this.state.name}
                  onInput={(e) => {
                    this.handleChangeValue({ name: e.target.value });
                  }}
                />
                <ListInput
                  label={dict.pass}
                  type="text"
                  className='fs-14'
                  placeholder="Your Pass"
                  value={this.state.pass}
                  onInput={(e) => {
                    this.handleChangeValue({ pass: e.target.value });
                  }}
                />
              </List>
              <List>
                <ListButton onClick={this.login}>Sign In</ListButton>
                <BlockFooter>
                  Some text about login information.
          <br />
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </BlockFooter>
              </List>
            </Page>
          </LoginScreen>
        </View>
      </App>
    );
  }
};
