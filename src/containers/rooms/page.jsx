import React from "react";
import { List, ListItem, Button, Icon } from 'framework7-react';
import { dict } from '../../Dict';
import RoomShow from "./show";

const LoadedPage = (props) => {
    if (props.action) {
        console.log('props =>>>', props)
        switch (props.action) {
            case 'room':
                return (<RoomShow
                    wsSend={props.wsSend}
                    line={props.line}
                    currentTab={props.currentTab}
                    currentPoint={props.currentPoint}
                    quillDelta={props.quillDelta}
                    cursorRange={props.cursorRange}
                    client={props.client}
                    typing={props.typing}
                    newCursor={props.newCursor}
                    name={props.name}
                    newComerLength={props.newComerLength}
                    contentSync={props.contentSync}
                    newComerReset={props.newComerReset}
                    uploader={props.uploader}
                    progress={props.progress}
                    progressShow={props.progressShow}
                    upload={props.upload}
                    recentUpload={props.recentUpload}
                    page={props.page}
                    undoVector={props.undoVector}
                    revertUndo={props.revertUndo}
                    trash={props.trash}
                    revertTrash={props.revertTrash}
                    userColor={props.userColor}
                    participants={props.participants}
                    userUUID={props.userUUID}
                    uploadedRecently={props.uploadedRecently}
                    uploadedRecentlyReset={props.uploadedRecentlyReset}
                    remoteStream={props.remoteStream}
                    localStream={props.localStream}
                />)
                break;
            case 'rooms':
                return (<div></div>)
                break;
        }
    }
    else {
        return (<div></div>)
    }
}
export default LoadedPage;
