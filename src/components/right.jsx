import React from "react";
import { Page, BlockTitle, List, ListItem, Button, Tab, Icon, Card, Link, CardContent, CardHeader, Tabs, Panel, Block } from 'framework7-react';


import { dict } from '../Dict';

const Right = (props) => {
  function microphone(participant) {
    if (participant.uuid === props.userUUID) {
      if (!props.muted) {
        return (
          <div className='right-icon' >
            <a onClick={() => props.toggleMicrophone()}>
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line x1="3" y1="3" x2="21" y2="21" /><path d="M9 5a3 3 0 0 1 6 0v5a3 3 0 0 1 -.13 .874m-2 2a3 3 0 0 1 -3.87 -2.872v-1" /><path d="M5 10a7 7 0 0 0 10.846 5.85m2.002 -2a6.967 6.967 0 0 0 1.152 -3.85" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
            </a>
          </div>)
      } else {
        return (
          <div className='right-icon' >
            <a onClick={() => props.toggleMicrophone()} style={{color: 'white'}}>
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><rect x="9" y="2" width="6" height="11" rx="3" /><path d="M5 10a7 7 0 0 0 14 0" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
            </a>
          </div>)
      }
    }
  }
  function participants() {
    //console.log('>>>>>>>', props.participants)
    if (props.participants) {
      var result = []
      props.participants.map((participant) => {
        result.push(<ListItem >
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><circle cx="12" cy="7" r="4" /><path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /></svg>
          <span>{participant.display}</span>
          {microphone(participant)}
        </ListItem>)
      })
    }
    return result
  }

  return (
    <Page >
      <div className='icon-bar '>
        <div className='icon-circle'>
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 7h10v6a3 3 0 0 1 -3 3h-4a3 3 0 0 1 -3 -3v-6" /><line x1="9" y1="3" x2="9" y2="7" /><line x1="15" y1="3" x2="15" y2="7" /><path d="M12 16v2a2 2 0 0 0 2 2h3" /></svg>
        </div>
      </div>

      <BlockTitle className="mr-2"> <i className="va ml-5 fa fa-tachometer"></i>{dict.dashboard}</BlockTitle>
      <List className='fs-13 z-1'>
        <ListItem link="/" view="#main-view" panelClose>
          <i className="va ml-5 fa fa-home"></i>
          <span>{dict.home}</span>
        </ListItem>

      </List>
      <List className='fs-13 z-1'>
        {participants()}
      </List>


      <Button panelOpen="left">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1" /><line x1="12" y1="12" x2="12" y2="12.01" /><line x1="8" y1="12" x2="8" y2="12.01" /><line x1="16" y1="12" x2="16" y2="12.01" /></svg>
      </Button>




    </Page>
  )
}
export default Right;
