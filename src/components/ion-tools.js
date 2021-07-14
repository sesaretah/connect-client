import React, { Component } from "react";
import { Button } from "framework7-react";
import { dict } from "../Dict";
import { Client, LocalStream, RemoteStream } from "ion-sdk-js";
import { IonSFUJSONRPCSignal } from "ion-sdk-js/lib/signal/json-rpc-impl";
import { conf } from "../conf";
import { socket } from "./socket.js";

export function ionSessionCreate(room) {
  var config = {
    iceServers: [
      {url: "stun:stun.l.google.com:19302"},
      {
        url: "turn:sync1.ut.ac.ir:3478",
        username: 'shafiei',
        credential: '12345678'
    
      }
    ]
  };

  var self = this;

  var signal = new IonSFUJSONRPCSignal(conf.ionSignalServer);

  self.setState({ config: config, signal: signal }, () => {
    var client = new Client(self.state.signal, self.state.config);
    var clientExists = self.state.clients.filter((item) => item.room === room);
    //console.log("clientExists: ", clientExists);
    if (clientExists.length == 0) {
      self.setState(
        { clients: self.state.clients.concat({ room: room, client: client }) },
        () => {
          console.log(self.state.clients)
          self.state.signal.onopen = () => {
            //var cl = self.state.clientLocal[self.state.clientLocal.length - 1];
            var cl = self.state.clients.filter((item) => item.room === room);
            cl[0].client.join("room" + room);
            cl[0].client.ontrack = (track, stream) => {
              //console.log(track, stream);
              console.log("got track", track.id, "for stream", stream.id);
              if (track.kind === "video" && stream) {
                track.onunmute = () => {
                  var exists = self.state.streams.filter(
                    (item) => item.id === stream.id
                  );
                  if (exists.length == 0) {
                    stream["room"] = "room" + room;
                    self.setState(
                      {
                        streams: self.state.streams.concat(stream),
                        ionActive: true,
                      },
                      () => {
                        console.log("Streams are ...", self.state.streams);
                      }
                    );
                  }

                  stream.onremovetrack = () => {
                    console.log("Stream owner left");
                    self.setState(
                      {
                        streams: self.state.streams.filter(
                          (item) => item.id !== stream.id
                        ),
                      },
                      () => {
                        if (
                          self.state.streams.length == 0 &&
                          !self.state.media
                        ) {
                          self.setState({ ionActive: false });
                        }
                      }
                    );

                    self.$$("#remoteVideos").remove();
                    self.$$("#videos").append("<div id='remoteVideos'></div>");
                  };
                };
              }
            };
          };
        }
      );
    }
  });
}

export function ionStart() {
  var self = this;
  LocalStream.getUserMedia({
    resolution: "vga",
    codec: 'vp8',
    video: true,
    video: { width: 180, height: 180, facingMode: "user", frameRate: { min: 15, max: 20 } },
    audio: false,
    simulcast: false
  })
    .then((media) => {
      self.setState({ media: media, ionActive: true });
      var localVideo = document.createElement("video");
      localVideo.srcObject = media;
      localVideo.autoplay = true;
      localVideo.muted = true;
      localVideo.width = "320";
      var cl = self.state.clients.filter(
        (item) => item.room === self.state.slot
      );
      cl[0].client.publish(media);
      console.log(media);
      self.$$("#selfVideos").append(localVideo);
      self.$$("#videoLoaderIcon").hide();
      self.$$("#disableVideo").show();

      socket.emit("ionSetSlot", { slot: this.state.slot, stream: media.id });
      media.getVideoTracks()[0].onended = function () {
        self.ionUnPublish();
      };
    })
    .catch(console.error);
}

export function ionVideos() {
  var self = this;
  var result = [];
  if (this.state.streams) {
    this.state.streams.map((stream) => {
      console.log("Attaching to stream ...", stream);
      if (self.state.media && stream.id === self.state.media.id) {
      } else {
        if (this.$$("#" + stream.id).length == 0) {
          var remoteVideo = document.createElement("video");
          remoteVideo.srcObject = stream;
          remoteVideo.autoplay = true;
          remoteVideo.muted = true;
          remoteVideo.width = "320";
          remoteVideo.id = stream.id;
          console.log("Trying to attach to", stream.id);

          this.$$("#remoteVideos").append(remoteVideo);
        }
      }
    });

    return result;
  }
}

export function ionUnPublish() {
  var self = this;
  this.state.media.unpublish();
  this.state.media.getTracks().forEach((track) => track.stop());
  this.$$("#selfVideos").remove();
  this.$$("#videos").prepend("<div id='selfVideos'></div>");
  socket.emit("ionRelSlot", { stream: this.state.media.id });
  this.setState({ media: null }, () => {
    if (self.state.streams.length == 0 && !self.state.media) {
      self.setState({ ionActive: false, videoState: "initial" });
    }
  });

  this.setState({ videoState: "initial", slot: null });
  self.leaveRoom(self.state.slot);
}

