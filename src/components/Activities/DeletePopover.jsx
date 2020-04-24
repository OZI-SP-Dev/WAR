import React, { Component } from 'react';
import { Button, Overlay, Popover, Spinner } from 'react-bootstrap';
import ReactDOM from 'react-dom';

class DeletePopover extends Component {
    constructor(props) {
        super(props);

        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside, true);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside, true);
    }

    handleClickOutside(event) {
        let popoverDom = ReactDOM.findDOMNode(this);

        if (!popoverDom || !popoverDom.contains(event.target)) {
            this.props.handleClickOutside();
        }
    }

    render() {
        return (
            <Overlay
                show={this.props.show}
                placement="top"
                target={this.props.target}
            >
                <Popover id={"delete-popover"}>
                    <Popover.Title as="h3">Confirm Delete</Popover.Title>
                    <Popover.Content>
                        <p>Are you sure you would like to delete this Activity?</p>
                        <Button
                            style={{ marginBottom: "2.5%" }}
                            className="float-left"
                            variant="secondary"
                            onClick={this.props.handleClosePopoverClick}
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
        );
    }
}

export default DeletePopover;