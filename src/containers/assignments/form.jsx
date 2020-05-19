import React from "react";
import { List, ListItem, BlockTitle, Block, Row, Button,Link } from 'framework7-react';
import { dict } from '../../Dict';
import UserOptions from "../users/options";

const AssignmentForm = (props) => {
  return (
    <React.Fragment>
      <BlockTitle>{dict.assignment_form}</BlockTitle>
      <List inset>
        <ListItem
          title={dict.email}
          smartSelect
        >
          <select name="content"
            onChange={(e) => { props.handleChange({ user_id: e.target.value }) }}>
            <UserOptions users={props.users} />
          </select>
        </ListItem>
      </List>
      <Block strong inset>
        <Row tag="p">
          <Link className="btn-notice"></Link>
          <Button className="col btn" fill onClick={props.submit}>{dict.submit}</Button>
        </Row>
      </Block>
    </React.Fragment>
  )
}
export default AssignmentForm;
