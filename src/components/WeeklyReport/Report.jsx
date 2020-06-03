import React, { Component } from 'react';
import { Container, Row } from 'react-bootstrap';
import DateUtilities from '../../utilities/DateUtilities';
import CardAccordion from '../CardAccordion/CardAccordion';
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
            endDate: DateUtilities.getEndOfWeek(thisWeek),
            endHighlightDates: DateUtilities.getWeek(thisWeek),
            endDatePickerOpen: false
        }
    }

    render() {
        return (
            <Container fluid>
                <Row className="justify-content-center m-3">
                    <h1>{this.props.pageHeader}</h1>
                </Row>
                <CardAccordion defaultOpen cardHeader={this.props.searchCardHeader}>
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
                            endDate: DateUtilities.getEndOfWeek(date),
                            endHighlightDates: DateUtilities.getWeek(date)
                        })}
                        endHighlightDates={this.state.endHighlightDates}
                        loadingReport={this.props.loadingReport}
                    />
                </CardAccordion>
                <ReportActivitiesByBranch activities={this.props.activities} reportGenerated={this.props.reportGenerated} />
            </Container>
        );
    }
}

export default Report;