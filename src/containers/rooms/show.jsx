import React from "react";
import { Page, Navbar, Row, Toolbar, Col, Tab, Icon, Card, Link, CardContent, CardHeader, Tabs } from 'framework7-react';


import { dict } from '../../Dict';
import Board from "./board";

const RoomShow = (props) => {

    return (
        <Page >
            <Navbar title={dict.home} >
                <Link panelOpen="right">
                    <Icon f7="bars"></Icon>
                </Link>
            </Navbar>
            <Toolbar tabbar top>
                <Link tabLink="#tab-1" tabLinkActive>
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M20 17v-12c0 -1.121 -.879 -2 -2 -2s-2 .879 -2 2v12l2 2l2 -2z" /><path d="M16 7h4" /><path d="M18 19h-13a2 2 0 1 1 0 -4h4a2 2 0 1 0 0 -4h-3" /></svg>
                </Link>
                <Link tabLink="#tab-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M21 12v3a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-10a1 1 0 0 1 1 -1h9" /><line x1="7" y1="20" x2="17" y2="20" /><line x1="9" y1="16" x2="9" y2="20" /><line x1="15" y1="16" x2="15" y2="20" /><path d="M17 4h4v4" /><path d="M16 9l5 -5" /></svg>
                </Link>
                <Link tabLink="#tab-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M15 10l4.553 -2.276a1 1 0 0 1 1.447 .894v6.764a1 1 0 0 1 -1.447 .894l-4.553 -2.276v-4z" /><rect x="3" y="6" width="12" height="12" rx="2" /></svg>

                </Link>
            </Toolbar>
            <Tabs>
                <Tab id="tab-1"  tabActive>
                    <Board></Board>
                </Tab>
                <Tab id="tab-2" >
                    3
            </Tab>
                <Tab id="tab-3"  >
                    4
            </Tab>
            </Tabs>
        </Page>
    )
}
export default RoomShow;
