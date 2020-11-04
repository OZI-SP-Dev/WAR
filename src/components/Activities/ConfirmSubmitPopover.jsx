import React, { Component } from 'react';
import { Button, Overlay, Popover, Spinner } from 'react-bootstrap';
import ReactDOM from 'react-dom';

class ConfirmSubmitPopover extends Component {
    constructor() {
        super();

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
            this.props.handleClickOutside(event);
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
                    <Popover.Title as="h3">{this.props.title}</Popover.Title>
                    <Popover.Content>
                        <p>{this.props.text}</p>
                        <Button
                            className="float-left mb-2"
                            variant="secondary"
                            onClick={(e) => this.props.handleClosePopoverClick(e)}
                        >
                            Close
                        </Button>
                        <Button
                            className="float-right mb-2"
                            disabled={this.props.submitting}
                            variant={this.props.buttonVariant}
                            onClick={(e) => this.props.handleSubmit(e)}
                        >
                            {this.props.submitting && <Spinner as="span" size="sm" animation="grow" role="status" aria-hidden="true" />}
                            {' '}Confirm
                        </Button>
                    </Popover.Content>
                </Popover>
            </Overlay>
        );
    }
}

export default ConfirmSubmitPopover;