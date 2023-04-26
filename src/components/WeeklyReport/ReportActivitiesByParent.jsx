import React, { Component } from "react";
import { Row } from "react-bootstrap";
import ReportActivity from "./ReportActivity";
import "./ReportActivity.css";

class ReportActivitiesByParent extends Component {
  getActivitiesByParent() {
    let activitiesByBranch = {};
    this.props.activities.forEach((activity) => {
      let branch = activity.Branch.substr(0, 3);
      if (!activitiesByBranch[branch]) {
        activitiesByBranch[branch] = [];
      }
      activitiesByBranch[branch].push(activity);
    });
    return activitiesByBranch;
  }

  render() {
    let activitiesByBranch = this.getActivitiesByParent();

    return this.props.activities.length > 0 ? (
      Object.keys(activitiesByBranch).map((branch) => (
        <div className="activity-branch">
          <Row>
            <h4>
              <u>{branch} Activities</u>:
            </h4>
          </Row>
          {activitiesByBranch[branch].map((activity) => (
            <ReportActivity
              activity={activity}
              hideWeekOf={this.props.hideWeekOf}
            />
          ))}
        </div>
      ))
    ) : (
      <Row className="justify-content-center m-5">
        <h4>
          {this.props.reportGenerated
            ? "No activities were found for the given date range"
            : "Please select a date range and press 'Generate Report' for a report to be shown"}
        </h4>
      </Row>
    );
  }
}

export default ReportActivitiesByParent;
