import React, { Component } from 'react';
import { render } from 'react-dom';
import { Page, Navbar, List, ListInput, Row, Col, ListItem, Preloader, Block, CardContent, CardHeader, CardFooter, Button } from 'framework7-react';
import { dict } from '../Dict';
import { Client, LocalStream, RemoteStream } from 'ion-sdk-js';
import { IonSFUJSONRPCSignal } from 'ion-sdk-js/lib/signal/json-rpc-impl';

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
        if (this.state.content) {
            this.throttle(this.state.content, 'chat')
        }

    }

    handleChange(obj) {
        this.setState(obj);
    }

    chatItems() {
        var result = []
        this.props.chats.map((chat) => {
            result.push (
                <ListItem
                    title="Facebook"
                    after="17:14"
                    text={chat}
                ></ListItem>
            )
        })
        return result
    }


    render() {
        return (
            <Page >
                <List noHairlinesMd>
                    <ListInput
                        label={dict.chat}
                        type="textarea"
                        placeholder={dict.write_here}
                        onChange={(e) => {
                            this.handleChange({ content: e.target.value })
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
