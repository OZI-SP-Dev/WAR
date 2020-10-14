import { Moment } from 'moment';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Button, Col, Form, FormCheck, Row, Spinner } from "react-bootstrap";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import { spWebContext } from '../../providers/SPWebContext';
import DateUtilities from "../../utilities/DateUtilities";
import { SPPersona } from '../Activities/ActivityPeoplePicker';
import { PeoplePicker } from '../PeoplePicker/PeoplePicker';
import '../WeeklyReport/ReportForm.css';
import './SearchForm.css';

export interface ISearchFormProps {
    defaultQuery: string,
    defaultOrg: string,
    defaultIncludeSubOrgs: boolean,
    defaultStartDate: Moment | null,
    defaultEndDate: Moment | null,
    defaultIsHistory: boolean,
    defaultIsMAR: boolean,
    defaultOpr: string | null,
    loading: boolean,
    orgs: string[]
}

interface ISearchForm {
    query: string,
    org: string,
    includeSubOrgs: boolean,
    startDate: Moment,
    endDate: Moment,
    opr: SPPersona | null,
    isHistory: boolean,
    isMAR: boolean
}

export const SearchForm: React.FunctionComponent<ISearchFormProps> = (props: ISearchFormProps) => {

    let initialStartWeek = props.defaultStartDate;
    if (!initialStartWeek) {
        initialStartWeek = DateUtilities.getStartOfWeek().subtract(7, 'days');
    }
    const initialEndWeek: Moment = props.defaultEndDate ? DateUtilities.getEndOfWeek(props.defaultEndDate) : DateUtilities.getEndOfWeek();

    const [startDatePickerOpen, setStartDatePickerOpen] = useState<boolean>(false);
    const [endDatePickerOpen, setEndDatePickerOpen] = useState<boolean>(false);
    const [startHighlightDates, setStartHighlightDates] =
        useState<Date[]>(DateUtilities.getWeek(initialStartWeek));
    const [endHighlightDates, setEndHighlightDates] =
        useState<Date[]>(DateUtilities.getWeek(initialEndWeek));

    const [searchForm, setSearchForm] = useState<ISearchForm>({
        query: props.defaultQuery,
        org: props.defaultOrg,
        includeSubOrgs: props.defaultIncludeSubOrgs,
        startDate: initialStartWeek,
        endDate: initialEndWeek,
        opr: null,
        isHistory: props.defaultIsHistory,
        isMAR: props.defaultIsMAR
    });

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

    const updateSearchForm = (fieldUpdating: string, newValue: any): void => {
        setSearchForm({ ...searchForm, [fieldUpdating]: newValue });
    }

    const onChangeStartDate = (date: Date) => {
        updateSearchForm("startDate", DateUtilities.getStartOfWeek(date));
        setStartHighlightDates(DateUtilities.getWeek(date));
    }

    const onChangeEndDate = (date: Date) => {
        updateSearchForm("endDate", DateUtilities.getEndOfWeek(date));
        setEndHighlightDates(DateUtilities.getWeek(date));
    }

    useEffect(() => {
        updateSearchForm("query", props.defaultQuery); // eslint-disable-next-line
    }, [props.defaultQuery]);

    const getOpr = async () => {
        if (props.defaultOpr) {
            let person = (await spWebContext.ensureUser(props.defaultOpr)).data;
            updateSearchForm("opr", {
                text: person.Title,
                imageInitials: person.Title.substr(person.Title.indexOf(' ') + 1, 1) + person.Title.substr(0, 1),
                Email: person.Email,
                SPUserId: person.Id.toString()
            });
        }
    }

    useEffect(() => {
        getOpr(); // eslint-disable-next-line
    }, [props.defaultOpr])

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
                            value={searchForm.query}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSearchForm("query", e.target.value)}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col md={4}>
                    <Form.Group controlId="orgSearch">
                        <Form.Label>Organization</Form.Label>
                        <Form.Control as="select"
                            value={searchForm.org}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSearchForm("org", e.target.value)}
                        >
                            <option value=''>--</option>
                            {props.orgs.map(org => <option key={org}>{org}</option>)}
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
                            checked={searchForm.includeSubOrgs}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSearchForm("includeSubOrgs", e.target.checked)}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col md={3}>
                    <Form.Group controlId="weekOfStart">
                        <DatePicker
                            className="weekly-report-date-picker"
                            selected={DateUtilities.momentToDate(searchForm.startDate)}
                            onChange={onChangeStartDate}
                            highlightDates={startHighlightDates}
                            maxDate={DateUtilities.momentToDate(searchForm.endDate)}
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
                            selected={DateUtilities.momentToDate(searchForm.endDate)}
                            onChange={onChangeEndDate}
                            highlightDates={endHighlightDates}
                            minDate={DateUtilities.momentToDate(searchForm.startDate)}
                            maxDate={DateUtilities.momentToDate(DateUtilities.getDate())}
                            customInput={<EndDatePickerCustomInput />}
                            open={endDatePickerOpen}
                            onClickOutside={clickOutside}
                            shouldCloseOnSelect={false}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col md="6">
                    <Form.Label>OPR (Last Name, First Name):</Form.Label>
                    <Form.Control
                        as={PeoplePicker}
                        defaultValue={searchForm.opr ? [searchForm.opr] : undefined}
                        updatePeople={(p: SPPersona[]) => {
                            let persona = p[0];
                            updateSearchForm('opr', persona ? persona : null);
                        }}
                    />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col md="2">
                    <FormCheck
                        id="historyCheck"
                        type="checkbox"
                        label="History Activity"
                        checked={searchForm.isHistory}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSearchForm("isHistory", e.target.checked)}
                    />
                </Col>
                <Col md="2">
                    <FormCheck
                        id="marCheck"
                        type="checkbox"
                        label="MAR Activity"
                        checked={searchForm.isMAR}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSearchForm("isMAR", e.target.checked)}
                    />
                </Col>
            </Row>
            <Link to={`/Review?query=${searchForm.query}&org=${searchForm.org}&includeSubOrgs=${searchForm.includeSubOrgs}&startDate=${searchForm.startDate.toISOString()}&endDate=${searchForm.endDate.toISOString()}&isHistory=${searchForm.isHistory}&isMAR=${searchForm.isMAR}&opr=${searchForm.opr ? searchForm.opr.Email : ''}`}>
                <Button
                    disabled={props.loading}
                    className="float-right mb-3"
                    variant="primary"
                    type="submit"
                >
                    {props.loading && <Spinner as="span" size="sm" animation="grow" role="status" aria-hidden="true" />}
                    {' '}Submit Search
            </Button>
            </Link>
        </Form>
    );
}