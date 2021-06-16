import React, { Component } from 'react';
import { render } from 'react-dom';
import { Page, Navbar, List, ListInput, Card, Row, Col, Preloader, Block, CardContent, CardHeader, CardFooter, Button } from 'framework7-react';
import { dict } from '../../Dict';
import { conf } from "../../conf";

class Player extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this)
        this.throttle = this.throttle.bind(this)
        this.send = this.send.bind(this)

        this.state = {
            lastTime: Date.now(),
            srcLink: null,
            counter: 0,
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.srcLink !== this.props.srcLink) {
            this.setState({ counter: this.state.counter + 1 }, () => {
                console.log(this.state.counter)
            });
        }
    }

    componentWillUnmount() {

    }




    componentDidMount() {

    }

    handleChange(obj) {
        this.setState(obj);
    }

    throttle(c, t) {
        if (Date.now() - this.state.lastTime > 100) {
            this.setState({ lastTime: Date.now() }, () => {
                this.props.wsSend({ type: t, c: c })
            })
        }
    }
    send() {
        if (this.state.srcLink) {
            this.throttle(this.state.srcLink, 'srcLink')
            this.props.appendLink(this.state.srcLink)
            this.$$('#link-form').val('')
            this.setState({ counter: this.state.counter + 1 })
        }

    }

    share() {
        if (this.props.isAdmin) {
            return (
                <React.Fragment>
                    <List >
                        <ListInput
                            inputId='link-form'
                            label={dict.frame_link}
                            type="text"
                            placeholder={dict.write_here}
                            onChange={(e) => {
                                this.handleChange({ srcLink: e.target.value })
                            }} />

                    </List>
                    <Button fill onClick={() => this.send()}>{dict.submit}</Button>
                </React.Fragment>
            )
        }
    }

    header() {
        if (this.props.isAdmin) {
            return (
                <CardHeader>
                    {this.share()}
                </CardHeader>
            )
        } else {
            return (null)
        }
    }

    render() {
        return (
            <Card>
                {this.header()}
                <CardContent>
                    <div style={{ textAlign: 'center', marginTop: '12px' }}>
                        <iframe key={this.state.counter} class='frame' height="454" width="718" src={this.props.srcLink} frameborder="0" allowfullscreen="" title="Wysiwyg Embedded Content"></iframe>
                    </div>
                </CardContent>
            </Card>
        );
    }
}
export default Player;