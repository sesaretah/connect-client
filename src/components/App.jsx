import React, { Component } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import RecordRTC from 'recordrtc'
//import socketClient  from "socket.io-client";
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
  Button
} from 'framework7-react';
import ModelStore from "../stores/ModelStore";
import * as MyActions from "../actions/MyActions";
import { messaging } from "../init-fcm.js";
import 'framework7-icons';
import { conf } from "../conf";
import Janus from "../janus.js";
import PanelRightPage from "../containers/layouts/PanelRightPage";
import RoomShow from "../containers/rooms/show";
import LoadedPage from "../containers/rooms/page";
import Right from "./right";
import Left from "./left"
import Login from "./login"
import routes from '../routes';
import axios, { put } from 'axios';
import randomColor from 'randomcolor';

import {
  sessionCreate, addParticipant, exisitingParticipant, registerUsername,
  toggleMute, exitAudioRoom, removeParticipant, participantChangeStatus,
  participantDisplay
} from "./janus-tools.js";

import {
  ionSessionCreate, ionStart, ionVideos, ionUnPublish, ionPublishBtn, ionDisplay,
  screenSessionCreate, screenStart, screenVideos, screenUnPublish, screenPublishBtn,
} from "./ion-tools.js";

import { socket } from './socket.js'

import { dict } from '../Dict';


const client = new W3CWebSocket(conf.socketServer);


//const io = socketClient(conf.socketIOServer);

