import React from "react";
import { Page, Navbar, Row, Toolbar, Col, Tab, Icon, Card, Link, CardContent, CardHeader, Tabs, Panel, Block } from 'framework7-react';


import { dict } from '../../Dict';
import Board from "./board";
import Doc from "./doc.jsx";

import Screen from "./screen.jsx";

const RoomShow = (props) => {
    function current(tab) {
        var result = false
        if(props.currentTab == tab) {
            result = true
        }
        if (!props.currentTab && tab == 'tab-1') {
            result = true
        }
        return result
    }
    return (

        <Page >
            <Navbar title={dict.home} >
                <Link panelOpen="right">
                    <Icon f7="bars"></Icon>
                </Link>
            </Navbar>
            <Toolbar tabbar top>
                <Link tabLink="#tab-1" tabLinkActive={current('tab-1')} onClick={() => props.wsSend({type: 'tab', current: 'tab-1'})}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M20 17v-12c0 -1.121 -.879 -2 -2 -2s-2 .879 -2 2v12l2 2l2 -2z" /><path d="M16 7h4" /><path d="M18 19h-13a2 2 0 1 1 0 -4h4a2 2 0 1 0 0 -4h-3" /></svg>
                </Link>
                <Link tabLink="#tab-2" tabLinkActive={current('tab-2')} onClick={() => props.wsSend({type: 'tab', current: 'tab-2'})}>
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" /><line x1="9" y1="9" x2="10" y2="9" /><line x1="9" y1="13" x2="15" y2="13" /><line x1="9" y1="17" x2="15" y2="17" /></svg>
                </Link>
                <Link tabLink="#tab-3" tabLinkActive={current('tab-3')} onClick={() => props.wsSend({type: 'tab', current: 'tab-3'})}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M21 12v3a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-10a1 1 0 0 1 1 -1h9" /><line x1="7" y1="20" x2="17" y2="20" /><line x1="9" y1="16" x2="9" y2="20" /><line x1="15" y1="16" x2="15" y2="20" /><path d="M17 4h4v4" /><path d="M16 9l5 -5" /></svg>
                </Link>
                <Link tabLink="#tab-4" tabLinkActive={current('tab-4')} onClick={() => props.wsSend({type: 'tab', current: 'tab-4'})}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M15 10l4.553 -2.276a1 1 0 0 1 1.447 .894v6.764a1 1 0 0 1 -1.447 .894l-4.553 -2.276v-4z" /><rect x="3" y="6" width="12" height="12" rx="2" /></svg>

                </Link>
            </Toolbar>
            <Tabs>
                <Tab id="tab-1" tabActive={current('tab-1')}>
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
                        ></Board>
                </Tab>
                <Tab id="tab-2" tabActive={current('tab-2')}>
                    <Doc 
                        wsSend={props.wsSend} 
                        quillDelta={props.quillDelta} 
                        cursorRange={props.cursorRange}
                        client={props.client}
                        typing={props.typing}
                        name={props.name}
                        newCursor={props.newCursor}
                        newComerLength={props.newComerLength}
                        contentSync={props.contentSync}
                        newComerReset={props.newComerReset}
                        userColor={props.userColor}
                        />
                </Tab>
                <Tab id="tab-3" tabActive={current('tab-3')}>
                    <Screen />
                </Tab>
                <Tab id="tab-4"  tabActive={current('tab-4')}>
                    4
            </Tab>
            </Tabs>

        </Page>
    )
}
export default RoomShow;
