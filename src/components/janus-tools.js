import Janus from "../janus.js";
export function sessionCreate() {
    var self = this;
    Janus.init({
        debug: "all",
        callback: function () {
            var janus = new Janus(
                {
                    server: self.state.server,
                    success: function () {
                        // Attach to AudioBridge plugin
                        janus.attach(
                            {
                                plugin: "janus.plugin.audiobridge",
                                opaqueId: self.state.opaqueId,
                                success: function (pluginHandle) {
                                    //$('#details').remove();
                                    self.setState({ mixertest: pluginHandle });
                                    Janus.log("Plugin attached! (" + self.state.mixertest.getPlugin() + ", id=" + self.state.mixertest.getId() + ")");
                                    self.registerUsername();
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
                                    Janus.debug("Consent dialog should be " + (on ? "on" : "off") + " now");
                                },
                                iceState: function (state) {
                                    Janus.log("ICE state changed to " + state);
                                },
                                mediaState: function (medium, on) {
                                    Janus.log("Janus " + (on ? "started" : "stopped") + " receiving our " + medium);
                                },
                                webrtcState: function (on) {
                                    Janus.log("Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now");
                                },
                                onmessage: function (msg, jsep) {
                                    Janus.debug(" ::: Got a message :::", msg);
                                    var event = msg["audiobridge"];
                                    Janus.debug("Event: " + event);
                                    if (event) {
                                        if (event === "joined") {
                                            // Successfully joined, negotiate WebRTC now
                                            if (msg["id"]) {
                                                self.setState({
                                                    myid: msg["id"],
                                                });
                                                Janus.log("Successfully joined room " + msg["room"] + " with ID " + self.state.myid);
                                                self.addParticipant(msg["id"], self.state.fullname + '§' + self.state.userUUID);
                                                if (!self.state.webrtcUp) {
                                                    self.setState({ webrtcUp: true });
                                                    // Publish our stream
                                                    self.state.mixertest.createOffer(
                                                        {
                                                            media: { video: false,  audio: { echoCancellation: true } },	// This is an audio only room
                                                            success: function (jsep) {
                                                                Janus.debug("Got SDP!", jsep);
                                                                var publish = { request: "configure", muted: false };
                                                                self.state.mixertest.send({ message: publish, jsep: jsep });
                                                            },
                                                            error: function (error) {
                                                                Janus.error("WebRTC error:", error);
                                                                // bootbox.alert("WebRTC error... " + error.message);
                                                            }
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
                                                    console.log('%%%%%%%%',list[f] )
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
                                            Janus.log("Moved to room " + msg["room"] + ", new ID: " + self.state.myid);
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

                                                    self.addParticipant(msg["id"], self.state.fullname + '§' + self.state.userUUID);

                                                    Janus.debug("  >> [" + id + "] " + display + " (setup=" + setup + ", muted=" + muted + ")");
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
                                            if (msg["participants"]) {
                                                var list = msg["participants"];
                                                Janus.debug("Got a list of participants:", list);
                                                for (var f in list) {
                                                    var id = list[f]["id"];
                                                    var display = list[f]["display"];
                                                    var setup = list[f]["setup"];
                                                    var muted = list[f]["muted"];
                                                    Janus.debug("  >> [" + id + "] " + display + " (setup=" + setup + ", muted=" + muted + ")");
                                                    console.log('%%%%%%%%',list[f] )
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
                                                Janus.log("Participant left: " + leaving  + " elements with ID #rp" + leaving + ")");
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
                                    if (self.$$('#roomaudio').length === 0) {
                                        self.$$('#mixedaudio').append('<audio class="rounded centered" id="roomaudio" width="100%" height="100%" autoplay/>');
                                        Janus.attachMediaStream(document.getElementById('roomaudio'), stream);
                                    }
                                },
                                oncleanup: function () {
                                    //  webrtcUp = false;
                                    Janus.log(" ::: Got a cleanup notification :::");
                                    //$('#participant').empty().hide();
                                    //$('#list').empty();
                                    //$('#mixedaudio').empty();
                                    //$('#room').hide();
                                }
                            });
                    },
                    error: function (error) {
                        //   Janus.error(error);
                        console.log(error)
                    },
                    destroyed: function () {
                        window.location.reload();
                    }
                });
        },
    });
}

export function registerUsername() {
    var self = this;
    var register = {
        request: "join",
        room: 1234,
        display: self.state.fullname + " §" + self.state.userUUID,
    };
    self.state.mixertest.send({ message: register });
}

export function addParticipant(id, p) {
    console.log('Adding Participants ...', id, p)
    var self = this;
    var participant = p.split('§')
    if (this.exisitingParticipant(participant[1])) {
        self.setState({ participants: self.state.participants.concat({ id: id, display: participant[0], uuid: participant[1], role: 'listener' }) });
    }
    console.log('participant added:', participant[1])
}

export function exisitingParticipant(participantId) {
    var self = this;
    var exisiting = self.state.participants.filter(
        (item) => item.uuid === participantId
    );
    if (exisiting.length === 0) {
        return true
    } else {
        return false
    }
}