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
            Object.keys(activitiesByBranch).map(branch =>
                (<div className="activity-branch">
                    <Row><h4><u>{branch} Activities</u>:</h4></Row>
                    {activitiesByBranch[branch].map(activity => <ReportActivity activity={activity} />)}
                </div>)
            )
        );
    }
}

export default ReportActivitiesByBranch;