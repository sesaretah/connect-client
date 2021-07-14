import React from "react";
import { Page, Navbar, Row, Toolbar, Col, Tab, Icon, Card, Link, CardContent, CardHeader, Tabs, Panel, Block } from 'framework7-react';


import { dict } from '../../Dict';
import Board from "./board";
import Doc from "./doc.jsx";
import Screen from "./screen.jsx";
import Videos from "./videos.jsx";
import Saved from "./saved.jsx";
import Player from "./player.jsx";
import videojs from 'video.js';

const RoomShow = (props) => {
    function current(tab) {
        var result = false
        if (props.currentTab == tab) {
            result = true
        }
        if (!props.currentTab && tab == 'tab-1') {
            result = true
        }
        return result
    }

    function videoCard() {
        var d = 'none'
        if (props.ionActive || props.vActive) {
            d = 'flex'
        } 
        return (
            <Card style={{ display: d, background: '#5d5d5f', borderRadius: '0' }}>
                <CardContent id='videos' style={{minHeight: '210px', display: 'flex', flexWrap: 'wrap'}}>
                    {props.ionVideos()}
                    
                    <div id="remoteVideos" ></div>
                </CardContent>
            </Card>
        )
    }


    function screenCard() {
        var d = 'none'
        if (props.screenActive) {
            d = 'block'
        } 
        return (
            <Card style={{ minHeight: '0px', background: '#5d5d5f', borderRadius: '0' }}>
                <div id='screen' style={{textAlign: 'center'}}>
                    {props.screenVideos()}
                    <div id="remotes"></div>
                </div>
            </Card>
        )
    }

    return (

        <Page id='main-page' >
            <Navbar title={dict.home} >
                <Link panelOpen="right">
                    <Icon f7="bars"></Icon>
                </Link>
            </Navbar>
            {videoCard()}
            
            <Board
                wsSend={props.wsSend}
                line={props.line}
                currentPoint={props.currentPoint}
                uploader={props.uploader}
                progress={props.progress}
                progressShow={props.progressShow}
                upload={props.upload}
                recentUpload={props.recentUpload}
                page={props.page}
                undoVector={props.undoVector}
                revertUndo={props.revertUndo}
                revertTrash={props.revertTrash}
                trash={props.trash}
                userColor={props.userColor}
                participants={props.participants}
                userUUID={props.userUUID}
                uploadedRecently={props.uploadedRecently}
                uploadedRecentlyReset={props.uploadedRecentlyReset}
                remoteStream={props.remoteStream}
                localStream={props.localStream}
                isAdmin={props.isAdmin}
                isPresenter={props.isPresenter}
                isWriter={props.isWriter}

            />
            {screenCard()}
            <div id='mixedaudio'></div>

        </Page>
    )
}
export default RoomShow;
