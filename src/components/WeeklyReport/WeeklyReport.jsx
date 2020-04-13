import React, { Component } from 'react';
import { Accordion, Card, Container, Row } from 'react-bootstrap';
import "react-datepicker/dist/react-datepicker.css";
import { ActivitiesApiConfig } from '../../api/ActivitiesApi';
import DateUtilities from '../../utilities/DateUtilities';
import WeeklyReportActivity from './WeeklyReportActivity';
import WeeklyReportForm from './WeeklyReportForm';
import $ from 'jquery';

class WeeklyReport extends Component {

    constructor(props) {
        super(props);

        let thisWeek = DateUtilities.getStartOfWeek(new Date());

        this.state = {
            accordionOpen: true,
            startDate: thisWeek,
            startHighlightDates: DateUtilities.getWeek(thisWeek),
            startDatePickerOpen: false,
            endDate: thisWeek,
            endHighlightDates: DateUtilities.getWeek(thisWeek),
            endDatePickerOpen: false,
            loadingReport: false,
            errorMessage: "",
            activities: []
        }
        this.activitiesApi = ActivitiesApiConfig.activitiesApi;
    }

    submitSearch() {
        this.setState({ loadingReport: true });
        let endDate = new Date(this.state.endDate);
        endDate.setDate(endDate.getDate() + 1);
        this.activitiesApi.fetchActivitiesByDates(this.state.startDate, endDate).then(r => {
            this.setState({ loadingReport: false, activities: r });
            $("#weekly-report-toggle").click();
        }, e =>
            this.setState({ loadingReport: false, errorMessage: `Error while trying to fetch Activities. ${e}` })
        );
    }

    render() {

        let activitiesByBranch = {};
        this.state.activities.forEach(activity => {
            if (!activitiesByBranch[activity.Branch]) {
                activitiesByBranch[activity.Branch] = []
            }
            activitiesByBranch[activity.Branch].push(activity);
        });

        return (
            <Container>
                <Row className="justify-content-center">
                    <h1>Weekly Activity Report</h1>
                </Row>
                <Accordion defaultActiveKey={"0"} className="mb-3">
                    <Card>
                        <Accordion.Toggle
                            id="weekly-report-toggle"
                            as={Card.Header}
                            eventKey={"0"}
                            style={{ cursor: 'pointer' }}
                            onClick={() => this.setState({ accordionOpen: !this.state.accordionOpen })}>
                            Weekly Report Search
                            <div className={this.state.accordionOpen ? 'arrow-down float-right' : 'arrow-right float-right'} />
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                <WeeklyReportForm
                                    submitSearch={() => this.submitSearch()}
                                    startDate={this.state.startDate}
                                    onChangeStartDate={date => this.setState({
                                        startDate: DateUtilities.getStartOfWeek(date),
                                        startHighlightDates: DateUtilities.getWeek(date)
                                    })}
                                    startHighlightDates={this.state.startHighlightDates}
                                    endDate={this.state.endDate}
                                    onChangeEndDate={date => this.setState({
                                        endDate: DateUtilities.getStartOfWeek(date),
                                        endHighlightDates: DateUtilities.getWeek(date)
                                    })}
                                    endHighlightDates={this.state.endHighlightDates}
                                    loadingReport={this.state.loadingReport}
                                />
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
                {Object.keys(activitiesByBranch).map(branch =>
                    (<Row>
                        <h4><u>{branch} Activities</u>:</h4>
                        {activitiesByBranch[branch].map(activity => <WeeklyReportActivity activity={activity} />)}
                    </Row>)
                )}
            </Container>
        );
    }
}

export default WeeklyReport;