import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import moment from 'moment';
import ActivityModal from './ActivityModal';

class EditActivityModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activity: this.props.activity,
      validated: false
    }
  }

  static getDerivedStateFromProps(newProps, oldState) {
    if (newProps.activity !== oldState.activity) {
      return { activity: newProps.activity };
    }
    return null;
  }

  closeActivity(e) {
    //reset form fields
    this.setState({activity: {}, validated: false});
    
    //callback parent
    this.props.closeEditActivity(e);
  }

  // Syncs fields between react state and form
  updateActivity(e, field) {
    const activity = this.state.activity;
    activity[field] = e.target.value;
    this.setState({activity});
  }

  validateActivity(e) {
    const form = document.getElementById("EditActivityModal");
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      this.setState({validated: true});
    } else {
      this.props.submitEditActivity(e, this.state.activity)
      this.setState({validated: false, activity: {}})
    }
  }

  render() {
    return (
      <ActivityModal
        modalDisplayName="Activity"
        show={this.props.showEditModal}
        handleClose={e => this.closeActivity(e)}
        handleSubmit={e => this.validateActivity(e)}
        saving={this.props.saving}
        error={this.props.error}
      >
        <Form disabled={this.props.saving} id="EditActivityModal" noValidate validated={this.state.validated}
          onSubmit={e => this.validateActivity(e)}
        >
          <Form.Group controlId="editActivityWeekOf">
            <Form.Label>Period of Accomplishment</Form.Label>
            <Form.Control
              type="date"
              defaultValue={this.props.activity.InputWeekOf}
              value={this.state.InputWeekOf}
              max={moment().day(6).format('YYYY-MM-DD')}
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
              placeholder="Title with no trailing period"
              defaultValue={this.props.activity.Title}
              value={this.state.Title}
              onChange={(e) => this.updateActivity(e, 'Title')}
              required
            />
          </Form.Group>
          <Form.Group controlId="editActivityInterestItems">
            <Form.Label>Specific items of interest</Form.Label>
            <Form.Control as="textarea" rows="5"
              placeholder="Items of interest..."
              defaultValue={this.props.activity.InterestItems}
              value={this.state.InterestItems}
              onChange={(e) => this.updateActivity(e, 'InterestItems')}
              required
            />
          </Form.Group>
          <Form.Group controlId="editActivityActionItems">
            <Form.Label>Action items</Form.Label>
            <Form.Control 
              type="text"
              placeholder="Informational."
              defaultValue={this.props.activity.ActionItems}
              value={this.state.ActionItems}
              onChange={(e) => this.updateActivity(e, 'ActionItems')}
              required
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
              required
            />
          </Form.Group>
        </Form>
      </ActivityModal>
    );
  }
}

export default EditActivityModal;