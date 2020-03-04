import React from 'react';
import { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';

class TestListModal extends Component {
    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.modalDisplayName || "Pop-up"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{this.props.children || "description"}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.props.handleClose}>
                        Close
                    </Button>
                    <Button variant={this.props.submitButtonVariant || "primary"} onClick={this.props.handleSubmit}>
                        {this.props.submitButtonText || "Submit"}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default TestListModal;