import Janus from "../janus.js";
export function sessionCreate(room) {
  var self = this;
  Janus.init({
    debug: "none",
    callback: function () {
      var janus = new Janus({
        server: self.state.server,
        success: function () {
          // Attach to AudioBridge plugin
          janus.attach({
            plugin: "janus.plugin.audiobridge",
            opaqueId: self.state.opaqueId,
            success: function (pluginHandle) {
              //$('#details').remove();
              self.setState({ mixertest: pluginHandle });
              Janus.log(
                "Plugin attached! (" +
                  self.state.mixertest.getPlugin() +
                  ", id=" +
                  self.state.mixertest.getId() +
                  ")"
              );
              self.registerUsername(room);
              // Prepare the username registration
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
            error: function (error) {
              Janus.error("  -- Error attaching plugin...", error);
              //bootbox.alert("Error attaching plugin... " + error);
            },
            consentDialog: function (on) {
              Janus.debug(
                "Consent dialog should be " + (on ? "on" : "off") + " now"
              );
            },
            iceState: function (state) {
              Janus.log("ICE state changed to " + state);
            },
            mediaState: function (medium, on) {
              Janus.log(
                "Janus " +
                  (on ? "started" : "stopped") +
                  " receiving our " +
                  medium
              );
            },
            webrtcState: function (on) {
              Janus.log(
                "Janus says our WebRTC PeerConnection is " +
                  (on ? "up" : "down") +
                  " now"
              );
            },
            onmessage: function (msg, jsep) {
              Janus.debug(" ::: Got a message :::", msg);
              var event = msg["audiobridge"];
              Janus.debug("Event: " + event);
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
                      myid: msg["id"],
                    });
                    Janus.log(
                      "Successfully joined room " +
                        msg["room"] +
                        " with ID " +
                        self.state.myid
                    );
                    self.addParticipant(
                      msg["id"],
                      self.state.fullname +
                        "§" +
                        self.state.userUUID +
                        "§" +
                        self.state.userColor
                    );
                    if (!self.state.webrtcUp) {
                      self.setState({ webrtcUp: true });
                      // Publish our stream
                      self.state.mixertest.createOffer({
                        media: {
                          video: false,
                          audio: { echoCancellation: true },
                        }, // This is an audio only room
                        success: function (jsep) {
                          Janus.debug("Got SDP!", jsep);
                          var publish = { request: "configure", muted: true };
                          self.state.mixertest.send({
                            message: publish,
                            jsep: jsep,
                          });
                        },
                        error: function (error) {
                          Janus.error("WebRTC error:", error);
                          // bootbox.alert("WebRTC error... " + error.message);
                        },
                      });
                    }
                  }
                  // Any room participant?
                  if (msg["participants"]) {
                    var list = msg["participants"];
                    Janus.debug("Got a list of participants:", list);
                    for (var f in list) {
                      var id = list[f]["id"];
                      var display = list[f]["display"];
                      var setup = list[f]["setup"];
                      var muted = list[f]["muted"];
                      //console.log("%%%%%%%%", list[f]);
                      self.addParticipant(list[f]["id"], list[f]["display"]);
                      //self.newRemoteFeed(id, display, audio, video);
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
                    myid: msg["id"],
                  });
                  Janus.log(
                    "Moved to room " +
                      msg["room"] +
                      ", new ID: " +
                      self.state.myid
                  );
                  // Any room participant?
                  // $('#list').empty();
                  if (msg["participants"]) {
                    var list = msg["participants"];
                    Janus.debug("Got a list of participants:", list);
                    for (var f in list) {
                      var id = list[f]["id"];
                      var display = list[f]["display"];
                      var setup = list[f]["setup"];
                      var muted = list[f]["muted"];
                      //console.log(">>>>>>", list[f]);
                      self.addParticipant(
                        msg["id"],
                        self.state.fullname +
                          "§" +
                          self.state.userUUID +
                          "§" +
                          self.state.userColor
                      );

                      Janus.debug(
                        "  >> [" +
                          id +
                          "] " +
                          display +
                          " (setup=" +
                          setup +
                          ", muted=" +
                          muted +
                          ")"
                      );
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
                  Janus.warn("The room has been destroyed!");
                } else if (event === "event") {
                  //console.log('Participant...', msg)
                  if (msg["participants"]) {
                    var list = msg["participants"];
                    Janus.debug("Got a list of participants:", list);
                    for (var f in list) {
                      var id = list[f]["id"];
                      var display = list[f]["display"];
                      var setup = list[f]["setup"];
                      var muted = list[f]["muted"];
                      var talking = list[f]["talking"];
                      Janus.debug(
                        "  >> [" +
                          id +
                          "] " +
                          display +
                          " (setup=" +
                          setup +
                          ", muted=" +
                          muted +
                          ")"
                      );
                      //console.log("%%%%%%%%", list);
                      if (talking) {
                        //console.log("%%%%%%%%",list[f]["id"],"is talking ...");
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
                    if (msg["error_code"] === 485) {
                      // This is a "no such room" error: give a more meaningful description
                    } else {
                    }
                    return;
                  }
                  // Any new feed to attach to?
                  if (msg["leaving"]) {
                    // One of the participants has gone away?
                    var leaving = msg["leaving"];
                    self.removeParticipant(leaving);
                    Janus.log(
                      "Participant left: " +
                        leaving +
                        " elements with ID #rp" +
                        leaving +
                        ")"
                    );
                    //$('#rp' + leaving).remove();
                  }
                }
              }
              if (jsep) {
                Janus.debug("Handling SDP as well...", jsep);
                self.state.mixertest.handleRemoteJsep({ jsep: jsep });
              }
            },
            onlocalstream: function (stream) {
              Janus.debug(" ::: Got a local stream :::", stream);
              //console.log("Local stream ******", stream);
              //console.log("Local stream ******", stream.getTracks());
              self.setState({ localStream: stream });

              // We're not going to attach the local audio stream
              // $('#audiojoin').hide();
              // $('#room').removeClass('hide').show();
              //$('#participant').removeClass('hide').html(myusername).show();
            },
            onremotestream: function (stream) {
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
                self
                  .$$("#mixedaudio")
                  .append(
                    '<audio class="rounded centered" id="roomaudio" width="100%" height="100%" autoplay/>'
                  );
                Janus.attachMediaStream(
                  document.getElementById("roomaudio"),
                  stream
                );
                self.setState({ remoteStream: stream });
              }
            },
            oncleanup: function () {
              //  webrtcUp = false;
              Janus.log(" ::: Got a cleanup notification :::");
              //$('#participant').empty().hide();
              //$('#list').empty();
              //$('#mixedaudio').empty();
              //$('#room').hide();
            },
          });
        },
        error: function (error) {
          //   Janus.error(error);
          //console.log(error);
        },
        destroyed: function () {
          window.location.reload();
        },
      });
    },
  });
}

