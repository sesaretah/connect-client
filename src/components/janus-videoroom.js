import Janus from "../janus-2021.js";
import React, { Component } from "react";
import $ from "jquery";
import { socket } from "./socket.js";

export function vsessionCreate(room) {
  var self = this;
  Janus.init({
    debug: "all",
    callback: function () {
      // Create session
      var janus = new Janus({
        server: self.state.server,
        success: function () {
          // Attach to VideoRoom plugin
          janus.attach({
            plugin: "janus.plugin.videoroom",
            opaqueId: self.state.opaqueId,
            success: function (pluginHandle) {
              //sfutest = pluginHandle;
              self.setState({ janus: janus });
              self.setState({ sfutest: pluginHandle });
              Janus.log(
                "Plugin attached! (" +
                  self.state.sfutest.getPlugin() +
                  ", id=" +
                  self.state.sfutest.getId() +
                  ")"
              );
              Janus.log("  -- This is a publisher/manager");
              self.vregisterUsername(room);
              // Prepare the username registration
            },
            error: function (error) {
              Janus.error("  -- Error attaching plugin...", error);
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
              Janus.debug(" ::: Got a message (publisher) :::", msg);
              var event = msg["videoroom"];
              Janus.debug("Event: " + event);
              if (event) {
                if (event === "joined") {
                  // Publisher/manager created, negotiate WebRTC and attach to existing feeds, if any
                  //myid = msg["id"];
                  //mypvtid = msg["private_id"];
                  self.setState({
                    myVroomId: msg["id"],
                    vJoined: true,
                  });
                  Janus.log(
                    "Successfully joined room " +
                      msg["room"] +
                      " with ID " +
                      msg["id"]
                  );
                  self.addParticipant(
                    msg["id"],
                    self.state.fullname + "§" + self.state.userUUID 
                  );
                  //publishOwnFeed(true);
                  //}
                  // Any new feed to attach to?
                  if (msg["publishers"]) {
                    var list = msg["publishers"];
                    Janus.debug(
                      "Got a list of available publishers/feeds:",
                      list
                    );
                    for (var f in list) {
                      var id = list[f]["id"];
                      var display = list[f]["display"];
                      var audio = list[f]["audio_codec"];
                      var video = list[f]["video_codec"];
                      Janus.debug(
                        "  >> [" +
                          id +
                          "] " +
                          display +
                          " (audio: " +
                          audio +
                          ", video: " +
                          video +
                          ")"
                      );
                      self.addParticipant(list[f]["id"], list[f]["display"]);
                      self.vNewRemoteFeed(id, display, audio, video);
                    }
                  }
                } else if (event === "destroyed") {
                  // The room has been destroyed
                  Janus.warn("The room has been destroyed!");
                } else if (event === "event") {
                  // Any new feed to attach to?
                  if (msg["publishers"]) {
                    var list = msg["publishers"];
                    Janus.debug(
                      "Got a list of available publishers/feeds:",
                      list
                    );
                    for (var f in list) {
                      var id = list[f]["id"];
                      var display = list[f]["display"];
                      var audio = list[f]["audio_codec"];
                      var video = list[f]["video_codec"];
                      Janus.debug(
                        "  >> [" +
                          id +
                          "] " +
                          display +
                          " (audio: " +
                          audio +
                          ", video: " +
                          video +
                          ")"
                      );
                      self.addParticipant(list[f]["id"], list[f]["display"]);
                      self.vNewRemoteFeed(id, display, audio, video);
                    }
                  } else if (msg["leaving"]) {
                    // One of the publishers has gone away?
                    var leaving = msg["leaving"];
                    console.log("Publisher leaving: " + leaving);
                    self.setState(
                      {
                        feeds: self.state.feeds.filter(
                          (item) => item.rfid != leaving
                        ),
                      },
                      () => console.log("feeds: >>>>", self.state.feeds)
                    );
                    var unPublishedFeed = self.state.feeds.filter(
                      (item) => item.rfid === leaving
                    );
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
                      self.vStreamDettacher(self.state.sfutest);
                      return;
                    }
                    var unPublishedFeed = self.state.feeds.filter(
                      (item) => item.rfid === unpublished
                    );
                    var remoteFeed = unPublishedFeed.shift();
                    if (remoteFeed != null) {          
                      remoteFeed.detach();
                      self.vStreamDettacher(remoteFeed);
                    }
                    self.removeParticipant(unpublished);

                    self.setState({
                      feeds: self.state.feeds.filter(
                        (item) => item.rfid != unpublished
                      ),
                    });

                  } else if (msg["error"]) {
                    if (msg["error_code"] === 426) {
                      // This is a "no such room" error: give a more meaningful description
                    } else {
                    }
                  }
                }
              }
              if (jsep) {
                Janus.debug("Handling SDP as well...", jsep);
                self.state.sfutest.handleRemoteJsep({ jsep: jsep });
              }
            },
            onlocalstream: function (stream) {
              Janus.debug(" ::: Got a local stream :::", stream);
              console.log(" ::: Got a local stream :::", stream);
              console.log(self.state.sfutest.id);
              var exisiting = self.state.feeds.filter(
                (item) => item.id === self.state.sfutest.id
              );
              if (exisiting.length === 0) {
                self.state.sfutest.rfid = self.state.myVroomId;
                self.setState({
                  feeds: self.state.feeds.concat(self.state.sfutest),
                });
              }

              var videoTracks = stream.getVideoTracks();

              if (!videoTracks || videoTracks.length === 0) {
                self.vStreamDettacher(self.state.sfutest);
              } else {
                console.log(self.state.vparticipants);
                self.vStreamAttacher(self.state.sfutest);
              }
            },
            onremotestream: function (stream) {
              // The publisher stream is sendonly, we don't expect anything here
            },
            oncleanup: function () {
              Janus.log(
                " ::: Got a cleanup notification: we are unpublished now :::"
              );
            },
          });
        },
        error: function (error) {
          Janus.error(error);
          //bootbox.alert(error, function() {
          window.location.reload();
          //});
        },
        destroyed: function () {
          window.location.reload();
        },
      });
    },
  });
}

