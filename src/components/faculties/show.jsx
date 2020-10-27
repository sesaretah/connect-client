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
import FacultyShow from "../../containers/faculties/show"

export default class Layout extends Component {
  constructor() {
    super();
    this.getInstance = this.getInstance.bind(this);
    
    this.state = {
      token: window.localStorage.getItem('token'),
      courses: null,
      assets:  null,
      total_assets: null,
      resource: null,
      quiz: null,
      assignment: null,
      onlineCourseCount: null,
      onlineCourseDuration: null,
      activity: null,
      id: null,
      name: null,
      bbOnlineCourseCount: null,
      bbOnlineCourseDuration: null,
    }
  }

  componentWillMount() {
    ModelStore.on("got_instance", this.getInstance);
  }

  componentWillUnmount() {
    ModelStore.removeListener("got_instance", this.getInstance);
  }

  componentDidMount() {
    MyActions.getInstance('courses/faculties', this.$f7route.params['facultyId'], this.state.token);
  }

  getInstance() {
    var faculty = ModelStore.getIntance()
    var klass = ModelStore.getKlass()
    if (faculty && klass === 'Faculty') {
      this.setState({
        courses: faculty.faculty_courses,
        assets: faculty.faculty_assets,
        id: faculty.id,
        name: faculty.name,
        quiz: faculty.most_quiz,
        total_assets: faculty.total_assets,
        resource: faculty.most_resource,
        assignment: faculty.most_assignment,
        activity: faculty.most_activity,
        onlineCourseCount: faculty.most_online_course_count,
        onlineCourseDuration: faculty.most_online_course_duration,
        bbOnlineCourseCount: faculty.most_bb_online_course_count,
        bbOnlineCourseDuration: faculty.most_bb_online_course_duration,
      });
    }
    console.log(faculty)    
  }



  render() {
    const { 
      id, courses, assets, total_assets , quiz, name,
      resource, assignment, onlineCourseCount, onlineCourseDuration, 
      activity, bbOnlineCourseCount, bbOnlineCourseDuration} = this.state;
    return (
      <Page>
        <Navbar title={dict.faculties} backLink={dict.back} />
        <FacultyShow 
          id={id} courses={courses} name={name} assignment={assignment} 
          onlineCourseCount={onlineCourseCount} activity={activity} 
          onlineCourseDuration={onlineCourseDuration} quiz={quiz} 
          resource={resource} assets={assets} total_assets={total_assets}
          bbOnlineCourseCount={bbOnlineCourseCount}
          bbOnlineCourseDuration={bbOnlineCourseDuration}
          />
      </Page>
    );
  }
}
