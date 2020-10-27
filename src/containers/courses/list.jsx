import React from "react";
import { List,ListItem } from 'framework7-react';
import crypto from 'crypto-js';
import { dict } from "../../Dict";
import Moment from 'react-moment';
import 'moment-timezone';
import 'moment/locale/fa';

const CourseList = (props) => {

  function item(course) {
 //   if (course.number_of_meetings && course.number_of_meetings > 0) {
      return(
        <ListItem
        key={crypto.lib.WordArray.random(32)}
        link={"/courses/" + course.id}
        title={course.title + ' (' + course.serial +')'}
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
        title={course.title}
        after=""
        subtitle=""
        text={dict.number_of_meetings + ': 0'}
        >
        </ListItem>
      )
    }*/
  }
  if (props.courses) {
    return (
      <List mediaList>
        {props.courses.map((course) =>
 item(course)
        )}
      </List>
    )
  } else {
    return (<ul></ul>)
  }
}
export default CourseList;
