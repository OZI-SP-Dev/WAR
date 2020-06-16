import React, { Component } from 'react';
import { Row } from 'react-bootstrap';
import ReportActivity from './ReportActivity';
import './ReportActivity.css';

class ReportActivitiesByBranch extends Component {

    // We are going to be revisiting this so that we can make the report page more readable while maintaining the copy/paste functionality
    // componentDidMount() {
    //     document.addEventListener('copy', e => {
    //         let copyText = e.composedPath();
    //         console.log(copyText);
    //         e.clipboardData.setData('text/html', copyText);
    //     });
    // }

    render() {
        let activitiesByBranch = {};
        this.props.activities.forEach(activity => {
            if (!activitiesByBranch[activity.Branch]) {
                activitiesByBranch[activity.Branch] = []
            }
            activitiesByBranch[activity.Branch].push(activity);
        });

        return (
            this.props.activities.length > 0 ? Object.keys(activitiesByBranch).map(branch =>
                (<div className="activity-branch">
                    <Row><h4><u>{branch} Activities</u>:</h4></Row>
                    {activitiesByBranch[branch].map(activity => <ReportActivity activity={activity} hideWeekOf={this.props.hideWeekOf}/>)}
                </div>)
            ) : <Row className="justify-content-center m-5"><h4>{this.props.reportGenerated ? "No activities were found for the given date range" : "Please select a date range and press 'Generate Report' for a report to be shown"}</h4></Row>
        );
    }
}

export default ReportActivitiesByBranch;