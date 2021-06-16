import React, { Component } from 'react';
import { render } from 'react-dom';
import { Page, Navbar, List, BlockTitle, Card, Fab, Icon, Preloader, Block, CardContent, CardHeader, CardFooter, Button } from 'framework7-react';
import { dict } from '../../Dict';
import { Client, LocalStream, RemoteStream } from 'ion-sdk-js';
import { IonSFUJSONRPCSignal } from 'ion-sdk-js/lib/signal/json-rpc-impl';

class Rooms extends Component {
    constructor(props) {
        super(props);


        this.state = {
        }
    }

    componentDidUpdate(prevProps) {

    }

    componentDidMount() {
    }

    render() {
        return (
            <Page>
                <Navbar title={dict.home} >
                    <Link panelOpen="right">
                        <Icon f7="bars"></Icon>
                    </Link>
                </Navbar>
            </Page>
        );
    }
}
export default Rooms;