export function vNewRemoteFeed(id, feeds, display, audio, video) {
  var self = this;
  // A new feed has been published, create a new plugin handle and attach to it as a subscriber
  var remoteFeed = null;
  self.state.janus.attach({
    plugin: "janus.plugin.videoroom",
    opaqueId: this.state.opaqueId,
    success: function (pluginHandle) {
      remoteFeed = pluginHandle;
      remoteFeed.simulcastStarted = false;
      Janus.log(
        "Plugin attached! (" +
          remoteFeed.getPlugin() +
          ", id=" +
          remoteFeed.getId() +
          ")"
      );
      Janus.log("  -- This is a subscriber");
      // We wait for the plugin to send us an offer
      var subscribe = {
        request: "join",
        room: 1234,
        ptype: "subscriber",
        pin: self.state.pin,
        feed: id,
        private_id: self.state.mypvtid,
      };
      // In case you don't want to receive audio, video or data, even if the
      // publisher is sending them, set the 'offer_audio', 'offer_video' or
      // 'offer_data' properties to false (they're true by default), e.g.:
      // 		subscribe["offer_video"] = false;
      // For example, if the publisher is VP8 and this is Safari, let's avoid video
      if (
        Janus.webRTCAdapter.browserDetails.browser === "safari" &&
        (video === "vp9" || (video === "vp8" && !Janus.safariVp8))
      ) {
        if (video) video = video.toUpperCase();
        console.log(
          "Publisher is using " +
            video +
            ", but Safari doesn't support it: disabling video"
        );
        subscribe["offer_video"] = false;
      }
      //subscribe["offer_video"] = false;
      //remoteFeed.videoCodec = video;
      remoteFeed.send({ message: subscribe });
    },
    error: function (error) {
      Janus.error("  -- Error attaching plugin...", error);
      window.alert("Error attaching plugin... " + error);
    },
    onmessage: function (msg, jsep) {
      Janus.debug(" ::: Got a message (subscriber) :::", msg);
      var event = msg["videoroom"];
      Janus.log("Event: " + event);

      if (msg["error"]) {
        window.alert(msg["error"]);
      } else if (event) {
        if (event === "attached") {
          remoteFeed.rfid = msg["id"];
          remoteFeed.rfdisplay = msg["display"];
          self.setState({ feeds: self.state.feeds.concat(remoteFeed) }, () => console.log('@@@@', self.state.feeds));
          
          if (!video) {
            self.vStreamDettacher(remoteFeed);
          }

          Janus.log(
            "Successfully attached to feed " +
              remoteFeed.rfid +
              " (" +
              remoteFeed.rfdisplay +
              ") in room " +
              msg["room"]
          );
        } else if (event === "event") {
        } else {
          // What has just happened?
        }
      }
      if (jsep) {
        Janus.log("Handling SDP as well...", jsep);
        remoteFeed.createAnswer({
          jsep: jsep,
          // Add data:true here if you want to subscribe to datachannels as well
          // (obviously only works if the publisher offered them in the first place)
          media: { audioSend: false, videoSend: false, data: false }, // We want recvonly audio/video
          success: function (jsep) {
            Janus.log("Got SDP!", jsep);
            var body = { request: "start", room: self.state.roomId };
            remoteFeed.send({ message: body, jsep: jsep });
          },
          error: function (error) {
            Janus.log("WebRTC error:", error);
            window.alert("WebRTC error... " + error.message);
          },
        });
      }
    },
    iceState: function (state) {
      Janus.log(
        "ICE state of this WebRTC PeerConnection (feed #" +
          remoteFeed.rfid +
          ") changed to " +
          state
      );
    },
    webrtcState: function (on) {
      Janus.log(
        "Janus says this WebRTC PeerConnection (feed #" +
          remoteFeed.rfid +
          ") is " +
          (on ? "up" : "down") +
          " now"
      );
      if (on === "down") {
        self.vremoveParticipant(remoteFeed.rfid);
      }
    },
    onlocalstream: function (stream) {
      console.log(">>>>>>>>>>>", stream);
    },
    onremotestream: function (stream) {
      self.vStreamAttacher(remoteFeed);
    },
    ondata: function (data) {},
    oncleanup: function () {
      Janus.log(" ::: Got a cleanup notification (remote feed " + id + ") :::");
    },
  });
}

