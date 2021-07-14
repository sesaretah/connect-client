"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.vsessionCreate = vsessionCreate;
exports.vnewRemoteFeed = vnewRemoteFeed;
exports.vregisterUsername = vregisterUsername;
exports.vstreamAttacher = vstreamAttacher;
exports.vstreamDettacher = vstreamDettacher;
exports.vremoveParticipant = vremoveParticipant;
exports.vaddParticipant = vaddParticipant;
exports.publishCamera = publishCamera;
exports.vexisitingParticipant = vexisitingParticipant;
exports.vparticipantDisplay = vparticipantDisplay;
exports.vparticipantChangeStatus = vparticipantChangeStatus;
exports.vparticipantChangeRoom = vparticipantChangeRoom;
exports.vexitAudioRoom = vexitAudioRoom;

var _janus = _interopRequireDefault(require("../janus-2021.js"));

var _jquery = _interopRequireDefault(require("jquery"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function vsessionCreate(room) {
  var self = this;

  _janus["default"].init({
    debug: "all",
    callback: function callback() {
      // Create session
      var janus = new _janus["default"]({
        server: self.state.server,
        success: function success() {
          // Attach to VideoRoom plugin
          janus.attach({
            plugin: "janus.plugin.videoroom",
            opaqueId: self.state.opaqueId,
            success: function success(pluginHandle) {
              //sfutest = pluginHandle;
              self.setState({
                janus: janus
              });
              self.setState({
                sfutest: pluginHandle
              });

              _janus["default"].log("Plugin attached! (" + self.state.sfutest.getPlugin() + ", id=" + self.state.sfutest.getId() + ")");

              _janus["default"].log("  -- This is a publisher/manager");

              self.vregisterUsername(room); // Prepare the username registration
            },
            error: function error(_error) {
              _janus["default"].error("  -- Error attaching plugin...", _error);
            },
            consentDialog: function consentDialog(on) {
              _janus["default"].debug("Consent dialog should be " + (on ? "on" : "off") + " now");
            },
            iceState: function iceState(state) {
              _janus["default"].log("ICE state changed to " + state);
            },
            mediaState: function mediaState(medium, on) {
              _janus["default"].log("Janus " + (on ? "started" : "stopped") + " receiving our " + medium);
            },
            webrtcState: function webrtcState(on) {
              _janus["default"].log("Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now");
            },
            onmessage: function onmessage(msg, jsep) {
              _janus["default"].debug(" ::: Got a message (publisher) :::", msg);

              var event = msg["videoroom"];

              _janus["default"].debug("Event: " + event);

              if (event) {
                if (event === "joined") {
                  // Publisher/manager created, negotiate WebRTC and attach to existing feeds, if any
                  //myid = msg["id"];
                  //mypvtid = msg["private_id"];
                  self.setState({
                    myVroomId: msg["id"]
                  });

                  _janus["default"].log("Successfully joined room " + msg["room"] + " with ID " + msg["id"]);

                  self.addParticipant(msg["id"], self.state.fullname + "§" + self.state.userUUID); //publishOwnFeed(true);
                  //}
                  // Any new feed to attach to?

                  if (msg["publishers"]) {
                    var list = msg["publishers"];

                    _janus["default"].debug("Got a list of available publishers/feeds:", list);

                    for (var f in list) {
                      var id = list[f]["id"];
                      var display = list[f]["display"];
                      var audio = list[f]["audio_codec"];
                      var video = list[f]["video_codec"];

                      _janus["default"].debug("  >> [" + id + "] " + display + " (audio: " + audio + ", video: " + video + ")");

                      self.addParticipant(list[f]["id"], list[f]["display"]);
                      self.newRemoteFeed(id, display, audio, video);
                    }
                  }
                } else if (event === "destroyed") {
                  // The room has been destroyed
                  _janus["default"].warn("The room has been destroyed!");
                } else if (event === "event") {
                  // Any new feed to attach to?
                  if (msg["publishers"]) {
                    var list = msg["publishers"];

                    _janus["default"].debug("Got a list of available publishers/feeds:", list);

                    for (var f in list) {
                      var id = list[f]["id"];
                      var display = list[f]["display"];
                      var audio = list[f]["audio_codec"];
                      var video = list[f]["video_codec"];

                      _janus["default"].debug("  >> [" + id + "] " + display + " (audio: " + audio + ", video: " + video + ")");

                      self.addParticipant(list[f]["id"], list[f]["display"]);
                      self.newRemoteFeed(id, display, audio, video);
                    }
                  } else if (msg["leaving"]) {
                    // One of the publishers has gone away?
                    var leaving = msg["leaving"];
                    console.log("Publisher leaving: " + leaving);
                    self.setState({
                      feeds: self.state.feeds.filter(function (item) {
                        return item.rfid != leaving;
                      })
                    }, function () {
                      return console.log("feeds: >>>>", self.state.feeds);
                    });
                    var unPublishedFeed = self.state.feeds.filter(function (item) {
                      return item.rfid === leaving;
                    });
                    var remoteFeed = unPublishedFeed.shift();

                    if (remoteFeed != null) {
                      remoteFeed.detach();
                    }

                    self.removeParticipant(leaving);
                  } else if (msg["unpublished"]) {
                    // One of the publishers has unpublished?
                    var unpublished = msg["unpublished"];
                    console.log("Publisher left: " + unpublished);

                    if (unpublished === "ok") {
                      self.state.sfutest.hangup();
                      self.vstreamDettacher(self.state.sfutest);
                      return;
                    }

                    self.setState({
                      feeds: self.state.feeds.filter(function (item) {
                        return item.rfid != unpublished;
                      })
                    });
                    var unPublishedFeed = self.state.feeds.filter(function (item) {
                      return item.rfid === unpublished;
                    });
                    var remoteFeed = unPublishedFeed.shift();

                    if (remoteFeed != null) {
                      remoteFeed.detach();
                      self.vstreamDettacher(remoteFeed);
                    }

                    self.removeParticipant(unpublished);
                  } else if (msg["error"]) {
                    if (msg["error_code"] === 426) {// This is a "no such room" error: give a more meaningful description
                    } else {}
                  }
                }
              }

              if (jsep) {
                _janus["default"].debug("Handling SDP as well...", jsep);

                self.state.sfutest.handleRemoteJsep({
                  jsep: jsep
                });
              }
            },
            onlocalstream: function onlocalstream(stream) {
              _janus["default"].debug(" ::: Got a local stream :::", stream);

              console.log(" ::: Got a local stream :::", stream);
              console.log(self.state.sfutest.id);
              var exisiting = self.state.feeds.filter(function (item) {
                return item.id === self.state.sfutest.id;
              });

              if (exisiting.length === 0) {
                self.state.sfutest.rfid = self.state.myVroomId;
                self.setState({
                  feeds: self.state.feeds.concat(self.state.sfutest)
                });
              }

              var videoTracks = stream.getVideoTracks();

              if (!videoTracks || videoTracks.length === 0) {
                self.vstreamDettacher(self.state.sfutest);
              } else {
                console.log(self.state.vparticipants);
                self.vstreamAttacher(self.state.sfutest);
              }
            },
            onremotestream: function onremotestream(stream) {// The publisher stream is sendonly, we don't expect anything here
            },
            oncleanup: function oncleanup() {
              _janus["default"].log(" ::: Got a cleanup notification: we are unpublished now :::");
            }
          });
        },
        error: function error(_error2) {
          _janus["default"].error(_error2); //bootbox.alert(error, function() {


          window.location.reload(); //});
        },
        destroyed: function destroyed() {
          window.location.reload();
        }
      });
    }
  });
}

function vnewRemoteFeed(id, feeds, display, audio, video) {
  var self = this; // A new feed has been published, create a new plugin handle and attach to it as a subscriber

  var remoteFeed = null;
  self.state.janus.attach({
    plugin: "janus.plugin.videoroom",
    opaqueId: this.state.opaqueId,
    success: function success(pluginHandle) {
      remoteFeed = pluginHandle;
      remoteFeed.simulcastStarted = false;

      _janus["default"].log("Plugin attached! (" + remoteFeed.getPlugin() + ", id=" + remoteFeed.getId() + ")");

      _janus["default"].log("  -- This is a subscriber"); // We wait for the plugin to send us an offer


      var subscribe = {
        request: "join",
        room: self.state.roomId,
        ptype: "subscriber",
        pin: self.state.pin,
        feed: id,
        private_id: self.state.mypvtid
      }; // In case you don't want to receive audio, video or data, even if the
      // publisher is sending them, set the 'offer_audio', 'offer_video' or
      // 'offer_data' properties to false (they're true by default), e.g.:
      // 		subscribe["offer_video"] = false;
      // For example, if the publisher is VP8 and this is Safari, let's avoid video

      if (_janus["default"].webRTCAdapter.browserDetails.browser === "safari" && (video === "vp9" || video === "vp8" && !_janus["default"].safariVp8)) {
        if (video) video = video.toUpperCase();
        console.log("Publisher is using " + video + ", but Safari doesn't support it: disabling video");
        subscribe["offer_video"] = false;
      }

      remoteFeed.videoCodec = video;
      remoteFeed.send({
        message: subscribe
      });
    },
    error: function error(_error3) {
      _janus["default"].error("  -- Error attaching plugin...", _error3);

      window.alert("Error attaching plugin... " + _error3);
    },
    onmessage: function onmessage(msg, jsep) {
      _janus["default"].debug(" ::: Got a message (subscriber) :::", msg);

      var event = msg["videoroom"];

      _janus["default"].log("Event: " + event);

      if (msg["error"]) {
        window.alert(msg["error"]);
      } else if (event) {
        if (event === "attached") {
          remoteFeed.rfid = msg["id"];
          remoteFeed.rfdisplay = msg["display"];
          self.setState({
            feeds: self.state.feeds.concat(remoteFeed)
          });
          self.setState({
            lowFeeds: self.state.lowFeeds.concat(remoteFeed)
          });

          if (!video) {
            self.streamDettacher(remoteFeed);
          }

          _janus["default"].log("Successfully attached to feed " + remoteFeed.rfid + " (" + remoteFeed.rfdisplay + ") in room " + msg["room"]);
        } else if (event === "event") {} else {// What has just happened?
        }
      }

      if (jsep) {
        _janus["default"].log("Handling SDP as well...", jsep);

        remoteFeed.createAnswer({
          jsep: jsep,
          // Add data:true here if you want to subscribe to datachannels as well
          // (obviously only works if the publisher offered them in the first place)
          media: {
            audioSend: false,
            videoSend: false,
            data: true
          },
          // We want recvonly audio/video
          success: function success(jsep) {
            _janus["default"].log("Got SDP!", jsep);

            var body = {
              request: "start",
              room: self.state.roomId
            };
            remoteFeed.send({
              message: body,
              jsep: jsep
            });
          },
          error: function error(_error4) {
            _janus["default"].log("WebRTC error:", _error4);

            window.alert("WebRTC error... " + _error4.message);
          }
        });
      }
    },
    iceState: function iceState(state) {
      _janus["default"].log("ICE state of this WebRTC PeerConnection (feed #" + remoteFeed.rfindex + ") changed to " + state);
    },
    webrtcState: function webrtcState(on) {
      _janus["default"].log("Janus says this WebRTC PeerConnection (feed #" + remoteFeed.rfindex + ") is " + (on ? "up" : "down") + " now");

      if (on === "down") {
        self.vremoveParticipant(remoteFeed.rfid);
      }
    },
    onlocalstream: function onlocalstream(stream) {
      console.log(">>>>>>>>>>>", stream);
    },
    onremotestream: function onremotestream(stream) {
      self.streamAttacher(remoteFeed);
    },
    ondata: function ondata(data) {},
    oncleanup: function oncleanup() {
      _janus["default"].log(" ::: Got a cleanup notification (remote feed " + id + ") :::");
    }
  });
}

function vregisterUsername(room) {
  var self = this;
  var register = {
    request: "join",
    room: 1234,
    ptype: "publisher",
    //pin: self.state.pin,
    display: self.state.fullname + " §" + self.state.userUUID + "§" + self.state.userColor
  };
  self.state.sfutest.send({
    message: register
  }); //self.setState({ myVroomId: self.state.mixertest.id });
}

function vstreamAttacher(feed) {
  console.log("Attaching " + feed.id);
  var videoQuality = "video-";

  if (feed.id && feed.webrtcStuff && feed.webrtcStuff.remoteStream) {
    _janus["default"].attachMediaStream(document.getElementById(videoQuality + feed.id), feed.webrtcStuff.remoteStream);
  }

  if (feed.id && feed.webrtcStuff && feed.webrtcStuff.myStream) {
    _janus["default"].attachMediaStream(document.getElementById(videoQuality + feed.id), feed.webrtcStuff.myStream);
  }
}

function vstreamDettacher(feed) {
  if (feed.id) {
    console.log("Dettaching " + feed.id);
    (0, _jquery["default"])("#video-" + feed.id).hide();
  }
}

function vremoveParticipant(id) {
  var self = this;
  self.setState({
    participants: self.state.vparticipants.filter(function (item) {
      return item.id !== id;
    })
  });
}

function vaddParticipant(id, p) {
  //console.log("Adding Participants ...", id, p);
  var self = this;
  var participant = p.split("§");

  if (this.exisitingParticipant(participant[1])) {
    self.setState({
      participants: self.state.vparticipants.concat({
        id: id,
        display: participant[0],
        uuid: participant[1],
        userColor: participant[2],
        role: "listener",
        current: "stopped-talking"
      })
    });
  } //console.log("participant added:", participant[1]);

}

function publishCamera() {
  var bitrate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 16;
  var self = this;
  self.state.sfutest.createOffer({
    media: {
      audioRecv: false,
      videoRecv: false,
      data: true,
      videoSend: true,
      audioSend: false
    },
    success: function success(jsep) {
      _janus["default"].debug("********* Got publisher SDP!", jsep);

      console.log("switching to " + bitrate);

      if (jsep) {
        var publish = {
          request: "configure",
          audio: false,
          video: true,
          data: false,
          bitrate: bitrate * 8000,
          bitrate_cap: true //videocodec: "vp8",

        };
        self.state.sfutest.send({
          message: publish,
          jsep: jsep
        });
      }

      self.setState({
        publishedCamera: true
      });
      var tracks = self.state.sfutest.webrtcStuff.myStream.getTracks();
      console.log(tracks);
    },
    error: function error(_error5) {
      _janus["default"].error("***** WebRTC error:", _error5);
    }
  });
}

function vexisitingParticipant(participantId) {
  var self = this;
  var exisiting = self.state.vparticipants.filter(function (item) {
    return item.uuid === participantId;
  });

  if (exisiting.length === 0) {
    return true;
  } else {
    return false;
  }
}

function vparticipantDisplay(participantId) {
  var self = this;
  var exisiting = self.state.vparticipants.filter(function (item) {
    return item.uuid === participantId;
  });

  if (exisiting.length === 0) {
    return "";
  } else {
    return exisiting[0].display;
  }
}

function vparticipantChangeStatus(participantId, status) {
  this.setState(function (prevState) {
    return {
      talking: _objectSpread({}, prevState.talking, _defineProperty({}, participantId, status))
    };
  });
}

function vparticipantChangeRoom(participantId, room) {
  this.setState(function (prevState) {
    return {
      participantRoom: _objectSpread({}, prevState.participantRoom, _defineProperty({}, participantId, room))
    };
  });
}

function vexitAudioRoom() {
  var self = this;

  if (this.state.mixertest) {
    this.state.mixertest.send({
      message: {
        request: "unpublish"
      }
    });
  }
}