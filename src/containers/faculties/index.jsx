import React from "react";
import { Page, Navbar, Searchbar, BlockTitle, Subnavbar, Fab, Icon, Link } from 'framework7-react';
import FacultyList from "./list"
import { dict } from '../../Dict';

const FacultyIndex = (props) => {
  return (
    <Page>
      <Navbar title={dict.faculties} backLink={dict.back} >
        <Link panelOpen="right">
          <Icon f7="bars"></Icon>
        </Link>
        <Subnavbar inner={false}>
          <Searchbar
            disableButtonText={dict.cancel}
            placeholder={dict.search}
            onChange={(e) => {
              props.search({ query: e.target.value })
            }}
          ></Searchbar>
        </Subnavbar>
      </Navbar>
      <BlockTitle></BlockTitle>
      <Fab href="/faculties/new" target="#main-view" position="left-bottom" slot="fixed" color="deeporange">
        <Icon ios="f7:add" aurora="f7:add" md="material:add"></Icon>
        <Icon ios="f7:close" aurora="f7:close" md="material:close"></Icon>
      </Fab>
      <FacultyList faculties={props.faculties} />

    </Page>
  )
}
export default FacultyIndex;
