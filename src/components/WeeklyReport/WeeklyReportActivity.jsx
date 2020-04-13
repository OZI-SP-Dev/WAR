import moment from 'moment';
import React, { Component } from 'react';

class WeeklyReportActivity extends Component {

    render() {
        let activity = this.props.activity;
        return (
            <p>
                <strong>Week of:</strong> {moment(activity.WeekOf).format("DD/MM/YYYY")}<br />
                <strong>Activity/Purpose:</strong> {activity.Title}<br />
                <strong>Action Taken/In Work:</strong> {activity.ActionTaken}<br />
                <strong>OPR:</strong> {activity.TextOPRs}<br />
            </p>
        );
    }
}

export default WeeklyReportActivity;