import React, { Component } from 'react';
import { Menu, MenuItem, MenuDropdown, MenuDropdownItem, Page, Navbar, Block, BlockTitle, List, ListItem, FabButton, FabButtons, Fab, Icon } from 'framework7-react';
import { dict } from '../../Dict';
import ModelStore from "../../stores/ModelStore";
import * as MyActions from "../../actions/MyActions";

export default class PanelRightPage extends Component {
  constructor() {
    super();
    this.logout = this.logout.bind(this);
    this.getInstance = this.getInstance.bind(this);
    this.check_ability = this.check_ability.bind(this);


    this.state = {
      token: window.localStorage.getItem('token'),
      ability: null,
    }
  }

  logout() {
    this.setState({ token: null });
    window.localStorage.removeItem('token');
    window.location.replace('/')
  }

  componentWillMount() {
    ModelStore.on("got_instance", this.getInstance);
  }

  componentWillUnmount() {
    ModelStore.removeListener("got_instance", this.getInstance);
  }

  componentDidMount() {
    if (this.state.token && this.state.token.length > 10) {
      MyActions.getInstance('users', 'role', this.state.token);
    }
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



  render() {
    const { token } = this.state;
    return (
      <Page >
        <Navbar title={dict.kian} />
        <React.Fragment>
          <BlockTitle> <i className="va ml-5 fa fa-tachometer"></i>{dict.dashboard}</BlockTitle>
          <List className='fs-13'>
          <ListItem link="/courses/" view="#main-view" panelClose>
              <i className="va ml-5 fa fa-home"></i>
              <span>{dict.home}</span>
            </ListItem>


            <ListItem link="/courses/" view="#main-view" panelClose>
              <i className="va ml-5 fa fa-list"></i>
              <span>{dict.courses}</span>
            </ListItem>

            <ListItem link="/faculties/" view="#main-view" panelClose>
              <i className="va ml-5 fa fa-list"></i>
              <span>{dict.faculties}</span>
            </ListItem>
          </List>

        </React.Fragment>
      </Page>
    );
  }
}