import React from "react";
import { Toggle, AccordionContent, Card, CardHeader, CardContent, List, ListItem, CardFooter, ListInput, Col } from 'framework7-react';
import crypto from 'crypto-js';
import { dict } from "../../Dict";
import Moment from 'react-moment';
import JDate from 'jalali-date';
import 'moment-timezone';
import 'moment/locale/fa';
import InvolvementList from "./involvementList";
import SimpleList from "../profiles/simpleList";

const Partcipants = (props) => {
    function editable() {
        if (props.editable) {
            return (
                <List accordionList className='w-100'>
                    <ListItem accordionItem className='fs-10' title={"+ " + dict.add}>
                        <AccordionContent>
                            <List simpleList>
                                {props.task.groups.map((group) =>
                                    <ListItem>
                                        <span>{group.title}</span>
                                        <Toggle onChange={(e) => props.addGroup(e,group.id)}/>
                                    </ListItem>
                                )}
                            </List>
                            <List >
                                <ListInput
                                    outline
                                    label={dict.search}
                                    floatingLabel
                                    type="text"
                                    placeholder=""
                                    clearButton
                                    onInput={(e) => {
                                        props.searchProfile({ query: e.target.value })
                                    }}
                                />
                            </List>
                            <SimpleList profiles={props.profiles} addProfile={props.addProfile} />
                        </AccordionContent>
                    </ListItem>
                </List>
            )
        }
    }
    if (props.task) {
        return (
            <Card>
                <CardHeader>
                    {dict.coworkers}
                </CardHeader>
                <CardContent className='mh-90'>
                    <List>
                        <InvolvementList
                            involvements={props.task.the_involvements} removeProfile={props.removeProfile}
                            changeRole={props.changeRole} editable={props.editable}
                        />
                    </List>
                </CardContent>
                <CardFooter>
                    {editable()}
                </CardFooter>
            </Card>
        )
    } else {
        return (<ul></ul>)
    }
}
export default Partcipants;
