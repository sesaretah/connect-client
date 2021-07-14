import React from "react";
import { Page, LoginScreenTitle, List, ListInput, Button, BlockFooter, Icon, Card, Link, CardContent, CardHeader, Tabs, Panel, Block } from 'framework7-react';


import { dict } from '../Dict';

const Login = (props) => {
    function isSigningUp(block) {
        if (props.signingUp) {
            if (block == 'name') {
                return (
                    <ListInput
                        label={dict.name}
                        className='fs-14'
                        type="text"
                        placeholder="Your username"
                        value={props.name}
                        onInput={(e) => {
                            props.handleChangeValue({ name: e.target.value });
                        }}
                    />
                )
            }
            if (block == 'passwordConfirmation') {
                return (
                    <ListInput
                        label={dict.password_confirmation}
                        type="text"
                        className='fs-14'
                        placeholder="Password Confirmation"
                        value={props.passwordConfirmation}
                        onInput={(e) => {
                            props.handleChangeValue({ passwordConfirmation: e.target.value });
                        }}
                    />
                )
            }
        }
    }

    function loginButton() {
        if (props.signingUp) {
            return (
                <React.Fragment>
                    <Button fill onClick={props.login}>{dict.sign_up}</Button>
                    <BlockFooter>
                        <a onClick={props.loginActive}>{dict.you_can_login}</a>
                    </BlockFooter>
                </React.Fragment>
            )
        } else {
            return (
                <React.Fragment>
                    <Button fill onClick={props.login}>{dict.login}</Button>
                    <BlockFooter>
                        <a onClick={props.signUp}>{dict.you_can_sign_up}</a>
                    </BlockFooter>
                </React.Fragment>
            )
        }
    }

    function casButton() {
        return (
            <Button fill className='fs-11 external f-color-black bg-teal' href="https://auth.ut.ac.ir:8443/cas/login?service=https%3A%2F%2Fconnect.ut.ac.ir%2Fusers%2Fservice" animate={false} ignoreCache={true}>{dict.cas} </Button>

        )
    }
    return (
        <Page loginScreen>
            <LoginScreenTitle> </LoginScreenTitle>
            <List form>
                <ListInput
                    label={dict.email}
                    className='fs-14'
                    type="text"
                    placeholder="Your email"
                    value={props.email}
                    onInput={(e) => {
                        props.handleChangeValue({ email: e.target.value });
                    }}
                />
                {isSigningUp('name')}
                <ListInput
                    label={dict.password}
                    type="text"
                    className='fs-14'
                    placeholder="Password"
                    value={props.password}
                    onInput={(e) => {
                        props.handleChangeValue({ password: e.target.value });
                    }}
                />
                {isSigningUp('passwordConfirmation')}
            </List>
            <List>
                {loginButton()}
            </List>
            <List>
                {casButton()}
            </List>
        </Page>
    )
}
export default Login;
