import React, { Component } from 'react';
import { Alert, Button, Col, Modal, Overlay, Popover, Spinner } from 'react-bootstrap';

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
      <Modal show={this.props.show} onHide={() => this.onHide()}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.modalDisplayName || "Pop-up"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{this.props.children || "description"}</Modal.Body>
        <Modal.Footer>
          <Col style={{ paddingLeft: 0 }}>
            {!this.props.readOnly && this.props.showDeleteButton &&
              <>
                <Overlay
                  show={this.state.showDeletePopover}
                  placement="top"
                  target={this.state.deletePopoverTarget}
                >
                  <Popover id={"delete-popover"}>
                    <Popover.Title as="h3">Confirm Delete</Popover.Title>
                    <Popover.Content>
                      <p>Are you sure you would like to delete this Activity?</p>
                      <Button
                        style={{ marginBottom: "2.5%" }}
                        className="float-left"
                        variant="secondary"
                        onClick={() => this.setState({ showDeletePopover: false })}
                      >
                        Close
                      </Button>
                      <Button
                        style={{ marginBottom: "2.5%" }}
                        className="float-right"
                        disabled={this.props.saving || this.props.deleting}
                        variant="danger"
                        onClick={this.props.handleDelete}
                      >
                        {this.props.deleting && <Spinner as="span" size="sm" animation="grow" role="status" aria-hidden="true" />}
                        {' '}Delete
                      </Button>
                    </Popover.Content>
                  </Popover>
                </Overlay>
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