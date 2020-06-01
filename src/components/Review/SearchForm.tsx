import React, { useState } from "react";
import { Button, Col, Form, FormCheck, Row, Spinner } from "react-bootstrap";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useHistory } from "react-router-dom";
import DateUtilities from "../../utilities/DateUtilities";
import '../WeeklyReport/ReportForm.css';
import './SearchForm.css';

export interface ISearchFormProps {
    defaultQuery: string,
    defaultOrg: string,
    defaultIncludeSubOrgs: boolean,
    defaultStartDate: Date | null,
    defaultEndDate: Date | null,
    defaultShowUserOnly: boolean,
    loading: boolean,
    orgs: string[]
}

export const SearchForm: React.FunctionComponent<ISearchFormProps> = (props: ISearchFormProps) => {

    let initialStartWeek = props.defaultStartDate;
    if (!initialStartWeek) {
        initialStartWeek = DateUtilities.getStartOfWeek(new Date());
        initialStartWeek.setDate(initialStartWeek.getDate() - 7);
    }
    const initialEndWeek: Date = props.defaultEndDate ? props.defaultEndDate : DateUtilities.getStartOfWeek(new Date());

    const [startDatePickerOpen, setStartDatePickerOpen] = useState<boolean>(false);
    const [endDatePickerOpen, setEndDatePickerOpen] = useState<boolean>(false);
    const [showUserOnly, setShowUserOnly] = useState<boolean>(props.defaultShowUserOnly);
    const [startDate, setStartDate] = useState<Date>(initialStartWeek);
    const [endDate, setEndDate] = useState<Date>(initialEndWeek);
    const [startHighlightDates, setStartHighlightDates] =
        useState<Date[]>(DateUtilities.getWeek(initialStartWeek));
    const [endHighlightDates, setEndHighlightDates] =
        useState<Date[]>(DateUtilities.getWeek(initialEndWeek));
    const [org, setOrg] = useState<string>(props.defaultOrg);
    const [keywordQuery, setKeywordQuery] = useState<string>(props.defaultQuery);
    const [includeSubOrgs, setIncludeSubOrgs] = useState<boolean>(props.defaultIncludeSubOrgs);

    const history = useHistory();

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

    const userSwitchOnClick = (e: any) => {
        setShowUserOnly(e.target.checked);
    }

    const onChangeStartDate = (date: Date) => {
        setStartDate(DateUtilities.getStartOfWeek(date));
        setStartHighlightDates(DateUtilities.getWeek(date));
    }

    const onChangeEndDate = (date: Date) => {
        setEndDate(DateUtilities.getStartOfWeek(date));
        setEndHighlightDates(DateUtilities.getWeek(date));
    }

    const orgOnChange = (e: any) => {
        setOrg(e.target.value);
    }

    const keywordQueryOnChange = (e: any) => {
        setKeywordQuery(e.target.value);
    }

    const includeSubOrgSwitchOnClick = (e: any) => {
        setIncludeSubOrgs(e.target.checked);
    }

    const submitSearch = () => {
        history.push(`/Review?query=${keywordQuery}&org=${org}&includeSubOrgs=${includeSubOrgs}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&showUserOnly=${showUserOnly}`);
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
        <Form className={"mb-3"} onSubmit={submitSearch}>
            <Row>
                <Col md={4}>
                    <Form.Group controlId="keywordSearch">
                        <Form.Label>Keyword</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Search for a keyword"
                            value={keywordQuery}
                            onChange={keywordQueryOnChange}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col md={4}>
                    <Form.Group controlId="orgSearch">
                        <Form.Label>Organization</Form.Label>
                        <Form.Control as="select"
                            value={org}
                            onChange={orgOnChange}
                        >
                            <option>--</option>
                            {props.orgs.map(org => <option>{org}</option>)}
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
                            checked={includeSubOrgs}
                            onChange={includeSubOrgSwitchOnClick}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col md={3}>
                    <Form.Group controlId="weekOfStart">
                        <DatePicker
                            className="weekly-report-date-picker"
                            selected={startDate}
                            onChange={onChangeStartDate}
                            highlightDates={startHighlightDates}
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
                            selected={endDate}
                            onChange={onChangeEndDate}
                            highlightDates={endHighlightDates}
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
                        checked={showUserOnly}
                        onChange={userSwitchOnClick}
                    />
                </Col>
            </Row>
            <Button
                disabled={props.loading}
                className="float-right mb-3"
                variant="primary"
                type="submit"
                onSubmit={submitSearch}
            >
                {props.loading && <Spinner as="span" size="sm" animation="grow" role="status" aria-hidden="true" />}
                {' '}Submit Search
            </Button>
        </Form>
    );
}