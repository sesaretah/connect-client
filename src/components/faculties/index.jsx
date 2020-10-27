import React from "react"
import { Page,Fab, Icon } from 'framework7-react';
import ModelStore from "../../stores/ModelStore";
import FacultyIndex from "../../containers/faculties/index"
import * as MyActions from "../../actions/MyActions";
import { dict} from '../../Dict';
import Framework7 from 'framework7/framework7.esm.bundle';


export default class Layout extends React.Component {
  constructor() {
    super();
    this.getList = this.getList.bind(this);
    this.search = this.search.bind(this);
    
    this.state = {
      token: window.localStorage.getItem('token'),
      faculties: null,
      query: null,
    }
  }
  componentWillMount() {
    ModelStore.on("got_list", this.getList);
  }

  componentWillUnmount() {
    ModelStore.removeListener("got_list", this.getList);
  }

  componentDidMount(){
    this.loadData();
  }

  loadData(){
    MyActions.getList('courses/faculties', this.state.page, {}, this.state.token);
  }

  search(obj){
    this.setState(obj, () => {
      MyActions.getList('faculties/search', this.state.page, {q: this.state.query}, this.state.token);
  });    
  }

  getList() {
    var faculties = ModelStore.getList()
    var klass = ModelStore.getKlass()
    if (faculties && klass === 'Faculty'){
      this.setState({
        faculties: faculties,
      });
      console.log(faculties)
    }
  }

  render() {
    const {faculties} = this.state;
    return(<FacultyIndex faculties={faculties} search={this.search}/>)
  }
}
