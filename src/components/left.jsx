import React, { Component } from 'react';
import { render } from 'react-dom';
import { Page, Navbar, List, ListInput, Row, Col, ListItem, Preloader, Block, CardContent, CardHeader, CardFooter, Button } from 'framework7-react';
import { dict } from '../Dict';
import { Client, LocalStream, RemoteStream } from 'ion-sdk-js';
import { IonSFUJSONRPCSignal } from 'ion-sdk-js/lib/signal/json-rpc-impl';
import { uuid } from 'uuidv4';

import moment from 'moment'

class Left extends Component {
    constructor(props) {
        super(props);

        this.throttle = this.throttle.bind(this)
        this.send = this.send.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.chatItems = this.chatItems.bind(this)


        this.state = {
            lastTime: Date.now(),
            content: null,
            item: null,
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.chats !== this.props.chats) {
            console.log(this.props.chats)
        }
    }

    componentDidMount() {
    }


    throttle(c, t) {
        if (Date.now() - this.state.lastTime > 100) {
            this.setState({ lastTime: Date.now() }, () => {
                this.props.wsSend({ type: t, c: c })
            })
        }
    }
    send() {
        if (this.state.item) {
            this.throttle(this.state.item, 'chat')
            this.props.appendChat(this.state.item)
            this.$$('#chat-form').val('')
            this.props.chatDeactive()
        }

    }

    handleChange(obj) {
        this.setState(obj);
    }

    chatItems() {
        var result = []
        this.props.chats.slice(0).reverse().map((chat) => {
            console.log(chat)
            result.push(
                <div class="item-content">
                    <div class="item-inner">
                        <div class="item-title-row">
                            <div class="item-title" style={{fontSize: '10px'}}>
                                {chat.name}
                            </div>
                            <div class="item-after">
                                <span>{moment(chat.time).fromNow()}</span>
                            </div>
                        </div>
                        <div class="item-text mh-auto" style={{overflow: 'auto'}}>
                            {chat.content}
                        </div>
                    </div>
                </div>
            )
        })
        return result
    }


    render() {
        return (
            <Page >
                <List noHairlinesMd>
                    <ListInput
                        inputId='chat-form'
                        label={dict.chat}
                        type="textarea"
                        placeholder={dict.write_here}
                        onChange={(e) => {
                            this.handleChange({ item: { content: e.target.value, name: this.props.name, time: Date.now(), uuid: uuid() } })
                        }} />
                </List>
                <Row>
                    <Col>

                    </Col>
                    <Col>

                    </Col>
                    <Col>
                        <Button fill onClick={() => this.send()}>{dict.send}</Button>
                    </Col>
                </Row>
                <List mediaList>
                    {this.chatItems()}
                </List>



            </Page>
        );
    }
}
export default Left;
