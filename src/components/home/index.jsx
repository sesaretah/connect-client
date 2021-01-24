import React, { Component } from 'react';
import { NavLeft, Link, Page, Navbar, Icon, Row, Col, Card } from 'framework7-react';
import { dict } from '../../Dict';
import ModelStore from "../../stores/ModelStore";
import * as MyActions from "../../actions/MyActions";
import Framework7 from 'framework7/framework7.esm.bundle'
import HomeContent from "../../containers/home/index"
import board from "../../board.js";

export default class HomePage extends Component {
  constructor() {
    super();
    this.getList = this.getList.bind(this);
    

    this.state = {
      token: window.localStorage.getItem('token'),
      bbMeetingHistogram: null,
      meetingHistogram: null,
      hourMeetingHistogram: null,
    }
  }


  componentWillMount() {
    ModelStore.on("got_multiple_list", this.getList);
  }

  componentWillUnmount() {
    ModelStore.removeListener("got_multiple_list", this.getList);
  }

  componentDidMount() {
    MyActions.getMultipleList('/home', this.state.page, {}, this.state.token);
  }


  getList() {
    var home = ModelStore.getMutipleList()
    var klass = ModelStore.getKlass()
    if (home && klass === 'Home') {
      this.setState({
        meetingHistogram: home.meeting_histogram,
        hourMeetingHistogram: home.hour_meeting_histogram,
        bbMeetingHistogram: home.bb_meeting_histogram
      });
    }
  }
 

  render() {
    const { 
      meetingHistogram, bbMeetingHistogram, 
      hourMeetingHistogram
     } = this.state;
    return (<HomeContent 
      bbMeetingHistogram={bbMeetingHistogram}
      meetingHistogram={meetingHistogram}
      hourMeetingHistogram={hourMeetingHistogram}
       />)
  }
}