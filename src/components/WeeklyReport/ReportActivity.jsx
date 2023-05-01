import { Component } from "react";
import { Row } from "react-bootstrap";
import DateUtilities from "../../utilities/DateUtilities";
import "./ReportActivity.css";

class ReportActivity extends Component {
  render() {
    let activity = this.props.activity;
    const MAR = this.props.MAR;
    return (
      <Row className="activity">
        <p className="preserve-whitespace">
          {this.props.hideWeekOf ? (
            ""
          ) : (
            <>
              <strong>Week of:</strong>{" "}
              {DateUtilities.getDate(activity.WeekOf).format("MM/DD/YYYY")}{" "}
              <br />
            </>
          )}
          <strong>Activity/Purpose:</strong> {activity.Title}
          <br />
          <strong>Action Taken/In Work:</strong>{" "}
          {MAR && activity.MARText ? activity.MARText : activity.ActionTaken}
          <br />
          <strong>{MAR ? "AO" : "OPR"}s:</strong>{" "}
          {activity.OPRs &&
            activity.OPRs.results &&
            activity.OPRs.results.map((OPR, index, array) => (
              <span key={OPR.Id}>
                {" "}
                {OPR.Title}
                {array.length - 1 > index ? ";" : ""}{" "}
              </span>
            ))}
        </p>
      </Row>
    );
  }
}

export default ReportActivity;
