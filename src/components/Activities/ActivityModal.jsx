import React, { Component } from 'react';
import { Button, Modal, Spinner, Alert } from 'react-bootstrap';

class ActivityModal extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  onHide() {
    //don't close if currently saving
    if (!this.props.saving) {
      this.props.handleClose();
    }
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={() => this.onHide()}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.modalDisplayName || "Pop-up"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{this.props.children || "description"}</Modal.Body>
        <Modal.Footer>
          <Button disabled={this.props.saving} variant="secondary" onClick={this.props.handleClose}>
            Close
          </Button>
          <Button disabled={this.props.saving} variant={this.props.submitButtonVariant || "primary"} onClick={this.props.handleSubmit}>
            {this.props.saving && <Spinner as="span" size="sm" animation="grow" role="status" aria-hidden="true" />}
            {' '}{this.props.submitButtonText || "Submit"}
          </Button>
          {this.props.error && <Alert variant='danger' className="w-100">There was an error saving your activity!</Alert>}
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ActivityModal;