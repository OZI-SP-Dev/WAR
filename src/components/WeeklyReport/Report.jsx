import React, { Component } from 'react';
import { Container, Row } from 'react-bootstrap';
import DateUtilities from '../../utilities/DateUtilities';
import ReportAccordion from './ReportAccordion';
import ReportActivitiesByBranch from './ReportActivitiesByBranch';
import ReportForm from './ReportForm';

class Report extends Component {

    constructor(props) {
        super(props);

        let thisWeek = DateUtilities.getStartOfWeek(new Date());

        this.state = {
            startDate: thisWeek,
            startHighlightDates: DateUtilities.getWeek(thisWeek),
            startDatePickerOpen: false,
            endDate: thisWeek,
            endHighlightDates: DateUtilities.getWeek(thisWeek),
            endDatePickerOpen: false
        }
    }

    render() {
        return (
            <Container fluid>
                <Row className="justify-content-center">
                    <h1>{this.props.pageHeader}</h1>
                </Row>
                <ReportAccordion searchCardHeader={this.props.searchCardHeader}>
                    <ReportForm
                        submitSearch={() => this.props.submitSearch(this.state.startDate, this.state.endDate)}
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
                        loadingReport={this.props.loadingReport}
                    />
                </ReportAccordion>
                <ReportActivitiesByBranch activities={this.props.activities} />
            </Container>
        );
    }
}

export default Report;