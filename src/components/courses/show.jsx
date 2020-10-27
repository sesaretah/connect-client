import React, { Component } from 'react';
import {
  Page,
  Navbar,
  List,
  ListItem,
  ListInput,
  Link,
  Tabs,
  Toolbar,
  Tab,
  Range,
  Block,
  Icon, Fab
} from 'framework7-react';
import { dict } from '../../Dict';
import ModelStore from "../../stores/ModelStore";
import * as MyActions from "../../actions/MyActions";
import CourseShow from "../../containers/courses/show"

export default class Layout extends Component {
  constructor() {
    super();
    this.getInstance = this.getInstance.bind(this);
    
    this.state = {
      token: window.localStorage.getItem('token'),
      course: null,
      id: null,
      actuals: null,
      metas: null,
      channels: null,
    }
  }

  componentWillMount() {
    ModelStore.on("got_instance", this.getInstance);
  }

  componentWillUnmount() {
    ModelStore.removeListener("got_instance", this.getInstance);
  }

  componentDidMount() {
    MyActions.getInstance('courses', this.$f7route.params['courseId'], this.state.token);
  }

  getInstance() {
    var course = ModelStore.getIntance()
    var klass = ModelStore.getKlass()
    if (course && klass === 'Course') {
      this.setState({
        course: course,
        id: course.id,
      });
    }
    console.log(course)
  }

  fab() {
    if (this.state.course) {
      return (
        <Fab href={"/courses/" + this.state.course.id + "/edit"} target="#main-view" position="left-bottom" slot="fixed" color="lime">
          <Icon ios="f7:edit" aurora="f7:edit" md="material:edit"></Icon>
          <Icon ios="f7:close" aurora="f7:close" md="material:close"></Icon>
        </Fab>
      )
    }
  }


  render() {
    const { course } = this.state;
    return (
      <Page>
        <Navbar title={dict.courses} backLink={dict.back} />
        {this.fab()}
        <CourseShow course={course} />
      </Page>
    );
  }
}