export function ionPublishBtn() {
  var self = this;

  if (!self.state.media) {
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
      <a id="disableVideo" onClick={() => self.ionUnPublish()}>
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

export function ionDisplay(event) {
  console.log(event.target.value);
  this.setState({ display: event.target.value }, () => {
    console.log("Display:" + this.state.display);
  });
}

export function leaveRoom(room) {
  var self = this;
  //var cl = self.state.clientLocal[self.state.clientLocal.length - 1];
  //cl.leave("room" + room);
  var cl = self.state.clients.filter((item) => item.room === room);
  cl[0].client.leave("room" + room);
  console.log("leaving room " + room);
  var streams = self.state.streams.filter(
    (item) => item.room === "room" + room
  );
  console.log(streams);
  for (let i = 0; i < streams.length; i++) {
    console.log(streams[i].id);
    this.$$("#" + streams[i].id).remove();
  }
  self.setState({
    streams: self.state.streams.filter((item) => item.room !== "room" + room),
  });
  self.setState({
    clients: self.state.clients.filter((item) => item.room !== room),
  });
}

export function screenSessionCreate() {
  var self = this;
  var config = {
    iceServers: [
      {url: "stun:stun.l.google.com:19302"},
      {
        url: "turn:sync1.ut.ac.ir:3478",
        username: 'shafiei',
        credential: '12345678'
    
      }
    ]
  };

  var screenSignal = new IonSFUJSONRPCSignal(conf.ionSignalServer);

  self.setState({ screenConfig: config, screenSignal: screenSignal }, () => {
    var screenClientLocal = new Client(
      self.state.screenSignal,
      self.state.screenConfig
    );
    self.setState({ screenClientLocal: screenClientLocal }, () => {
      self.state.screenSignal.onopen = () =>
        self.state.screenClientLocal.join("screen room");
      self.state.screenClientLocal.ontrack = (track, stream) => {
        console.log("got track", track.id, "for stream", stream.id);
        if (track.kind === "video") {
          track.onunmute = () => {
            var exists = self.state.screenStreams.filter(
              (item) => item.id === stream.id
            );
            if (exists.length == 0) {
              self.setState(
                {
                  screenStreams: self.state.screenStreams.concat(stream),
                  screenActive: true,
                },
                () => {
                  // self.scrollTo('#screen')
                }
              );
            }
            //self.scrollTo('#screen')
            stream.onremovetrack = () => {
              console.log("Stream owner left");
              self.setState(
                {
                  screenStreams: self.state.screenStreams.filter(
                    (item) => item.id !== stream.id
                  ),
                },
                () => {
                  if (
                    self.state.screenStreams.length == 0 &&
                    !self.state.screenMedia
                  ) {
                    self.setState({ screenActive: false });
                  }
                }
              );
              self.$$("#remotes").remove();
              self.$$("#screen").append("<div id='remotes'></div>");
            };
          };
        }
      };
    });
  });
}

export function screenStart() {
  var self = this;
  LocalStream.getDisplayMedia({
    resolution: "vga",
    frameRate: 15,
    audio: false,
  })
    .then((media) => {
      console.log(media);
      this.setState({ screenMedia: media, screenActive: true });
      var localVideo = document.createElement("video");
      localVideo.srcObject = media;
      localVideo.autoplay = true;
      localVideo.muted = true;
      localVideo.width = this.$$("#screen").width() - 20;
      this.state.screenClientLocal.publish(media);
      this.$$("#remotes").append(localVideo);
      media.getVideoTracks()[0].onended = function () {
        self.screenUnPublish();
      };
      self.scrollTo("#screen");
    })
    .catch(console.error);
}

export function screenVideos() {
  var self = this;
  var result = [];
  if (this.state.screenStreams) {
    this.state.screenStreams.map((stream) => {
      if (this.$$("#" + stream.id).length == 0) {
        console.log("Going to show", stream.id);
        var remoteVideo = document.createElement("video");
        remoteVideo.srcObject = stream;
        remoteVideo.autoplay = true;
        remoteVideo.muted = true;
        remoteVideo.width = this.$$("#screen").width() - 20;
        remoteVideo.id = stream.id;
        this.$$("#remotes").append(remoteVideo);
        self.scrollTo("#screen");
      }
    });

    return result;
  }
}

export function screenUnPublish() {
  var self = this;
  this.state.screenMedia.unpublish();
  this.state.screenMedia.getTracks().forEach((track) => track.stop());
  this.$$("#remotes").remove(this.state.screenMedia.id);
  this.$$("#screen").append("<div id='remotes'></div>");
  this.setState({ screenMedia: null }, () => {
    if (self.state.screenStreams.length == 0 && !self.state.screenMedia) {
      self.setState({ screenActive: false });
    }
  });
}

export function screenPublishBtn() {
  if (!this.state.screenMedia) {
    return (
      <a fill onClick={() => this.screenStart()}>
        <div style={{ float: "right", paddingTop: "5px" }}>
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
            <path d="M21 12v3a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-10a1 1 0 0 1 1 -1h9" />
            <line x1="7" y1="20" x2="17" y2="20" />
            <line x1="9" y1="16" x2="9" y2="20" />
            <line x1="15" y1="16" x2="15" y2="20" />
            <path d="M17 4h4v4" />
            <path d="M16 9l5 -5" />
          </svg>
        </div>
      </a>
    );
  } else {
    return (
      <a onClick={() => this.screenUnPublish()}>
        <div style={{ float: "right", paddingTop: "5px" }}>
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
            <path d="M21 12v3a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-10a1 1 0 0 1 1 -1h9" />
            <line x1="7" y1="20" x2="17" y2="20" />
            <line x1="9" y1="16" x2="9" y2="20" />
            <line x1="15" y1="16" x2="15" y2="20" />
            <path d="M17 8l4 -4m-4 0l4 4" />
          </svg>
        </div>
      </a>
    );
  }
}
