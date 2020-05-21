import moment from 'moment';
import React, { Component } from 'react';
import { Row } from 'react-bootstrap';
import './ReportActivity.css';

class ReportActivity extends Component {

    render() {
        let activity = this.props.activity;
        return (
            <Row>
                <p className="preserve-whitespace">
                    <strong>Week of:</strong> {moment(activity.WeekOf).format("MM/DD/YYYY")}<br />
                    <strong>Activity/Purpose:</strong> {activity.Title}<br />
                    <strong>Action Taken/In Work:</strong> {activity.ActionTaken}<br />
                    <strong>OPRs:</strong> {activity.OPRs && activity.OPRs.results && activity.OPRs.results.map((OPR, index, array) =>
                        (<span key={OPR.Id}> {OPR.Title}{array.length - 1 > index ? ';' : ''} </span>))}
                </p>
            </Row>
        );
    }
}

export default ReportActivity;