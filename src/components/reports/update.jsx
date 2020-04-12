import React, { Component } from 'react';
import {
  Page,
  Navbar,
  List,
  ListItem,
  ListInput,
  Toggle,
  BlockTitle,
  Row,
  Button,
  Range,
  Block,
  Icon
} from 'framework7-react';
import { dict} from '../../Dict';
import ModelStore from "../../stores/ModelStore";
import * as MyActions from "../../actions/MyActions";
import ReportForm from "../../containers/reports/form"
import Framework7 from 'framework7/framework7.esm.bundle';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import {uploadImageCallBack} from "./uploader.js"

export default class ReportUpdate extends Component {
  constructor() {
    super();
    this.submit = this.submit.bind(this);
    this.setInstance = this.setInstance.bind(this);
    this.getInstance = this.getInstance.bind(this);
    this.handleChangeValue = this.handleChangeValue.bind(this);
    this.onEditorStateChange = this.onEditorStateChange.bind(this)
    this.getList = this.getList.bind(this)
    this.uploadImageCallBack = uploadImageCallBack.bind(this);


    this.state = {
      report: {title: '', draft: ''},
      editorState: EditorState.createEmpty(),
      token: window.localStorage.getItem('token'),
      id: null,
      title: null,
      draft: null,
      page: 0
    }
  }

  componentWillMount() {
    ModelStore.on("got_instance", this.getInstance);
    ModelStore.on("set_instance", this.setInstance);
    ModelStore.on("got_list", this.getList);
  }

  componentWillUnmount() {
    ModelStore.removeListener("got_instance", this.getInstance);
    ModelStore.removeListener("set_instance", this.setInstance);
    ModelStore.removeListener("got_list", this.getList);
  }

  submit(){
    var data = {id: this.state.id, title: this.state.title, draft:convertToRaw(this.state.editorState.getCurrentContent())}
    MyActions.updateInstance('reports', data, this.state.token);
  }

  componentDidMount(){
    this.loadData();
  }

  loadData(){
    const f7: Framework7 = Framework7.instance;
    f7.toast.show({ text: dict.receiving, closeTimeout: 2000, position: 'top'});
    if (this.$f7route.params['reportId']) {
      MyActions.getInstance('reports', this.$f7route.params['reportId'], this.state.token);
    }
  }

  getList() {

  }

  getInstance(){
    var report = ModelStore.getIntance()

    if (report){
      const contentState = convertFromRaw(report.draft);
      const editorState = EditorState.createWithContent(contentState);
      this.setState({
        report: report,
        title: report.title,
        id: report.id,
        editorState: editorState
      });
    }
    console.log(report);
  }

  handleChangeValue(obj) {
    this.setState(obj);
  }

  onEditorStateChange(editorState){
      this.setState({
      editorState,
    });
  };


  setInstance(){
    const self = this;
    this.$f7router.navigate('/reports/');
  }


  render() {
    const { report, editorState} = this.state;
    return (
      <Page>
        <Navbar title="Form" backLink={dict.back} />
        <BlockTitle>{dict.workflow_form}</BlockTitle>
        <ReportForm report={report}  editorState={editorState} onEditorStateChange={this.onEditorStateChange} submit={this.submit}  handleChange={this.handleChangeValue} uploadImageCallBack={this.uploadImageCallBack}/>
      </Page>
    );
  }
}
