"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sessionCreate = sessionCreate;
exports.registerUsername = registerUsername;
exports.removeParticipant = removeParticipant;
exports.addParticipant = addParticipant;
exports.exisitingParticipant = exisitingParticipant;
exports.participantDisplay = participantDisplay;
exports.participantChangeStatus = participantChangeStatus;
exports.participantChangeRoom = participantChangeRoom;
exports.toggleMute = toggleMute;
exports.forceMute = forceMute;
exports.exitAudioRoom = exitAudioRoom;

var _janus = _interopRequireDefault(require("../janus.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function sessionCreate(room) {
  var self = this;

  _janus["default"].init({
    debug: "none",
    callback: function callback() {
      var janus = new _janus["default"]({
        server: self.state.server,
        success: function success() {
          // Attach to AudioBridge plugin
          janus.attach({
            plugin: "janus.plugin.audiobridge",
            opaqueId: self.state.opaqueId,
            success: function success(pluginHandle) {
              //$('#details').remove();
              self.setState({
                mixertest: pluginHandle
              });

              _janus["default"].log("Plugin attached! (" + self.state.mixertest.getPlugin() + ", id=" + self.state.mixertest.getId() + ")");

              self.registerUsername(room); // Prepare the username registration

              /*
                                    $('#audiojoin').removeClass('hide').show();
                                    $('#registernow').removeClass('hide').show();
                                    $('#register').click(registerUsername);
                                    $('#username').focus();
                                    $('#start').removeAttr('disabled').html("Stop")
                                        .click(function () {
                                            $(this).attr('disabled', true);
                                            janus.destroy();
                                        });
                                    */
            },
            error: function error(_error) {
              _janus["default"].error("  -- Error attaching plugin...", _error); //bootbox.alert("Error attaching plugin... " + error);

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
              _janus["default"].debug(" ::: Got a message :::", msg);

              var event = msg["audiobridge"];

              _janus["default"].debug("Event: " + event);

              if (event) {
                //console.log(event, msg);
                if (event == "talking") {
                  self.participantChangeStatus(msg["id"], true);
                }

                if (event == "stopped-talking") {
                  self.participantChangeStatus(msg["id"], false);
                }

                if (event === "joined") {
                  // Successfully joined, negotiate WebRTC now
                  if (msg["id"]) {
                    self.setState({
                      myid: msg["id"]
                    });

                    _janus["default"].log("Successfully joined room " + msg["room"] + " with ID " + self.state.myid);

                    self.addParticipant(msg["id"], self.state.fullname + "§" + self.state.userUUID + "§" + self.state.userColor);

                    if (!self.state.webrtcUp) {
                      self.setState({
                        webrtcUp: true
                      }); // Publish our stream

                      self.state.mixertest.createOffer({
                        media: {
                          video: false,
                          audio: {
                            echoCancellation: true
                          }
                        },
                        // This is an audio only room
                        success: function success(jsep) {
                          _janus["default"].debug("Got SDP!", jsep);

                          var publish = {
                            request: "configure",
                            muted: true
                          };
                          self.state.mixertest.send({
                            message: publish,
                            jsep: jsep
                          });
                        },
                        error: function error(_error2) {
                          _janus["default"].error("WebRTC error:", _error2); // bootbox.alert("WebRTC error... " + error.message);

                        }
                      });
                    }
                  } // Any room participant?


                  if (msg["participants"]) {
                    var list = msg["participants"];

                    _janus["default"].debug("Got a list of participants:", list);

                    for (var f in list) {
                      var id = list[f]["id"];
                      var display = list[f]["display"];
                      var setup = list[f]["setup"];
                      var muted = list[f]["muted"]; //console.log("%%%%%%%%", list[f]);

                      self.addParticipant(list[f]["id"], list[f]["display"]); //self.newRemoteFeed(id, display, audio, video);

                      /*
                                                    Janus.debug("  >> [" + id + "] " + display + " (setup=" + setup + ", muted=" + muted + ")");
                                                    if ($('#rp' + id).length === 0) {
                                                        // Add to the participants list
                                                        $('#list').append('<li id="rp' + id + '" class="list-group-item">' + display +
                                                            ' <i class="absetup fa fa-chain-broken"></i>' +
                                                            ' <i class="abmuted fa fa-microphone-slash"></i></li>');
                                                        $('#rp' + id + ' > i').hide();
                                                    }
                                                    if (muted === true || muted === "true")
                                                        $('#rp' + id + ' > i.abmuted').removeClass('hide').show();
                                                    else
                                                        $('#rp' + id + ' > i.abmuted').hide();
                                                    if (setup === true || setup === "true")
                                                        $('#rp' + id + ' > i.absetup').hide();
                                                    else
                                                        $('#rp' + id + ' > i.absetup').removeClass('hide').show();
                                                        */
                    }
                  }
                } else if (event === "roomchanged") {
                  // The user switched to a different room
                  self.setState({
                    myid: msg["id"]
                  });

                  _janus["default"].log("Moved to room " + msg["room"] + ", new ID: " + self.state.myid); // Any room participant?
                  // $('#list').empty();


                  if (msg["participants"]) {
                    var list = msg["participants"];

                    _janus["default"].debug("Got a list of participants:", list);

                    for (var f in list) {
                      var id = list[f]["id"];
                      var display = list[f]["display"];
                      var setup = list[f]["setup"];
                      var muted = list[f]["muted"]; //console.log(">>>>>>", list[f]);

                      self.addParticipant(msg["id"], self.state.fullname + "§" + self.state.userUUID + "§" + self.state.userColor);

                      _janus["default"].debug("  >> [" + id + "] " + display + " (setup=" + setup + ", muted=" + muted + ")");
                      /*
                                                     if ($('#rp' + id).length === 0) {
                                                         // Add to the participants list
                                                         $('#list').append('<li id="rp' + id + '" class="list-group-item">' + display +
                                                             ' <i class="absetup fa fa-chain-broken"></i>' +
                                                             ' <i class="abmuted fa fa-microphone-slash"></i></li>');
                                                         $('#rp' + id + ' > i').hide();
                                                     }
                                                     if (muted === true || muted === "true")
                                                         $('#rp' + id + ' > i.abmuted').removeClass('hide').show();
                                                     else
                                                         $('#rp' + id + ' > i.abmuted').hide();
                                                     if (setup === true || setup === "true")
                                                         $('#rp' + id + ' > i.absetup').hide();
                                                     else
                                                         $('#rp' + id + ' > i.absetup').removeClass('hide').show();
                                                         */

                    }
                  }
                } else if (event === "destroyed") {
                  // The room has been destroyed
                  _janus["default"].warn("The room has been destroyed!");
                } else if (event === "event") {
                  //console.log('Participant...', msg)
                  if (msg["participants"]) {
                    var list = msg["participants"];

                    _janus["default"].debug("Got a list of participants:", list);

                    for (var f in list) {
                      var id = list[f]["id"];
                      var display = list[f]["display"];
                      var setup = list[f]["setup"];
                      var muted = list[f]["muted"];
                      var talking = list[f]["talking"];

                      _janus["default"].debug("  >> [" + id + "] " + display + " (setup=" + setup + ", muted=" + muted + ")"); //console.log("%%%%%%%%", list);


                      if (talking) {//console.log("%%%%%%%%",list[f]["id"],"is talking ...");
                      }

                      if (muted) {
                        self.participantChangeStatus(list[f]["id"], false);
                      }

                      self.addParticipant(list[f]["id"], list[f]["display"]);
                      /*
                                                    if ($('#rp' + id).length === 0) {
                                                        // Add to the participants list
                                                        $('#list').append('<li id="rp' + id + '" class="list-group-item">' + display +
                                                            ' <i class="absetup fa fa-chain-broken"></i>' +
                                                            ' <i class="abmuted fa fa-microphone-slash"></i></li>');
                                                        $('#rp' + id + ' > i').hide();
                                                    }
                                                    if (muted === true || muted === "true")
                                                        $('#rp' + id + ' > i.abmuted').removeClass('hide').show();
                                                    else
                                                        $('#rp' + id + ' > i.abmuted').hide();
                                                    if (setup === true || setup === "true")
                                                        $('#rp' + id + ' > i.absetup').hide();
                                                    else
                                                        $('#rp' + id + ' > i.absetup').removeClass('hide').show();
                                                        */
                    }
                  } else if (msg["error"]) {
                    if (msg["error_code"] === 485) {// This is a "no such room" error: give a more meaningful description
                    } else {}

                    return;
                  } // Any new feed to attach to?


                  if (msg["leaving"]) {
                    // One of the participants has gone away?
                    var leaving = msg["leaving"];
                    self.removeParticipant(leaving);

                    _janus["default"].log("Participant left: " + leaving + " elements with ID #rp" + leaving + ")"); //$('#rp' + leaving).remove();

                  }
                }
              }

              if (jsep) {
                _janus["default"].debug("Handling SDP as well...", jsep);

                self.state.mixertest.handleRemoteJsep({
                  jsep: jsep
                });
              }
            },
            onlocalstream: function onlocalstream(stream) {
              _janus["default"].debug(" ::: Got a local stream :::", stream); //console.log("Local stream ******", stream);
              //console.log("Local stream ******", stream.getTracks());


              self.setState({
                localStream: stream
              }); // We're not going to attach the local audio stream
              // $('#audiojoin').hide();
              // $('#room').removeClass('hide').show();
              //$('#participant').removeClass('hide').html(myusername).show();
            },
            onremotestream: function onremotestream(stream) {
              // $('#room').removeClass('hide').show();
              // var addButtons = false;
              /// if ($('#roomaudio').length === 0) {
              //    addButtons = true;
              //    $('#mixedaudio').append('<audio class="rounded centered" id="roomaudio" width="100%" height="100%" autoplay/>');
              //}
              //Janus.attachMediaStream($('#roomaudio').get(0), stream);
              // if (!addButtons)
              //     return;
              // Mute button
              //   audioenabled = true;
              //   $('#toggleaudio').click(
              //      function () {
              //          audioenabled = !audioenabled;
              //          if (audioenabled)
              //            $('#toggleaudio').html("Mute").removeClass("btn-success").addClass("btn-danger");
              //        else
              //           $('#toggleaudio').html("Unmute").removeClass("btn-danger").addClass("btn-success");
              //       mixertest.send({ message: { request: "configure", muted: !audioenabled } });
              //  }).removeClass('hide').show();
              if (self.$$("#roomaudio").length === 0) {
                self.$$("#mixedaudio").append('<audio class="rounded centered" id="roomaudio" width="100%" height="100%" autoplay/>');

                _janus["default"].attachMediaStream(document.getElementById("roomaudio"), stream);

                self.setState({
                  remoteStream: stream
                });
              }
            },
            oncleanup: function oncleanup() {
              //  webrtcUp = false;
              _janus["default"].log(" ::: Got a cleanup notification :::"); //$('#participant').empty().hide();
              //$('#list').empty();
              //$('#mixedaudio').empty();
              //$('#room').hide();

            }
          });
        },
        error: function error(_error3) {//   Janus.error(error);
          //console.log(error);
        },
        destroyed: function destroyed() {
          window.location.reload();
        }
      });
    }
  });
}

function registerUsername(room) {
  var self = this;
  var register = {
    request: "join",
    room: room,
    pin: self.state.pin,
    display: self.state.fullname + " §" + self.state.userUUID + "§" + self.state.userColor
  };
  self.state.mixertest.send({
    message: register
  });
  self.setState({
    myId: self.state.mixertest.id
  });
}

function removeParticipant(id) {
  var self = this;
  self.setState({
    participants: self.state.participants.filter(function (item) {
      return item.id !== id;
    })
  });
}

function addParticipant(id, p) {
  //console.log("Adding Participants ...", id, p);
  var self = this;
  var participant = p.split("§");

  if (this.exisitingParticipant(participant[1])) {
    self.setState({
      participants: self.state.participants.concat({
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

function exisitingParticipant(participantId) {
  var self = this;
  var exisiting = self.state.participants.filter(function (item) {
    return item.uuid === participantId;
  });

  if (exisiting.length === 0) {
    return true;
  } else {
    return false;
  }
}

function participantDisplay(participantId) {
  var self = this;
  var exisiting = self.state.participants.filter(function (item) {
    return item.uuid === participantId;
  });

  if (exisiting.length === 0) {
    return "";
  } else {
    return exisiting[0].display;
  }
}

function participantChangeStatus(participantId, status) {
  //console.log(participantId, status)

  /*
  var self = this;
  var participants = self.state.participants;
  if (participants.length > 0) {
    for (let i = 0; i < participants.length; i++) {
      //console.log(participants[i].id)
      if (participants[i].id == participantId) {
        let newState = Object.assign({}, self.state);
        newState.participants[i] = {
          id: participants[i].id,
          display: participants[i].display,
          uuid: participants[i].uuid,
          userColor: participants[i].userColor,
          role: participants[i].role,
          room: participants[i].room,
          current: status,
        };
        self.setState(newState, () => {
          console.log(self.state.participants);
          break;
        });
      }
    }
  }*/
  this.setState(function (prevState) {
    return {
      talking: _objectSpread({}, prevState.talking, _defineProperty({}, participantId, status))
    };
  });
}

function participantChangeRoom(participantId, room) {
  //console.log(participantId, room)

  /*
  var self = this;
  var participants = self.state.participants;
  if (participants.length > 0) {
    for (let i = 0; i < participants.length; i++) {
      //console.log(participants[i].id)
      if (participants[i].uuid == participantId) {
        let newState = Object.assign({}, self.state);
        newState.participants[i] = {
          id: participants[i].id,
          display: participants[i].display,
          uuid: participants[i].uuid,
          userColor: participants[i].userColor,
          role: participants[i].role,
          current: participants[i].current,
          room: room,
        };
        self.setState(newState, () => {
          console.log(self.state.participants);
          break;
        });
      }
    }
  }*/
  this.setState(function (prevState) {
    return {
      participantRoom: _objectSpread({}, prevState.participantRoom, _defineProperty({}, participantId, room))
    };
  });
}

function toggleMute() {
  var self = this;
  this.state.mixertest.send({
    message: {
      request: "configure",
      muted: self.state.muted
    }
  }); //console.log('muted', this.state.mixertest)
  //if(self.state.muted){

  self.participantChangeStatus(this.state.myId, false); //}
}

function forceMute() {
  var self = this;
  this.state.mixertest.send({
    message: {
      request: "configure",
      muted: true
    }
  });
  self.participantChangeStatus(this.state.myId, false);
}

function exitAudioRoom() {
  var self = this;

  if (this.state.mixertest) {
    this.state.mixertest.send({
      message: {
        request: "unpublish"
      }
    });
  }
}