export function vregisterUsername(room) {
  var self = this;
  var register = {
    request: "join",
    room: 1234,
    ptype: "publisher",
    //pin: self.state.pin,
    display:
      self.state.fullname +
      " §" +
      self.state.userUUID +
      "§" +
      self.state.userColor +
      "§" + 
      self.state.slot
      ,
  };
  self.state.sfutest.send({ message: register });
  //self.setState({ myVroomId: self.state.mixertest.id });
}

export function vChangeUsername(room) {
  var self = this;
  var register = {
    request: "configure",
    room: 1234,
    ptype: "publisher",
    //pin: self.state.pin,
    display:
      self.state.fullname +
      " §" +
      self.state.userUUID +
      "§" +
      self.state.userColor +
      "§" + 
      self.state.slot
      ,
  };
  self.state.sfutest.send({ message: register });
  //self.setState({ myVroomId: self.state.mixertest.id });
}



export function vStreamAttacher(feed) {
  var self = this;
  console.log("Attaching " + feed.id);
  console.log(this.$$("#video-" + feed.id))
  if (this.$$("#video-" + feed.id).length == 0) {
    var localVideo = document.createElement("video");
    localVideo.autoplay = true;
    localVideo.muted = true;
    localVideo.width = "320";
    localVideo.id = "video-" + feed.id;
    
  }
  $("#video-" + feed.id).show();
  if (feed.id && feed.webrtcStuff && feed.webrtcStuff.remoteStream) {
    self.setState({ vActive: true });
    if (localVideo)
    self.$$("#remoteVideos").append(localVideo);
    Janus.attachMediaStream(
      document.getElementById("video-" + feed.id),
      feed.webrtcStuff.remoteStream
    );
  }
  if (feed.id && feed.webrtcStuff && feed.webrtcStuff.myStream) {
    if (localVideo)
    self.$$("#selfVideos").append(localVideo);
    self.$$("#videoLoaderIcon").hide();
    self.$$("#disableVideo").show();
    Janus.attachMediaStream(
      document.getElementById("video-" + feed.id),
      feed.webrtcStuff.myStream
    );
  }
}

export function vStreamDettacher(feed) {
  if (feed.id) {
    console.log("Dettaching " + feed.id);
    $("#video-" + feed.id).hide();
  }
}

export function vremoveParticipant(id) {
  var self = this;
  self.setState({
    participants: self.state.vparticipants.filter((item) => item.id !== id),
  });
}

export function vaddParticipant(id, p) {
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
        current: "stopped-talking",
      }),
    });
  }
  //console.log("participant added:", participant[1]);
}

