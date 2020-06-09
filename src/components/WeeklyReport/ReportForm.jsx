import React, { Component } from 'react';
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import DateUtilities from '../../utilities/DateUtilities';
import './ReportForm.css';

class ReportForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            startDatePickerOpen: false,
            endDatePickerOpen: false,
        }
    }

    render() {
        let StartDatePickerCustomInput = ({ value }) => (
            <>
                <Form.Label>Report Start Week</Form.Label>
                <Form.Control
                    type="text"
                    value={value}
                    onClick={() => this.setState({ startDatePickerOpen: true })}
                />
            </>);

        let EndDatePickerCustomInput = ({ value }) => (
            <>
                <Form.Label>Report End Week</Form.Label>
                <Form.Control
                    type="text"
                    value={value}
                    onClick={() => this.setState({ endDatePickerOpen: true })}
                />
            </>);

        return (
            <Form id="WeeklyReportSearch">
                <Row >
                    <Col md={3}>
                        <Form.Group controlId="WeeklyReportWeekOfStart">
                            <DatePicker
                                className="weekly-report-date-picker"
                                selected={DateUtilities.momentToDate(this.props.startDate)}
                                onChange={this.props.onChangeStartDate}
                                highlightDates={this.props.startHighlightDates}
                                maxDate={DateUtilities.momentToDate(this.props.endDate)}
                                customInput={<StartDatePickerCustomInput />}
                                open={this.state.startDatePickerOpen}
                                onClickOutside={() => this.setState({ startDatePickerOpen: false })}
                                shouldCloseOnSelect={false}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group controlId="WeeklyReportWeekOfEnd">
                            <DatePicker
                                className="weekly-report-date-picker"
                                selected={DateUtilities.momentToDate(this.props.endDate)}
                                onChange={this.props.onChangeEndDate}
                                highlightDates={this.props.endHighlightDates}
                                minDate={DateUtilities.momentToDate(this.props.startDate)}
                                maxDate={DateUtilities.momentToDate(DateUtilities.getToday())}
                                customInput={<EndDatePickerCustomInput />}
                                open={this.state.endDatePickerOpen}
                                onClickOutside={() => this.setState({ endDatePickerOpen: false })}
                                shouldCloseOnSelect={false}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Button
                    disabled={this.state.loadingReport}
                    className="float-right mb-3"
                    variant="primary"
                    onClick={this.props.submitSearch}>
                    {this.props.loadingReport && <Spinner as="span" size="sm" animation="grow" role="status" aria-hidden="true" />}
                    {' '}Generate Report
                </Button>
            </Form>
        );
    }
}

export default ReportForm;