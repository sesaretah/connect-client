import React from "react";
import { List,ListItem } from 'framework7-react';
import crypto from 'crypto-js';
import { dict } from "../../Dict";
import Moment from 'react-moment';
import 'moment-timezone';
import 'moment/locale/fa';

const FacultyList = (props) => {

  function item(faculty) {
 //   if (faculty.number_of_meetings && faculty.number_of_meetings > 0) {
      return(
        <ListItem
        key={crypto.lib.WordArray.random(32)}
        link={"/faculties/" + faculty.id}
        title={faculty.id +' - '+ faculty.name}
        after=""
        subtitle=""
        text=""
        >
        </ListItem>
      )
   /* } else {
      return (
        <ListItem
        style={{color: '#c1b3b3'}}
        key={crypto.lib.WordArray.random(32)}
        title={faculty.title}
        after=""
        subtitle=""
        text={dict.number_of_meetings + ': 0'}
        >
        </ListItem>
      )
    }*/
  }
  if (props.faculties) {
    return (
      <List mediaList>
        {props.faculties.map((faculty) =>
 item(faculty)
        )}
      </List>
    )
  } else {
    return (<ul></ul>)
  }
}
export default FacultyList;
