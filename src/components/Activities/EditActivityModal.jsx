import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import ActivityModal from './ActivityModal';

class EditActivityModal extends Component {
  constructor(props) {
    super(props);
    let weekStart = new Date(props.activity.WeekOf);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    this.state = {
      activity: this.props.activity,
      validated: false,
      selectedDate: weekStart,
      highlightDates: EditActivityModal.getWeek(weekStart)
    }
  }

  static getDerivedStateFromProps(newProps, oldState) {
    if (newProps.activity !== oldState.activity) {
      let weekStart = new Date(newProps.activity.WeekOf);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      return {
        activity: newProps.activity,
        selectedDate: weekStart,
        highlightDates: EditActivityModal.getWeek(weekStart)
      };
    }
    return null;
  }

  closeActivity(e) {
    //reset form fields
    this.setState({
      activity: {},
      validated: false
    });

    //callback parent
    this.props.closeEditActivity(e);
  }

  // Syncs fields between react state and form
  updateActivity(e, field) {
    const activity = this.state.activity;
    activity[field] = e.target.value;
    this.setState({ activity });
  }

  validateActivity(e) {
    const form = document.getElementById("EditActivityModal");
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      this.setState({ validated: true });
    } else {
      this.props.submitEditActivity(e, this.state.activity)
      this.setState({ validated: false, activity: {} })
    }
  }

  static getWeek(weekStart) {
    let week = [];
    for (let i = 0; i < 7; ++i) {
      week.push(new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + i, 0, 0, 0, 0));
    }
    return week;
  }

  onDateChange(date) {
    let selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay(), 0, 0, 0, 0);
    let highlightDates = EditActivityModal.getWeek(selectedDate);
    let activity = this.state.activity;
    activity.InputWeekOf = selectedDate;
    this.setState({ activity, selectedDate, highlightDates });
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
            <DatePicker
              selected={this.state.selectedDate}
              onChange={date => this.onDateChange(date)}
              highlightDates={this.state.highlightDates}
              maxDate={new Date()}
              inline
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
              <option>OZIC</option>
              <option>OZIF</option>
              <option>OZIP</option>
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
            <Form.Control.Feedback type="invalid">
              Enter a title with no trailing period.
            </Form.Control.Feedback>
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
            <Form.Control.Feedback type="invalid">
              Enter at least one item of interest.
            </Form.Control.Feedback>
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
            <Form.Control.Feedback type="invalid">
              You must have at least one OPR.
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </ActivityModal>
    );
  }
}

export default EditActivityModal;