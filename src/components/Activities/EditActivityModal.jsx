import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import ActivityModal from './ActivityModal';

class EditActivityModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activity: {}
    }
    this.state.activity = Object.assign({}, this.props.activity);  //deep copy
  }

  closeActivity(e) {
    //reset form fields
    let activity = Object.assign({}, this.props.activity);  //deep copy
    this.setState({activity});
    
    //callback parent
    this.props.closeEditActivity(e);
  }

  // Syncs fields between react state and form
  updateActivity(e, field) {
    const activity = this.state.activity;
    activity[field] = e.target.value;
    this.setState({activity});
  }

  render() {
    return (
      <ActivityModal
        modalDisplayName="Activity"
        show={this.props.showEditModal}
        handleClose={e => this.closeActivity(e)}
        handleSubmit={e => this.props.submitEditActivity(e, this.state.activity)}
      >
        <Form onSubmit={e => this.props.submitEditActivity(e, this.state.activity)}>
          <Form.Group controlId="editActivityWeekOf">
            <Form.Label>Period of Accomplishment</Form.Label>
            <Form.Control
              type="date"
              defaultValue={this.props.activity.InputWeekOf}
              value={this.state.InputWeekOf}
              onChange={(e) => this.updateActivity(e, 'InputWeekOf')}
            />
          </Form.Group>
          <Form.Group controlId="editActivityOrg">
            <Form.Label>Organization</Form.Label>
            <Form.Control as="select"
              defaultValue={this.props.activity.Branch}
              value={this.state.Branch}
              onChange={(e) => this.updateActivity(e, 'Branch')}
            >
              <option>--</option>
              <option>OZI</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="editActivityTitle">
            <Form.Label>Activity/Purpose</Form.Label>
            <Form.Control
              type="text"
              defaultValue={this.props.activity.Title}
              value={this.state.Title}
              onChange={(e) => this.updateActivity(e, 'Title')}
            />
          </Form.Group>
          <Form.Group controlId="editActivityInterestItems">
            <Form.Label>Specific items of interest</Form.Label>
            <Form.Control as="textarea" rows="5"
              defaultValue={this.props.activity.InterestItems}
              value={this.state.InterestItems}
              onChange={(e) => this.updateActivity(e, 'InterestItems')}
            />
          </Form.Group>
          <Form.Group controlId="editActivityActionItems">
            <Form.Label>Action items</Form.Label>
            <Form.Control 
              type="text"
              defaultValue={this.props.activity.ActionItems}
              value={this.state.ActionItems}
              onChange={(e) => this.updateActivity(e, 'ActionItems')}
            />
          </Form.Group>
          <Form.Group controlId="editActivityOPRs">
            {//TODO Convert to people picker
            }
            <Form.Label>OPRs</Form.Label>
            <Form.Control 
              type="text"
              defaultValue={this.props.activity.TextOPRs}
              value={this.state.TextOPRs}
              onChange={(e) => this.updateActivity(e, 'TextOPRs')}
            />
          </Form.Group>
        </Form>
      </ActivityModal>
    );
  }
}

export default EditActivityModal;