export function registerUsername(room) {
  var self = this;
  var register = {
    request: "join",
    room: room,
    pin: self.state.pin,
    display:
      self.state.fullname +
      " §" +
      self.state.userUUID +
      "§" +
      self.state.userColor,
  };
  self.state.mixertest.send({ message: register });
  self.setState({ myId: self.state.mixertest.id });
}

export function removeParticipant(id) {
  var self = this;
  self.setState({
    participants: self.state.participants.filter((item) => item.id !== id),
  });
}

export function addParticipant(id, p) {
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
        current: "stopped-talking",
      }),
    });
  }
  //console.log("participant added:", participant[1]);
}

export function exisitingParticipant(participantId) {
  var self = this;
  var exisiting = self.state.participants.filter(
    (item) => item.uuid === participantId
  );
  if (exisiting.length === 0) {
    return true;
  } else {
    return false;
  }
}

export function participantDisplay(participantId) {
  var self = this;
  var exisiting = self.state.participants.filter(
    (item) => item.uuid === participantId
  );
  if (exisiting.length === 0) {
    return "";
  } else {
    return exisiting[0].display;
  }
}

export function participantChangeStatus(participantId, status) {
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

  this.setState((prevState) => ({
    talking: {
      ...prevState.talking, 
      [participantId]: status, 
    },
  }));
}

export function participantChangeRoom(participantId, room) {
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
  this.setState((prevState) => ({
    participantRoom: {
      ...prevState.participantRoom, 
      [participantId]: room, 
    },
  }));
}

export function toggleMute() {
  var self = this;
  this.state.mixertest.send({
    message: { request: "configure", muted: self.state.muted },
  });
  //console.log('muted', this.state.mixertest)
  //if(self.state.muted){
  self.participantChangeStatus(this.state.myId, false);
  //}
}

export function forceMute() {
  var self = this;
  this.state.mixertest.send({
    message: { request: "configure", muted: true },
  });

  self.participantChangeStatus(this.state.myId, false);
}

export function exitAudioRoom() {
  var self = this;
  if (this.state.mixertest) {
    this.state.mixertest.send({ message: { request: "unpublish" } });
  }
}