export default class extends React.Component {
  constructor() {
    super();
    this.setParticipants = this.setParticipants.bind(this);
    this.sessionCreate = sessionCreate.bind(this);
    this.registerUsername = registerUsername.bind(this);
    this.participantChangeStatus = participantChangeStatus.bind(this);
    this.participantDisplay = participantDisplay.bind(this);

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

    this.ionSessionCreate = ionSessionCreate.bind(this);
    this.ionStart = ionStart.bind(this);
    this.ionVideos = ionVideos.bind(this);
    this.ionUnPublish = ionUnPublish.bind(this);
    this.ionPublishBtn = ionPublishBtn.bind(this);
    this.ionDisplay = ionDisplay.bind(this);

    this.screenSessionCreate = screenSessionCreate.bind(this);
    this.screenStart = screenStart.bind(this);
    this.screenVideos = screenVideos.bind(this);
    this.screenUnPublish = screenUnPublish.bind(this);
    this.screenPublishBtn = screenPublishBtn.bind(this);

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
    this.exitAudioRoom = exitAudioRoom.bind(this);
    this.removeParticipant = removeParticipant.bind(this);

    this.uploadedRecentlyReset = this.uploadedRecentlyReset.bind(this)
    this.extractAction = this.extractAction.bind(this)
    this.logout = this.logout.bind(this)
    this.signUp = this.signUp.bind(this)

    this.scrollTo = this.scrollTo.bind(this)

    this.appendChat = this.appendChat.bind(this)
    this.chatDeactive = this.chatDeactive.bind(this)


    this.appendLink = this.appendLink.bind(this)
    this.socketHandle = this.socketHandle.bind(this)
    this.togglePresenter = this.togglePresenter.bind(this)

    this.ionRequestRoom = this.ionRequestRoom.bind(this)


    this.state = {
      participants: [],
      token: window.localStorage.getItem("token"),
      shortners: null,
      server: conf.janusServer,
      janus: null,
      sfutest: null,
      opaqueId: "videoroomtest-" + Janus.randomString(12),
      roomId: 1187894,
      pin: 'c13eab83262202c2840a',
      myId: null,
      isAdmin: false,
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
      action: null,
      signingUp: false,
      email: null,
      password: null,
      passwordConfirmation: null,
      // ion states
      signal: null,
      config: null,
      clientLocal: null,
      streams: [],
      media: null,
      display: 1,
      ionActive: false,
      //

      screenSignal: null,
      screenConfig: null,
      screenClientLocal: null,
      screenStreams: [],
      screenMedia: null,
      screenActive: false,
      //
      chatActive: false,
      //
      srcLink: null,
      converterCounter: 0,

      presenters: [],
      isPresenter: false,
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
    var self = this;
    this.setState({ muted: !this.state.muted }, () => { self.toggleMute() })
  }

  togglePresenter(uuid) {
    var self = this;
    console.log('presenter', uuid)
    socket.emit('presenter', { uuid: uuid });
    this.setState({ presenters: self.state.presenters.concat(uuid) })
  }

  wsSend(msg) {
    msg['room'] = this.state.roomId
    msg['sender'] = this.state.userUUID
    socket.emit('message', msg);
  }

  componentDidMount() {
    var self = this;
    //self.sessionCreate();
    MyActions.getInstance('uploads/recent', 1, this.state.token);
    const app = this.$f7;
    console.log('this $$$$$$$', this.getJsonFromUrl(this.$f7.view[0].history[0]))
    this.extractAction();
    MyActions.getInstance('rooms/last', 1, this.state.token);


    if (this.state.token && this.state.token.length > 10) {
      MyActions.setInstance('users/validate_token', {}, this.state.token);
      this.setState({ loginScreenOpened: false })
    } else {

    }

    //self.ionSessionCreate();
    self.screenSessionCreate();

    socket.on('connect', function () {
      // socket.emit('room', room);
    });

    socket.on('message', function (data) {
      self.socketHandle(data)
      console.log(data)
    });
    socket.on('ionSlot', function (data) {
      self.ionSessionCreate(data['slot'][0]);
      //console.log('>>>>>', data['slot'][0])
    })
  }

  ionRequestRoom(){
    
    socket.emit('ionReqSlot', {uuid: this.state.userUUID});
    console.log('ionReqSlot')

  }

  extractAction() {
    var params = this.getJsonFromUrl(this.$f7.view[0].history[0])
    if (params && params.action) {
      this.setState({ action: params.action })
    } else {
      this.setState({ action: 'room' })
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

  logout() {
    this.setState({ token: null });
    this.exitAudioRoom();
    setTimeout(() => {
      window.localStorage.removeItem('token');
      window.location.replace('/')
    }, 1000);

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

  scrollTo(el) {
    const pos = this.$$(el).offset()
    //console.log(this.$$('#screen').offset())
    //console.log(this.$$('#main-page').offset())
    this.$$('.page-content').scrollTop(pos.top, 350)
    console.log('>>>>>>>', pos)
  }

  appendChat(c) {
    console.log(c)
    var exist = this.state.chats.filter((item) => item.uuid === c.uuid)
    if(!exist){
      if (this.state.chats && this.state.chats.length > 50) {
        this.setState({ chats: this.state.chats.slice(1).concat(c) })
      } else {
        this.setState({ chats: this.state.chats.concat(c) })
      }
      if (!this.state.chatActive) {
        this.setState({ chatActive: true })
      }
    }   

  }

  chatDeactive() {
    this.setState({ chatActive: false })
  }

  appendLink(l) {
    this.setState({ srcLink: l })
  }



  componentWillMount() {
    ModelStore.on("set_instance", this.setInstance);
    ModelStore.on("got_instance", this.getInstance);
    //this.maintainWS()
  }

  socketHandle(msg) {

    var self = this;
    if (msg['sender'] === self.state.userUUID) {
      return
    }
    var parsed = msg
    switch (parsed.type) {
      case 'room':
        console.log('client', parsed.c)
        self.setState({ client: parsed.c })
        break;
      case 'presenter':
        console.log()
        if (parsed.c['presenterUUID'] == self.state.userUUID) {
          self.setState({ isPresenter: true })
        }
        break;
      case 'srcLink':
        self.appendLink(parsed.c)
        break;
      case 'chat':
        self.appendChat(parsed.c)
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
  }

  maintainWS() {
    var self = this;
    client.onopen = () => {
      //console.log('$$$$$$$$$$$ -> WebSocket Client Connected');
      //client.send(JSON.stringify({ type: 'room', id: this.state.roomId }));
      client.send(JSON.stringify({ type: 'room', id: 1234 }));
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

        case 'srcLink':
          self.appendLink(parsed.c)
          break;
        case 'chat':
          self.appendChat(parsed.c)
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
    var data = { name: this.state.name, user: { email: this.state.email, password: this.state.password } }
    if (this.state.email && this.state.email.length > 0) {
      if (this.state.signingUp) {
        MyActions.setInstance('users/sign_up', data);
      } else {
        MyActions.setInstance('users/login', data);
      }
    } else {
      const self = this;
      self.$f7.dialog.alert(dict.incomplete_data, dict.alert);
    }
  }

  signUp() {
    this.setState({ signingUp: true });
  }

  setInstance() {
    var self = this;
    var klass = ModelStore.getKlass()
    var user = ModelStore.getIntance();
    if (user && (klass === 'SignUp' || klass === 'Login')) {
      window.localStorage.setItem('token', user.token);
      //this.$f7router.navigate('/');
      window.location.reload()
    }
    if (klass === 'Validate') {
      console.log('registering name ...')
      this.setState({ name: user.name, fullname: user.name, userUUID: user.uuid }, () => {
        //self.sessionCreate();
      })
    }
    console.log(user, klass)

  }

  getInstance() {
    var self = this;
    var model = ModelStore.getIntance()
    var klass = ModelStore.getKlass()
    if (model && klass === 'Upload') {
      this.setState({
        model: model,
      }, () => {
        if (!model.converted && self.state.converterCounter < 10) {
          console.log('Cheking for conversion ...')
          setTimeout(() => this.recentUpload(), 10000);
          this.setState({ converterCounter: self.state.converterCounter + 1 })
        } else {
          this.setState({ progressShow: false });
        }
      });
    }
    if (model && klass === 'Room') {
      this.setState({
        roomId: model.room_id,
        pin: model.pin,
        isAdmin: model.is_admin,
        isPresenter: model.is_admin,
      }, () => {
        self.sessionCreate();
        socket.on('connect', function () {
          socket.emit('room', { room: model.room_id.toString(), uuid: self.state.userUUID });
        });

        //self.maintainWS()
      })
    }
    console.log(model, klass)
  }

  currentPage() {

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
      email,
      password,
      passwordConfirmation,
      signingUp,
      ionActive,
      screenActive,
      srcLink,
      isAdmin,
      chatActive,
      isPresenter
    } = this.state;

    return (
      <App params={f7params}>
        <Panel resizable left cover>
          <View>
            <Left
              wsSend={this.wsSend}
              chats={chats}
              appendChat={this.appendChat}
              userUUID={userUUID}
              name={name}
              participantDisplay={this.participantDisplay}
              isAdmin={isAdmin}
              chatDeactive={this.chatDeactive}

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
              logout={this.logout}
              scrollTo={this.scrollTo}
              ionPublishBtn={this.ionPublishBtn}
              screenPublishBtn={this.screenPublishBtn}
              ionActive={ionActive}
              screenActive={screenActive}
              isAdmin={isAdmin}
              chatActive={chatActive}
              chatDeactive={this.chatDeactive}
              togglePresenter={this.togglePresenter}
              isPresenter={isPresenter}
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
            ionVideos={this.ionVideos}
            ionActive={ionActive}
            screenVideos={this.screenVideos}
            screenActive={screenActive}
            appendLink={this.appendLink}
            srcLink={srcLink}
            isAdmin={isAdmin}
          />
          <LoginScreen
            className="demo-login-screen"
            opened={this.state.loginScreenOpened}
            onLoginScreenClosed={() => {
              this.handleChangeValue({ loginScreenOpened: false });
            }}
          >
            <Login
              email={email}
              handleChangeValue={this.handleChangeValue}
              name={name}
              password={password}
              passwordConfirmation={passwordConfirmation}
              login={this.login}
              signUp={this.signUp}
              signingUp={signingUp}
            />

          </LoginScreen>
        </View>
      </App>
    );
  }
};
