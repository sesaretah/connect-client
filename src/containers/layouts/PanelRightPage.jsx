import React, { Component } from 'react';
import { Link, NavRight, Row, Button, Page, Navbar, Block, BlockTitle, List, ListItem, Popup, ListInput, Col, Icon } from 'framework7-react';
import { dict } from '../../Dict';
import ModelStore from "../../stores/ModelStore";
import * as MyActions from "../../actions/MyActions";

export default class PanelRightPage extends Component {
  constructor() {
    super();
    this.logout = this.logout.bind(this);
    this.getInstance = this.getInstance.bind(this);
    this.check_ability = this.check_ability.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.login = this.login.bind(this);
    this.signUp = this.signUp.bind(this);
    this.setInstance = this.setInstance.bind(this);
    this.logged_in = this.logged_in.bind(this);



    this.state = {
      token: window.localStorage.getItem('token'),
      ability: null,
      popupOpened: false,
      password: null,
      email: null,
      domains: null,
    }
  }

  logout() {
    this.setState({ token: null });
    window.localStorage.removeItem('token');
    window.location.replace('/')
  }

  componentWillMount() {
    ModelStore.on("got_instance", this.getInstance);
    ModelStore.on("set_instance", this.setInstance);
  }

  componentWillUnmount() {
    ModelStore.removeListener("got_instance", this.getInstance);
    ModelStore.removeListener("set_instance", this.setInstance);
  }

  componentDidMount() {
    if (this.state.token && this.state.token.length > 10) {
      MyActions.getInstance('users', 'role', this.state.token);
    }
    console.log('>>>>>>>>>>>>>>>>>', this.props)
  }

  getInstance() {
    var user = ModelStore.getIntance()
    var klass = ModelStore.getKlass()
    if (user && klass === 'UserRole') {
      console.log(user)
      this.setState({
        ability: user.the_ability
      });
    }

  }


  setInstance() {
    var klass = ModelStore.getKlass()
    if (klass === 'Login') {
      this.$f7router.navigate('/');
      window.location.reload()
    }
    if (klass === 'SignUp') {
      this.$f7router.navigate('/');
      window.location.reload()
    }
    //console.log(klass)
  }

  check_ability(a, link, icon) {
    var result = []
    if (this.state.ability) {
      this.state.ability.map((ab) => {
        if (ab.title === a && ab.value) {
          result.push(
            <ListItem link={"/" + link + "/"} ignoreCache={true} key={'panel' + link} view="#main-view" panelClose>
              <i className={"va ml-5 fa fa-" + icon}></i>
              <span>{dict[link]}</span>
            </ListItem>
          )
        }
      })
    }
    return result
  }

  handleChange(obj) {
    this.setState(obj);
  }

  login() {
    var data = { email: this.state.email, password: this.state.password }
    MyActions.setInstance('users/login', data);
  }

  signUp() {
    var data = { email: this.state.email, password: this.state.password, domains: this.state.domains }
    MyActions.setInstance('users/sign_up', data);
  }

  logged_in(token) {
    if (token) {
      return (
        <List className='fs-13 z-1'>
          <ListItem link="/courses/" view="#main-view" panelClose>
            <i className="va ml-5 fa fa-list"></i>
            <span>{dict.courses}</span>
          </ListItem>


          <ListItem link="/sections/" view="#main-view" panelClose>
            <i className="va ml-5 fa fa-list"></i>
            <span>{dict.sections}</span>
          </ListItem>
        </List>
      )
    }
  }

  loginBtn(token) {
    console.log(token)
    if (!token) {
      return (<Button fill className="br-0 external f-color-black bg-teal" href="https://auth.ut.ac.ir:8443/cas/login?service=https%3A%2F%2Fkian.ut.ac.ir%2Fusers%2Fservice">{dict.login}</Button>)
    } else {
      return (<Button fill className="br-0" onClick={() => this.logout()}>{dict.logout}</Button>)
    }
  }

  participants() {
    console.log('>>>>>>>', this.props.participants)
    if(this.props.participants) {
      var array = []
      this.props.participants.map((participant) => {
        array.push(<ListItem link="/" view="#main-view" panelClose>
        <i className="va ml-5 fa fa-home"></i>
        <span>{participant.display}</span>
      </ListItem>)
      })
    }
  }


  render() {
    const { token, email, password } = this.state;
    return (
      <Page >
        <div className='icon-bar '>
          <div className='icon-circle'>
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 7h10v6a3 3 0 0 1 -3 3h-4a3 3 0 0 1 -3 -3v-6" /><line x1="9" y1="3" x2="9" y2="7" /><line x1="15" y1="3" x2="15" y2="7" /><path d="M12 16v2a2 2 0 0 0 2 2h3" /></svg>
          </div>
        </div>

        <React.Fragment>
          <BlockTitle className="mr-"> <i className="va ml-5 fa fa-tachometer"></i>{dict.dashboard}</BlockTitle>
          <List className='fs-13 z-1'>
            <ListItem link="/" view="#main-view" panelClose>
              <i className="va ml-5 fa fa-home"></i>
              <span>{dict.home}</span>
            </ListItem>
            {this.participants()}
          </List>

          {this.logged_in(this.state.token)}
          <Button panelOpen="left">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1" /><line x1="12" y1="12" x2="12" y2="12.01" /><line x1="8" y1="12" x2="8" y2="12.01" /><line x1="16" y1="12" x2="16" y2="12.01" /></svg>
          </Button>


        </React.Fragment>
        {this.loginBtn(this.state.token)}

      </Page>
    );
  }
}