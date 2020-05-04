import React, { Component } from 'react';
import { Spinner } from 'react-bootstrap';

class ActivitySpinner extends Component {

    render() {
        return (
            <>
                {this.props.show &&
                    <div className="spinner">
                        <Spinner animation="border" role="status">
                            <span className="sr-only">{this.props.displayText}</span>
                        </Spinner>
                    </div>}
            </>
        );
    }
}

export default ActivitySpinner;