import React from "react";
import { Page, List, ListItem, Button, Link, Popover } from 'framework7-react';

const Right = (props) => {
  function microphone(participant) {
    if (participant.uuid === props.userUUID && (props.isPresenter || props.isSpeaker)) {
      if (props.muted) {
        return (
          <div className='right-icon' >
            <a onClick={() => props.toggleMicrophone()}>
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line x1="3" y1="3" x2="21" y2="21" /><path d="M9 5a3 3 0 0 1 6 0v5a3 3 0 0 1 -.13 .874m-2 2a3 3 0 0 1 -3.87 -2.872v-1" /><path d="M5 10a7 7 0 0 0 10.846 5.85m2.002 -2a6.967 6.967 0 0 0 1.152 -3.85" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
            </a>
          </div>)
      } else {
        return (
          <div className='right-icon' >
            <a onClick={() => props.toggleMicrophone()} style={{ color: 'white' }}>
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><rect x="9" y="2" width="6" height="11" rx="3" /><path d="M5 10a7 7 0 0 0 14 0" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
            </a>
          </div>)
      }
    }
  }
  function video(participant) {
    if (participant.uuid === props.userUUID) {
      return (
        <div className='right-icon-1' >
          {props.vPublishBtn()}
          <div id='videoLoaderIcon' className="loader" style={{ display: 'none' }}></div>
        </div>
      )
    }
  }

  function screen(participant) {
    if (participant.uuid === props.userUUID && props.isPresenter) {
      return (
        <div className='right-icon-2' >
          {props.screenPublishBtn()}
        </div>
      )
    }
  }

  function talking(participant) {
    if (props.talking[participant.id]) {
      return (
        <div className='right-icon-4' >
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18 8a3 3 0 0 1 0 6" /><path d="M10 8v11a1 1 0 0 1 -1 1h-1a1 1 0 0 1 -1 -1v-5" /><path d="M12 8h0l4.524 -3.77a0.9 .9 0 0 1 1.476 .692v12.156a0.9 .9 0 0 1 -1.476 .692l-4.524 -3.77h-8a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h8" /></svg>
        </div>
      )
    } else {
      return (null)
    }
  }

  function raise(participant) {
    if ((!props.isAdmin && participant.uuid === props.userUUID) || (props.isAdmin && participant.uuid !== props.userUUID)) {
      return (
        <div className='right-icon-3' style={{ marginTop: '3px', marginLeft: '9px' }}>
          <a onClick={() => handRaise(participant)} style={{ color: isRaised(participant) }}>
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="15" height="15" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M8 13v-7.5a1.5 1.5 0 0 1 3 0v6.5" /><path d="M11 5.5v-2a1.5 1.5 0 1 1 3 0v8.5" /><path d="M14 5.5a1.5 1.5 0 0 1 3 0v6.5" /><path d="M17 7.5a1.5 1.5 0 0 1 3 0v8.5a6 6 0 0 1 -6 6h-2h.208a6 6 0 0 1 -5.012 -2.7a69.74 69.74 0 0 1 -.196 -.3c-.312 -.479 -1.407 -2.388 -3.286 -5.728a1.5 1.5 0 0 1 .536 -2.022a1.867 1.867 0 0 1 2.28 .28l1.47 1.47" /></svg>
          </a>
        </div>
      )
    }
  }

  function kick(participant) {
    if (participant.uuid !== props.userUUID && props.isPresenter) {
      return (
        <div className='right-icon-5' >
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><circle cx="13" cy="4" r="1" /><line x1="7" y1="21" x2="10" y2="17" /><path d="M16 21l-2 -4l-3 -3l1 -6" /><path d="M6 12l2 -3l4 -1l3 3l3 1" /></svg>
        </div>
      )
    }
  }

  function enableMicrophone(participant) {
    if (participant.uuid !== props.userUUID && props.isPresenter) {
      return (
        <div className='right-icon' >
          <a onClick={() => props.toggleRole(participant.uuid, 'speaker')} style={{ color: isActive(participant, 'speaker') }}>
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><rect x="9" y="2" width="6" height="11" rx="3" /><path d="M5 10a7 7 0 0 0 14 0" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
          </a>
        </div>)
    }
  }


  function propagateVideo(participant) {
    if (participant.uuid !== props.userUUID && props.isAdmin  ) {
      //console.log(props.participantRoom)
      return (
        <div className='right-icon-6' >
          <a onClick={() => props.wsSend({ type: 'joinRoom', c: props.participantRoom[participant.uuid] }, 'all')} >
           m
          </a>
          <a onClick={() => props.wsSend({ type: 'leaveRoom', c:props.participantRoom[participant.uuid] }, 'all')}>
           x
          </a>
        </div>)
    }
  }

  function write(participant) {
    if (participant.uuid !== props.userUUID && props.isPresenter) {
      return (
        <div className='right-icon-2' >
          <a onClick={() => props.toggleRole(participant.uuid, 'writer')} style={{ color: isActive(participant, 'writer') }}>
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4" /><line x1="13.5" y1="6.5" x2="17.5" y2="10.5" /></svg>
          </a>
        </div>
      )
    }
  }




  function presenter(participant) {
    if (participant.uuid !== props.userUUID && props.isAdmin) {
      return (
        <div className='right-icon-1' >
          <a onClick={() => props.toggleRole(participant.uuid, 'presenter')} style={{ color: isActive(participant, 'presenter') }}>
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line x1="3" y1="4" x2="21" y2="4" /><path d="M4 4v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-10" /><line x1="12" y1="16" x2="12" y2="20" /><line x1="9" y1="20" x2="15" y2="20" /><path d="M8 12l3 -3l2 2l3 -3" /></svg>
          </a>
        </div>
      )
    } else {
      return (null)
    }
  }

  function isActive(participant, role) {
    if (props.participantRole(participant.uuid) === role) {
      return ('#8ff597')
    } else {
      return ('#d4b9a3')
    }
  }

  function isRaised(participant) {
    if (props.handRaised(participant.uuid)) {
      return ('#8ff597')
    } else {
      return ('#d4b9a3')
    }
  }

  function handRaise(participant) {
    if (participant.uuid === props.userUUID) {
      if(!props.handRaised(participant.uuid)) {
        props.wsSend({ type: 'handRaise', c: {status: 'raised', raiserUUID: participant.uuid} })
        props.handRaise({status: 'raised', raiserUUID: participant.uuid})
      } else {
        props.wsSend({ type: 'handRaise', c: {status: 'down', raiserUUID: participant.uuid} })
        props.handRaise({status: 'down', raiserUUID: participant.uuid})
      }

    }
  }

  function roomNumber(participant) {
    if (participant.uuid === props.userUUID && props.currentSlot){
      return('(' + props.currentSlot + ')')
    }
  }



  function participants() {
    if (props.participants) {
      var result = []
      props.participants.map((participant) => {
        if (participant.display) {
          result.push(<ListItem >
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill={participant.userColor} stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><circle cx="12" cy="7" r="4" /><path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /></svg>
            <span>
              {participant.display}
              {roomNumber(participant)}
            </span>
            {talking(participant)}{microphone(participant)}{video(participant)}
            {screen(participant)}{presenter(participant)}{raise(participant)}
            {write(participant)}{enableMicrophone(participant)}
            {propagateVideo(participant)}
          </ListItem>)
        }
      })
    }
    return result
  }

  return (
    <Page onPageAfterIn={props.pageAfterIn()} >
      <div style={{ display: 'flex', height: 'max-content'}}>
      <div className='icon-bar '>
        <div className='icon-circle'>
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 7h10v6a3 3 0 0 1 -3 3h-4a3 3 0 0 1 -3 -3v-6" /><line x1="9" y1="3" x2="9" y2="7" /><line x1="15" y1="3" x2="15" y2="7" /><path d="M12 16v2a2 2 0 0 0 2 2h3" /></svg>
        </div>
        <div className='icon-circle'>
          <a>
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M20 17v-12c0 -1.121 -.879 -2 -2 -2s-2 .879 -2 2v12l2 2l2 -2z" /><path d="M16 7h4" /><path d="M18 19h-13a2 2 0 1 1 0 -4h4a2 2 0 1 0 0 -4h-3" /></svg>
          </a>
        </div>
        <div className='icon-circle'>
          <a className={props.ionActive ? 'fc-white' : ''}>
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M15 10l4.553 -2.276a1 1 0 0 1 1.447 .894v6.764a1 1 0 0 1 -1.447 .894l-4.553 -2.276v-4z" /><rect x="3" y="6" width="12" height="12" rx="2" /></svg>
          </a>
        </div>

        <div className='icon-circle'>
        <Link id='xxx' className={props.screenActive ? 'fc-white' : ''}>
        <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M21 12v3a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-10a1 1 0 0 1 1 -1h9" /><line x1="7" y1="20" x2="17" y2="20" /><line x1="9" y1="16" x2="9" y2="20" /><line x1="15" y1="16" x2="15" y2="20" /><path d="M17 4h4v4" /><path d="M16 9l5 -5" /></svg>

        </Link>
        </div>

        <div className='icon-circle'>
          <a className={props.screenActive ? 'fc-white' : ''}>
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="12" r="5" /><line x1="15.9" y1="20.11" x2="15.9" y2="20.12" /><line x1="19.04" y1="17.61" x2="19.04" y2="17.62" /><line x1="20.77" y1="14" x2="20.77" y2="14.01" /><line x1="20.77" y1="10" x2="20.77" y2="10.01" /><line x1="19.04" y1="6.39" x2="19.04" y2="6.4" /><line x1="15.9" y1="3.89" x2="15.9" y2="3.9" /><line x1="12" y1="3" x2="12" y2="3.01" /><line x1="8.1" y1="3.89" x2="8.1" y2="3.9" /><line x1="4.96" y1="6.39" x2="4.96" y2="6.4" /><line x1="3.23" y1="10" x2="3.23" y2="10.01" /><line x1="3.23" y1="14" x2="3.23" y2="14.01" /><line x1="4.96" y1="17.61" x2="4.96" y2="17.62" /><line x1="8.1" y1="20.11" x2="8.1" y2="20.12" /><line x1="12" y1="21" x2="12" y2="21.01" /></svg>
          </a>
        </div>

        <div className='icon-circle'>
          <Button panelOpen="left" className={props.chatActive ? 'fc-white mr--5' : 'mr--5'} onClick={() => props.chatDeactive()} style={{ textOverflow: "clip" }}>
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1" /><line x1="12" y1="12" x2="12" y2="12.01" /><line x1="8" y1="12" x2="8" y2="12.01" /><line x1="16" y1="12" x2="16" y2="12.01" /></svg>
          </Button>
        </div>
        <div className='icon-circle'>
          <a onClick={() => props.logout()} className='fc-white'>
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5.64 5.632a9 9 0 1 0 6.36 -2.632v7.714" /></svg>
          </a>
        </div>


      </div>

    <div style={{float: 'right', width: '230px', minHeight: '100vh'}}>
    <div id="selfVideos" style={{marginBottom: '10px', minHeight: '80px', marginTop: '20px', textAlign: 'center'}}></div>
      <List className='fs-13 z-1 '>
      
      </List>
      <List className='fs-13'>
        {participants()}

      </List>

      </div>
      </div>

      <Popover className="popover-menu">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vel quam et metus dictum auctor. Morbi vestibulum neque mauris, eget egestas lacus congu
    </Popover>

    </Page>
  )
}
export default Right;
