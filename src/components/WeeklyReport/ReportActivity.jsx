import moment from 'moment';
import React, { Component } from 'react';
import { Row } from 'react-bootstrap';

class ReportActivity extends Component {

    render() {
        let activity = this.props.activity;
        return (
            <Row>
                <p>
                    <strong>Week of:</strong> {moment(activity.WeekOf).format("DD/MM/YYYY")}<br />
                    <strong>Activity/Purpose:</strong> {activity.Title}<br />
                    <strong>Action Taken/In Work:</strong> {activity.ActionTaken}<br />
                    <strong>OPR:</strong> {activity.TextOPRs}<br />
                </p>
            </Row>
        );
    }
}

export default ReportActivity;