export function publishCamera(bitrate = 16) {
  var self = this;
  self.state.sfutest.createOffer({
    media: {
      audioRecv: false,
      videoRecv: false,
      data: false,
      videoSend: true,
      audioSend: false,
      video:{width: 190, height: 135},
    },

    success: function (jsep) {
      Janus.debug("********* Got publisher SDP!", jsep);
      console.log("switching to " + bitrate);
      if (jsep) {
        var publish = {
          request: "configure",
          audio: false,
          video: true,
          //video:{width: 180, height: 180},
          data: false,
          bitrate: bitrate * 8000,
          bitrate_cap: true,
          //videocodec: "vp8",
        };
        self.state.sfutest.send({ message: publish, jsep: jsep });
      }
      self.setState({ publishedCamera: true });
      self.$$("#disableVideo").show();
      console.log('ID: >>>', self.state.sfutest.id)
      socket.emit("ionSetSlot", { slot: self.state.slot, stream: self.state.sfutest.id });
      var tracks = self.state.sfutest.webrtcStuff.myStream.getTracks();
      console.log(tracks);
    },
    error: function (error) {
      Janus.error("***** WebRTC error:", error);
    },
  });
}

export function unPublishCamera() {
  var self = this;
  console.log('unPublishing ..')
  var unpublish = { request: "unpublish" };
	self.state.sfutest.send({ message: unpublish });
  self.vStreamDettacher(self.state.sfutest);
  console.log('ID: >>>', self.state.sfutest.id)
  socket.emit("ionRelSlot", { slot: self.state.slot, stream: self.state.sfutest.id });
  self.setState({ publishedCamera: false, videoState: "initial", slot: null });

  /*
  var self = this;
  self.state.sfutest.createOffer({
      media: {
          audioRecv: false,
          videoRecv: false,
          data: false,
          videoSend: false,
          audioSend: false,
      },

      success: function (jsep) {
          Janus.debug("********* Got publisher SDP!", jsep);
          //console.log('switching to ' + bitrate)
          if (jsep) {
              var publish = {
                  request: "unpublish",
                  audio: false,
                  video: false,
                  data: false,
              };
              self.state.sfutest.send({ message: publish, jsep: jsep });
          }
          self.setState({ publishedCamera: false });
         // self.vStreamDettacher(self.state.sfutest);
          /*
          var tracks = self.state.sfutest.webrtcStuff.myStream.getTracks()
          tracks.forEach(function (track) {
              if (track.kind === "video") {
                  track.stop();
              }
          });
      },
      error: function (error) {
          Janus.error("***** WebRTC error:", error);
      },
  });*/
}

export function vexisitingParticipant(participantId) {
  var self = this;
  var exisiting = self.state.vparticipants.filter(
    (item) => item.uuid === participantId
  );
  if (exisiting.length === 0) {
    return true;
  } else {
    return false;
  }
}

export function vparticipantDisplay(participantId) {
  var self = this;
  var exisiting = self.state.vparticipants.filter(
    (item) => item.uuid === participantId
  );
  if (exisiting.length === 0) {
    return "";
  } else {
    return exisiting[0].display;
  }
}

export function vparticipantChangeStatus(participantId, status) {
  this.setState((prevState) => ({
    talking: {
      ...prevState.talking,
      [participantId]: status,
    },
  }));
}

export function vparticipantChangeRoom(participantId, room) {
  this.setState((prevState) => ({
    participantRoom: {
      ...prevState.participantRoom,
      [participantId]: room,
    },
  }));
}

export function vexitAudioRoom() {
  var self = this;
  if (this.state.mixertest) {
    this.state.mixertest.send({ message: { request: "unpublish" } });
  }
}

export function vPublishBtn() {
  var self = this;
  if (!self.state.publishedCamera) {
  return (
    <a id="enableVideo" fill onClick={() => self.ionRequestRoom()}>
      <div style={{ float: "right", paddingTop: "3px" }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M15 10l4.553 -2.276a1 1 0 0 1 1.447 .894v6.764a1 1 0 0 1 -1.447 .894l-4.553 -2.276v-4z" />
          <rect x="3" y="6" width="12" height="12" rx="2" />
          <line x1="7" y1="12" x2="11" y2="12" />
          <line x1="9" y1="10" x2="9" y2="14" />
        </svg>
      </div>
    </a>
  );
 } else {
    return (
      <a id="disableVideo" onClick={() => self.unPublishCamera()}>
        <div style={{ float: "right", paddingTop: "1px" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <line x1="3" y1="3" x2="21" y2="21" />
            <path d="M15 11v-1l4.553 -2.276a1 1 0 0 1 1.447 .894v6.764a1 1 0 0 1 -.675 .946" />
            <path d="M10 6h3a2 2 0 0 1 2 2v3m0 4v1a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2v-8a2 2 0 0 1 2 -2h1" />
          </svg>
        </div>
      </a>
    );
  }
}
