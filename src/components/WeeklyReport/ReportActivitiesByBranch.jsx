import React, { Component } from 'react';
import { Row } from 'react-bootstrap';
import ReportActivity from './ReportActivity';

class ReportActivitiesByBranch extends Component {

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
                (<>
                    <Row><h4><u>{branch} Activities</u>:</h4></Row>
                    {activitiesByBranch[branch].map(activity => <ReportActivity activity={activity} />)}
                </>)
            )
        );
    }
}

export default ReportActivitiesByBranch;