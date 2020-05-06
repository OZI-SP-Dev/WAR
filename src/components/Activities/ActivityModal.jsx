import React, { Component } from 'react';
import { Alert, Button, Col, Modal, Spinner } from 'react-bootstrap';
import DeletePopover from './DeletePopover';

class ActivityModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDeletePopover: false,
      deletePopoverTarget: null
    }
  }

  onHide() {
    //don't close if currently saving
    if (!this.props.saving) {
      this.props.handleClose();
    }
  }

  render() {
    return (
      <Modal show={this.props.show} onShow={() => this.props.handleShow()} onHide={() => this.onHide()}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.modalDisplayName || "Pop-up"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{this.props.children || "description"}</Modal.Body>
        <Modal.Footer>
          <Col style={{ paddingLeft: 0 }}>
            {!this.props.readOnly && this.props.showDeleteButton &&
              <>
                <DeletePopover
                  show={this.state.showDeletePopover}
                  target={this.state.deletePopoverTarget}
                  handleDelete={this.props.handleDelete}
                  deleting={this.props.deleting}
                  saving={this.props.saving}
                  handleClosePopoverClick={() => this.setState({ showDeletePopover: false })}
                  handleClickOutside={() => this.setState({ showDeletePopover: false })}
                />
                <Button
                  className="float-left"
                  onClick={(event) =>
                    this.setState({
                      showDeletePopover: !this.state.showDeletePopover,
                      deletePopoverTarget: event.target
                    })}
                  disabled={this.props.saving || this.props.deleting}
                  variant="danger"
                >
                  Delete
                </Button>
              </>}
          </Col>
          <Col style={{ paddingRight: 0 }}>
            {!this.props.readOnly &&
              <Button
                style={{ marginLeft: "5%" }}
                className="float-right"
                disabled={this.props.saving || this.props.deleting}
                variant={this.props.submitButtonVariant || "primary"}
                onClick={this.props.handleSubmit}
              >
                {this.props.saving && <Spinner as="span" size="sm" animation="grow" role="status" aria-hidden="true" />}
                {' '}{this.props.submitButtonText || "Submit"}
              </Button>}
            <Button
              className="float-right"
              disabled={this.props.saving}
              variant="secondary"
              onClick={this.props.handleClose}>
              Close
            </Button>
          </Col>
          {this.props.error && <Alert variant='danger' className="w-100">There was an error saving your activity!</Alert>}
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ActivityModal;