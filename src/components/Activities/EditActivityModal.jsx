import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import ActivityModal from './ActivityModal';

class EditActivityModal extends Component {
  render() {
    return (
      <ActivityModal
        modalDisplayName="Edit Activity"
        show={this.props.showEditModal}
        handleClose={this.props.submitEditActivity}
      >
        <Form onSubmit={this.props.submitEditActivity}>
          <Form.Group controlId="editActivityTitle">
            <Form.Label>Activity/Purpose</Form.Label>
            <Form.Control
              type="text"
              name="editActivityTitle"
              value={this.props.activity.Title}
            />
          </Form.Group>
          <Form.Group controlId="editActivityInterestItems">
            <Form.Label>Specific items of interest</Form.Label>
            <Form.Control as="textarea" rows="3"
              name="editActivityInterestItems"
              value={this.props.activity.InterestItems}
            />
          </Form.Group>
          <Form.Group controlId="editActivityActionItems">
            <Form.Label>Action items</Form.Label>
            <Form.Control 
              type="text"
              name="editActivityActionItems"
              value={this.props.activity.ActionItems}
            />
          </Form.Group>
          <Form.Group controlId="editActivityOPRs">
            {//TODO Convrert to people picker
            }
            <Form.Label>OPRs</Form.Label>
            <Form.Control 
              type="text"
              name="editActivityOPRs"
              value={this.props.activity.OPRs}
            />
          </Form.Group>
        </Form>
      </ActivityModal>
    );
  }
}

export default EditActivityModal;