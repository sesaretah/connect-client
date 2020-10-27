import React from "react";
import { Page, Navbar, Searchbar, BlockTitle, Subnavbar, Fab, Icon, Link } from 'framework7-react';
import CourseList from "./list"
import { dict } from '../../Dict';

const CourseIndex = (props) => {
  return (
    <Page>
      <Navbar title={dict.courses} backLink={dict.back} >
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
      <Fab href="/courses/new" target="#main-view" position="left-bottom" slot="fixed" color="deeporange">
        <Icon ios="f7:add" aurora="f7:add" md="material:add"></Icon>
        <Icon ios="f7:close" aurora="f7:close" md="material:close"></Icon>
      </Fab>
      <CourseList courses={props.courses} />

    </Page>
  )
}
export default CourseIndex;
