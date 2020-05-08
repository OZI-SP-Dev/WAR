import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import DateUtilities from '../../utilities/DateUtilities';
import ActivityModal from './ActivityModal';
import { ActivityPeoplePicker } from './ActivityPeoplePicker';

class EditActivityModal extends Component {
  constructor(props) {
    super(props);
    let weekStart = DateUtilities.getStartOfWeek(new Date(this.props.activity.WeekOf));
    this.state = {
      activity: { ...props.activity },
      validated: false,
      selectedDate: weekStart,
      highlightDates: DateUtilities.getWeek(weekStart),
      datePickerOpen: false
    }
	}
	
	convertOPRsToPersonas = (OPRs) => {
		let newOPRs = [];
		if (OPRs && OPRs.results) {
			newOPRs = OPRs.results.map(OPR => {
				return {
					text: OPR.Title,
					imageInitials: OPR.Title.substr(OPR.Title.indexOf(' ') + 1, 1) + OPR.Title.substr(0, 1),
					SPUserId: OPR.Id
				}
			})
		}
		return newOPRs;
	}

  handleOpen = () => {
		let weekStart = DateUtilities.getStartOfWeek(new Date(this.props.activity.WeekOf));
		// Deep copy activity
		let { OPRs, ...editActivity } = this.props.activity;
		editActivity.OPRs = {
			results: [...OPRs.results]
		};
		this.setState({
			activity: editActivity,
      validated: false,
      selectedDate: weekStart,
      highlightDates: DateUtilities.getWeek(weekStart)
    })
  }

  // Syncs fields between react state and form
  updateActivity(value, field) {
    const activity = this.state.activity;
    activity[field] = value;
    this.setState({ activity });
	}
	
	updateOPRs(value) {
		const activity = this.state.activity;
		activity.OPRs.results = value.map((newOPR) => {
			return {Id: newOPR.SPUserId, Title: newOPR.text}
		});
		this.setState({ activity });
	}

	isOPRInvalid() {
		return this.state.activity.OPRs?.results.length ? false : true;
	}

  validateActivity(e) {
		const form = document.getElementById("EditActivityModal");
    if (form.checkValidity() === false || this.isOPRInvalid()) {
      e.preventDefault();
      e.stopPropagation();
      this.setState({ validated: true });
    } else {
      this.props.submitEditActivity(this.state.activity)
      this.setState({ validated: false })
    }
  }

  onDateChange(date) {
    let selectedDate = DateUtilities.getStartOfWeek(date);
    let highlightDates = DateUtilities.getWeek(selectedDate);
    let activity = this.state.activity;
    activity.InputWeekOf = selectedDate;
    this.setState({ activity, selectedDate, highlightDates });
  }

  isReadOnly() {
    return this.props.activity.Id > -1 && new Date(this.props.activity.WeekOf) < this.props.minCreateDate;
  }

  render() {
    const DatePickerCustomInput = ({ value }) => (
      <>
        <Form.Label>Period of Accomplishment</Form.Label>
        <Form.Control
          type="text"
          value={value}
          onClick={() => !this.isReadOnly() && this.setState({ datePickerOpen: true })}
          required
          readOnly={this.isReadOnly()}
        />
      </>
    );

    return (
      <ActivityModal
        modalDisplayName="Activity"
        show={this.props.showEditModal}
        handleShow={() => this.handleOpen()}
        handleClose={this.props.closeEditActivity}
        handleSubmit={e => this.validateActivity(e)}
        handleDelete={() => this.props.handleDelete(this.state.activity)}
        deleting={this.props.deleting}
        saving={this.props.saving}
        readOnly={this.isReadOnly()}
        showDeleteButton={this.props.activity.Id > -1}
        error={this.props.error}
      >
        <Form disabled={this.props.saving} id="EditActivityModal" noValidate validated={this.state.validated}
          onSubmit={e => this.validateActivity(e)}
        >
          <Form.Group controlId="editActivityWeekOf">
            <DatePicker
              selected={this.state.selectedDate}
              onChange={date => this.onDateChange(date)}
              highlightDates={this.state.highlightDates}
              minDate={this.props.minCreateDate}
              maxDate={new Date()}
              customInput={<DatePickerCustomInput />}
              open={this.state.datePickerOpen}
              onClickOutside={() => this.setState({ datePickerOpen: false })}
              shouldCloseOnSelect={false}
            />
          </Form.Group>
          <Form.Group controlId="editActivityOrg">
            <Form.Label>Organization</Form.Label>
            <Form.Control as="select"
              defaultValue={this.props.activity.Branch}
              value={this.state.Branch}
              onChange={(e) => this.updateActivity(e.target.value, 'Branch')}
              disabled={this.isReadOnly()}
            >
              <option>--</option>
              <option>OZI</option>
              <option>OZIC</option>
              <option>OZIF</option>
              <option>OZIP</option>
              <option>OTHER</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="editActivityTitle">
            <Form.Label>Activity/Purpose</Form.Label>
            <Form.Control
              type="text"
              placeholder="Title with no trailing period"
              defaultValue={this.props.activity.Title}
              value={this.state.Title}
              onChange={(e) => this.updateActivity(e.target.value, 'Title')}
              readOnly={this.isReadOnly()}
              required
            />
            <Form.Control.Feedback type="invalid">
              Enter a title with no trailing period.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="editActivityInterestItems">
            <Form.Label>Action Taken/In Work</Form.Label>
            <Form.Control as="textarea" rows="5"
              placeholder="Actions taken..."
              defaultValue={this.props.activity.ActionTaken}
              value={this.state.ActionTaken}
              onChange={(e) => this.updateActivity(e.target.value, 'ActionTaken')}
              readOnly={this.isReadOnly()}
              required
            />
            <Form.Control.Feedback type="invalid">
              Enter at least one action taken.
            </Form.Control.Feedback>
          </Form.Group>
          {this.props.showBigRockCheck(this.state.activity.Branch) &&
            <Form.Group>
              <Form.Check
                label="Big Rock?"
                type="checkbox"
                defaultChecked={this.props.activity.IsBigRock}
                value={this.state.IsBigRock}
                onClick={(e) => this.updateActivity(e.target.checked, 'IsBigRock')}
                disabled={this.isReadOnly()}
              />
            </Form.Group>}
          {this.props.showHistoryCheck(this.state.activity.Branch) &&
            <Form.Group>
              <Form.Check
                label="History Entry?"
                type="checkbox"
                defaultChecked={this.props.activity.IsHistoryEntry}
                value={this.state.IsHistoryEntry}
                onClick={(e) => this.updateActivity(e.target.checked, 'IsHistoryEntry')}
                disabled={this.isReadOnly()}
              />
            </Form.Group>}
					<Form.Group controlId="editActivityOPRs">
						<Form.Label>OPRs</Form.Label>
						<Form.Control
							as={ActivityPeoplePicker}
							defaultValue={this.convertOPRsToPersonas(this.props.activity.OPRs)}
							updateOPRs={(newOPRs) => this.updateOPRs(newOPRs)}
							readOnly={this.isReadOnly()}
							required={true}
							isInvalid={this.isOPRInvalid()}
							isValid={!this.isOPRInvalid()}
						>
						</Form.Control>
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