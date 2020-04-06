import React, { Component } from 'react';
import { Container, Form, Row } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import DateUtilities from '../../utilities/DateUtilities';

class WeeklyReport extends Component {

    constructor(props) {
        super(props);

        let thisWeek = DateUtilities.getStartOfWeek(new Date());

        this.state = {
            startDate: thisWeek,
            startHighlightDates: DateUtilities.getWeek(thisWeek),
            startDatePickerOpen: false,
            endDate: thisWeek,
            endHighlightDates: DateUtilities.getWeek(thisWeek),
            endDatePickerOpen: false,
        }
    }

    submitSearch() {

    }

    render() {
        let StartDatePickerCustomInput = ({ value }) => (
            <>
                <Form.Label>Period of Accomplishment</Form.Label>
                <Form.Control
                    type="text"
                    value={value}
                    onClick={() => this.setState({ startDatePickerOpen: true })}
                />
            </>);

        let EndDatePickerCustomInput = ({ value }) => (
            <>
                <Form.Label>Period of Accomplishment</Form.Label>
                <Form.Control
                    type="text"
                    value={value}
                    onClick={() => this.setState({ endDatePickerOpen: true })}
                />
            </>);

        return (
            <Container>
                <Row className="justify-content-center">
                    <h1>Weekly Activity Report</h1>
                </Row>
                <Form id="WeeklyReportSearch" onSubmit={() => this.submitSearch()}>
                    <Form.Group controlId="WeeklyReportWeekOfStart">
                        <DatePicker
                            selected={this.state.startDate}
                            onChange={date => this.setState({
                                startDate: DateUtilities.getStartOfWeek(date),
                                startHighlightDates: DateUtilities.getWeek(date)
                            })}
                            highlightDates={this.state.startHighlightDates}
                            maxDate={new Date()}
                            customInput={<StartDatePickerCustomInput />
                            }
                            open={this.state.startDatePickerOpen}
                            onClickOutside={() => this.setState({ startDatePickerOpen: false })}
                            shouldCloseOnSelect={false}
                        />
                    </Form.Group>
                    <Form.Group controlId="WeeklyReportWeekOfEnd">
                        <DatePicker
                            selected={this.state.endDate}
                            onChange={date => this.setState({
                                endDate: DateUtilities.getStartOfWeek(date),
                                endHighlightDates: DateUtilities.getWeek(date)
                            })}
                            highlightDates={this.state.endHighlightDates}
                            maxDate={new Date()}
                            customInput={<EndDatePickerCustomInput />
                            }
                            open={this.state.endDatePickerOpen}
                            onClickOutside={() => this.setState({ endDatePickerOpen: false })}
                            shouldCloseOnSelect={false}
                        />
                    </Form.Group>
                </Form>
            </Container>
        );
    }
}

export default WeeklyReport;