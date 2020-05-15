import React, { useState } from "react";
import { Button, Col, Form, FormCheck, Row, Spinner } from "react-bootstrap";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import '../WeeklyReport/ReportForm.css';
import './SearchForm.css';

export interface ISearchFormProps {
    submitSearch: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void),
    showUserOnly: boolean,
    startDate: Date,
    endDate: Date,
    startHighlightDates: Date[],
    endHighlightDates: Date[],
    org: string,
    query: string,
    loading: boolean,
    includeSubOrgs: boolean,
    userSwitchOnClick: ((event: React.ChangeEvent<HTMLInputElement>) => void),
    includeSubOrgSwitchOnClick: ((event: React.ChangeEvent<HTMLInputElement>) => void),
    onChangeStartDate: (date: Date) => void,
    onChangeEndDate: (date: Date) => void,
    orgOnChange: ((event: React.FormEvent<any>) => void),
    queryOnChange: ((event: React.FormEvent<any>) => void),
}

export const SearchForm: React.FunctionComponent<ISearchFormProps> = (props: ISearchFormProps) => {
    const [startDatePickerOpen, setStartDatePickerOpen] = useState<boolean>(false);
    const [endDatePickerOpen, setEndDatePickerOpen] = useState<boolean>(false);

    const startDatePickerOnClick = () => {
        setStartDatePickerOpen(true);
    }

    const endDatePickerOnClick = () => {
        setEndDatePickerOpen(true);
    }

    const clickOutside = () => {
        setStartDatePickerOpen(false);
        setEndDatePickerOpen(false);
    }

    const StartDatePickerCustomInput = ({ value }: any) => (
        <>
            <Form.Label>Search Week Start</Form.Label>
            <Form.Control
                type="text"
                value={value}
                onClick={startDatePickerOnClick}
            />
        </>);

    const EndDatePickerCustomInput = ({ value }: any) => (
        <>
            <Form.Label>Search Week End</Form.Label>
            <Form.Control
                type="text"
                value={value}
                onClick={endDatePickerOnClick}
            />
        </>);

    return (
        <Form className={"mb-3"}>
            <Row>
                <Col md={4}>
                    <Form.Group controlId="keywordSearch">
                        <Form.Label>Keyword</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Search for a keyword"
                            value={props.query}
                            onChange={props.queryOnChange}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col md={4}>
                    <Form.Group controlId="orgSearch">
                        <Form.Label>Organization</Form.Label>
                        <Form.Control as="select"
                            value={props.org}
                            onChange={props.orgOnChange}
                        >
                            <option>--</option>
                            <option>OZI</option>
                            <option>OZIC</option>
                            <option>OZIF</option>
                            <option>OZIP</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col md={3} className="search-form-center-align">
                    <Form.Group controlId="subOrgCheck">
                        <Form.Label />
                        <FormCheck
                            id="subOrgCheck"
                            className="mb-3"
                            type="switch"
                            label="Include Sub-Organizations?"
                            checked={props.includeSubOrgs}
                            onChange={props.includeSubOrgSwitchOnClick}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col md={3}>
                    <Form.Group controlId="weekOfStart">
                        <DatePicker
                            className="weekly-report-date-picker"
                            selected={props.startDate}
                            onChange={props.onChangeStartDate}
                            highlightDates={props.startHighlightDates}
                            maxDate={new Date()}
                            customInput={<StartDatePickerCustomInput />}
                            open={startDatePickerOpen}
                            onClickOutside={clickOutside}
                            shouldCloseOnSelect={false}
                        />
                    </Form.Group>
                </Col>
                <Col md={3}>
                    <Form.Group controlId="weekOfEnd">
                        <DatePicker
                            className="weekly-report-date-picker"
                            selected={props.endDate}
                            onChange={props.onChangeEndDate}
                            highlightDates={props.endHighlightDates}
                            maxDate={new Date()}
                            customInput={<EndDatePickerCustomInput />}
                            open={endDatePickerOpen}
                            onClickOutside={clickOutside}
                            shouldCloseOnSelect={false}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <FormCheck
                        id="userCheck"
                        type="switch"
                        label="Show only my Activities"
                        checked={props.showUserOnly}
                        onChange={props.userSwitchOnClick}
                    />
                </Col>
            </Row>
            <Button
                disabled={props.loading}
                className="float-right mb-3"
                variant="primary"
                onClick={props.submitSearch}>
                {props.loading && <Spinner as="span" size="sm" animation="grow" role="status" aria-hidden="true" />}
                {' '}Submit Search
            </Button>
        </Form>
    );
}