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
import Framework7 from 'framework7/framework7.esm.bundle';

import {
  sessionCreate, addParticipant, exisitingParticipant, registerUsername,
  toggleMute, exitAudioRoom, removeParticipant, participantChangeStatus,
  participantDisplay, forceMute, participantChangeRoom
} from "./janus-tools.js";

import {
  vsessionCreate, vregisterUsername, vNewRemoteFeed, publishCamera,
  vPublishBtn, vStreamAttacher, vStreamDettacher, unPublishCamera,
  vChangeUsername
} from "./janus-videoroom.js";

import {
  ionSessionCreate, ionStart, ionVideos, ionUnPublish, ionPublishBtn, ionDisplay,
  screenSessionCreate, screenStart, screenVideos, screenUnPublish, screenPublishBtn,
  leaveRoom
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
    this.forceMute = forceMute.bind(this);
    this.participantChangeRoom = participantChangeRoom.bind(this);
    this.leaveRoom = leaveRoom.bind(this);

    this.vsessionCreate = vsessionCreate.bind(this)
    this.vregisterUsername = vregisterUsername.bind(this)
    this.vNewRemoteFeed = vNewRemoteFeed.bind(this)
    this.publishCamera = publishCamera.bind(this)
    this.vPublishBtn = vPublishBtn.bind(this)
    this.vStreamAttacher = vStreamAttacher.bind(this)
    this.vStreamDettacher = vStreamDettacher.bind(this)
    this.unPublishCamera = unPublishCamera.bind(this)
    this.vChangeUsername = vChangeUsername.bind(this)
    
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
    this.toggleRole = this.toggleRole.bind(this)

    this.connectSocketRoom = this.connectSocketRoom.bind(this)
    this.participantRole = this.participantRole.bind(this)

    this.handRaise = this.handRaise.bind(this)
    this.handRaised = this.handRaised.bind(this)
    this.pageAfterIn = this.pageAfterIn.bind(this)


    this.state = {
      participants: [],
      vparticipants: [],
      feeds: [],
      token: window.localStorage.getItem("token"),
      shortners: null,
      server: conf.janusServer,
      janus: null,
      sfutest: null,
      opaqueId: "videoroomtest-" + Janus.randomString(12),
      roomId: null,
      pin: 'c13eab83262202c2840a',
      myId: null,
      myVroomId: null,
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
      clientLocal: [],
      streams: [],
      media: null,
      display: 1,
      ionActive: false,
      //

      vActive: false,
      publishedCamera: false,
      vJoined: false,

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
      roles: [],
      isPresenter: false,
      isSpeaker: false,
      isWriter: false,

      handRaisings: [],

      slot: null,
      videoState: 'initial',

      validationState: null,
      talking: {},
      participantRoom: {},

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
    //console.log('presenter', uuid)
    //socket.emit('presenter', { uuid: uuid });
    //this.setState({ presenters: self.state.presenters.concat(uuid) })
  }

  toggleRole(uuid, role, domain = 'single') {
    var self = this;
    //console.log(uuid, role, this.participantRole(uuid))
    if (this.participantRole(uuid) === role) {
      role = 'not' + role
    }
    var roleBlock = { uuid: uuid, role: role, domain: domain }
    socket.emit('changeRole', roleBlock);
    var roles = this.state.roles
    if (roles.length > 0) {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].uuid && roles[i].uuid === uuid) {
          let newState = Object.assign({}, this.state);
          newState.roles[i] = roleBlock
          this.setState(newState);
        } else {
          this.setState({ roles: this.state.roles.concat(roleBlock) });
        }
      }
    } else {
      this.setState({ roles: this.state.roles.concat(roleBlock) });
    }
  }

  participantRole(uuid) {
    var roles = this.state.roles.filter(
      (item) => item.uuid === uuid
    );
    if (roles && roles[0] && roles[0].role) {
      return (roles[0].role)
    } else {
      return ('')
    }
  }

  handRaise(msg) {
    var self = this;
    var raiseBlock = { uuid: msg['raiserUUID'], status: msg['status'] }
    var handRaisings = this.state.handRaisings
    if (handRaisings.length > 0) {
      for (let i = 0; i < handRaisings.length; i++) {
        if (handRaisings[i].uuid && handRaisings[i].uuid === msg['raiserUUID']) {
          let newState = Object.assign({}, this.state);
          newState.handRaisings[i] = raiseBlock
          this.setState(newState);
        } else {
          this.setState({ handRaisings: this.state.handRaisings.concat(raiseBlock) });
        }
      }
    } else {
      this.setState({ handRaisings: this.state.handRaisings.concat(raiseBlock) });
    }
  }

  handRaised(uuid) {
    // console.log(this.state.handRaisings)
    var flag = false
    var handRaisings = this.state.handRaisings
    for (let i = 0; i < handRaisings.length; i++) {
      if (handRaisings[i].uuid && handRaisings[i].uuid === uuid && handRaisings[i].status === 'raised') {
        flag = true
      }
      if (i === handRaisings.length - 1) {
        return flag
      }

    }

  }



  wsSend(msg, sender = this.state.userUUID) {
    msg['room'] = this.state.roomId
    msg['sender'] = sender
    socket.emit('message', msg);
  }

  componentDidMount() {
    var self = this;
    MyActions.getInstance('uploads/recent', 1, this.state.token);
    const app = this.$f7;
    //console.log('this $$$$$$$', this.getJsonFromUrl(this.$f7.view[0].history[0]))
    //this.extractAction();
    MyActions.getInstance('rooms/last', 1, this.state.token);


    if (this.state.token && this.state.token.length > 10) {
      MyActions.setInstance('users/validate_token', {}, this.state.token);
      this.setState({ loginScreenOpened: false, validationState: 'confirm' })
    } else {
      var params = this.getJsonFromUrl(this.$f7.view[0].history[0])
      if(params && params['token']){
        MyActions.setInstance('users/validate_token', {}, params['token']);
        this.setState({ validationState: 'start' })
        window.localStorage.setItem('token', params['token']);
      }
      
    }

    self.screenSessionCreate();
    

    socket.on('connect', function () {
      if (self.state.roomId) {
        socket.emit('room', { room: self.state.roomId.toString(), uuid: self.state.userUUID });
      }
    });

    socket.on('message', function (data) {
      if (data['sender'] !== self.state.userUUID) {
        self.socketHandle(data)
      }
    });


    socket.on('ionSlot', function (data) {
      console.log(data['slot']);
      self.setState({ slot: data['slot'] }, ()=>{
        if(!self.state.vJoined){
          self.vsessionCreate(1234)
        } else {
          self.vChangeUsername(1234)
        }
      })
      self.wsSend({ type: 'joinedRoom', c: data['slot'] })
      setTimeout(
        () => self.publishCamera(),
        7000
      );
      //console.log('>>>>>!!!', data['slot'])
    })

    window.onunload = window.onbeforeunload = function() { 
      self.unPublishCamera()
    }

    //window.onunload = function(){self.ionUnPublish();}
   // self.$$('.popover-menu').toggleClass("popover-open")
   
    
    //.on('popover:open', function (e) {
    //  console.log('About popover open');
    //});
  }

  ionRequestRoom() {
    var self = this;
    self.$$('#videoLoaderIcon').show();
    self.$$('#enableVideo').hide();

    if (self.state.videoState == 'initial') {
      self.setState({ videoState: 'requested' },
        () => {
          socket.emit('ionReqSlot', { uuid: this.state.userUUID })
          //console.log('ionReqSlot')
        })
    }

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
    //console.log(file)
    self.setState({ progressShow: true }, () => console.log(this.state.progressShow))
    const config = {
      onUploadProgress: function (progressEvent) {
        var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        //console.log(percentCompleted)
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
    //console.log('recentUpload Called ...')
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
    this.$$('.page-content').scrollTop(pos.top, 350)
  }

  appendChat(c) {
    //console.log(c)
    var exist = this.state.chats.filter((item) => item.uuid === c.uuid)
    //console.log(exist)
    if (exist && exist.length === 0) {
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
    //console.log(msg)
    var parsed = msg
    switch (parsed.type) {
      case 'room':
        //console.log('client', parsed.c)
        self.setState({ client: parsed.c })
        break;
      case 'presenter':
        //console.log()
        if (parsed.c['presenterUUID'] == self.state.userUUID) {
          self.setState({ isPresenter: true })
        }
        break;
      case 'joinedRoom':
        //console.log(parsed)
        self.participantChangeRoom(parsed.sender, parsed.c)
        break;
      case 'joinRoom':
        if (this.state.slot !== parsed.c) {
          //console.log(parsed.c)
          self.ionSessionCreate(parsed.c);
        }
        break;
      case 'leaveRoom':
        if (this.state.slot !== parsed.c) {
          //console.log(parsed.c)
          self.leaveRoom(parsed.c);
        }
        break;
      case 'changeRole':
        //console.log()
        if (parsed.c['domain'] == 'all' || parsed.c['roleUUID'] == self.state.userUUID) {
          if (parsed.c['role'] == 'presenter') {
            self.setState({ isPresenter: true, isSpeaker: false, isWriter: false })
          }
          if (parsed.c['role'] == 'speaker') {
            self.setState({ isSpeaker: true, isPresenter: false })
          }
          if (parsed.c['role'] == 'writer') {
            self.setState({ isWriter: true, isPresenter: false })
          }
          if (parsed.c['role'] == 'notpresenter') {
            self.setState({ isPresenter: false })
          }
          if (parsed.c['role'] == 'notwriter') {
            self.setState({ isWriter: false })
          }
          if (parsed.c['role'] == 'notspeaker') {
            self.forceMute();
            self.setState({ isSpeaker: false })
          }
        }
        break;

      case 'handRaise':
        self.handRaise(parsed.c)
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
        //console.log('newComer', parsed.c)
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
          //console.log('client', parsed.c)
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
          //console.log('newComer', parsed.c)
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
      if(this.state.validationState === 'confirm'){
        //console.log('registering name ...')
        this.setState({ name: user.name, fullname: user.name, userUUID: user.uuid }, () => {
          self.connectSocketRoom();
        })
      } else {
        window.location.reload()
      }

      //this.setState({ loginScreenOpened: false })
    }
    //console.log(user, klass)

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
          //console.log('Cheking for conversion ...')
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
        self.sessionCreate(self.state.roomId);
        //self.sessionCreate(1234);
        self.connectSocketRoom();
      })
    }
    //console.log(model, klass)
  }

  connectSocketRoom() {
    if (this.state.userUUID && this.state.roomId) {
      socket.emit('room', { room: this.state.roomId, uuid: this.state.userUUID });
      //console.log('*******', this.state.roomId, this.state.userUUID)
    }
  }

  currentPage() {

  }

  pageAfterIn() {
   // setTimeout(
   //   () => this.$f7.popover.open('.popover-menu', '#xxx'),
   //   7000
   // );
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
      isPresenter,
      isSpeaker,
      isWriter,
      roles,
      handRaisings,
      slot,
      talking,
      participantRoom,
      vActive
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
              toggleRole={this.toggleRole}
              isSpeaker={isSpeaker}
              isWriter={isWriter}
              roles={roles}
              participantRole={this.participantRole}
              wsSend={this.wsSend}
              handRaisings={handRaisings}
              handRaised={this.handRaised}
              handRaise={this.handRaise}
              currentSlot={slot}
              talking={talking}
              participantRoom={participantRoom}
              pageAfterIn={this.pageAfterIn}
              vPublishBtn={this.vPublishBtn}
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
            isPresenter={isPresenter}
            isWriter={isWriter}
            vActive={vActive}
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
