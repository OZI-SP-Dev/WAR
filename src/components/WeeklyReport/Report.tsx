import { Moment } from 'moment';
import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Form, FormCheck, Row, Spinner } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { OrgsContext } from '../../providers/OrgsContext';
import { spWebContext } from '../../providers/SPWebContext';
import DateUtilities from '../../utilities/DateUtilities';
import { SPPersona } from '../Activities/ActivityPeoplePicker';
import CardAccordion from '../CardAccordion/CardAccordion';
import { PeoplePicker } from '../PeoplePicker/PeoplePicker';
import './Report.css';

export interface IReportProps {
    pageHeader: string,
    searchCardHeader: string,
    loadingReport: boolean,
    defaultQuery: string,
    defaultOrg: string,
    defaultIncludeSubOrgs: boolean,
    defaultStartDate: Moment | null,
    defaultEndDate: Moment | null,
    defaultOpr: string | null,
    submitSearch: (keyword: string, startDate: Moment | null, endDate: Moment | null, org: string, includeSubOrgs: boolean, oprEmail: string) => void
}

interface IReportForm {
    query: string,
    startDate: Moment | null,
    endDate: Moment | null,
    org: string,
    includeSubOrgs: boolean,
    opr: SPPersona | null,
}

export const Report: FunctionComponent<IReportProps> = (props) => {

    let initialStartWeek = props.defaultStartDate;
    if (!initialStartWeek) {
        initialStartWeek = DateUtilities.getStartOfWeek();
    }
    const initialEndWeek: Moment = props.defaultEndDate ? DateUtilities.getEndOfWeek(props.defaultEndDate) : DateUtilities.getEndOfWeek();

    const [reportForm, setReportForm] = useState<IReportForm>({
        query: props.defaultQuery,
        startDate: initialStartWeek,
        endDate: initialEndWeek,
        org: props.defaultOrg,
        includeSubOrgs: props.defaultIncludeSubOrgs,
        opr: null
    });

    const [startHighlightDates, setStartHighlightDates] = useState(DateUtilities.getWeek(initialStartWeek));
    const [endHighlightDates, setEndHighlightDates] = useState(DateUtilities.getWeek(initialEndWeek));
    const [startDatePickerOpen, setStartDatePickerOpen] = useState<boolean>(false);
    const [endDatePickerOpen, setEndDatePickerOpen] = useState<boolean>(false);

    const { orgs } = useContext(OrgsContext);

    const updateReportForm = (field: string, value: any) => {
        setReportForm({ ...reportForm, [field]: value });
    }

    const updateStartDate = (date?: Date | null) => {
        updateReportForm('startDate', date ? DateUtilities.getStartOfWeek(date) : null);
        setStartHighlightDates(date ? DateUtilities.getWeek(date) : []);
    }

    const updateEndDate = (date?: Date | null) => {
        updateReportForm('endDate', date ? DateUtilities.getEndOfWeek(date) : null);
        setEndHighlightDates(date ? DateUtilities.getWeek(date) : []);
    }

    const getOpr = async () => {
        if (props.defaultOpr) {
            let person = (await spWebContext.ensureUser(props.defaultOpr)).data;
            updateReportForm("opr", {
                text: person.Title,
                imageInitials: person.Title.substr(person.Title.indexOf(' ') + 1, 1) + person.Title.substr(0, 1),
                Email: person.Email,
                SPUserId: person.Id.toString()
            });
        }
    }

    useEffect(() => {
        getOpr(); // eslint-disable-next-line
    }, [props.defaultOpr]);

    let StartDatePickerCustomInput = () => (
        <>
            <Form.Label>Report Start Week</Form.Label>
            <Form.Control
                type="text"
                value={reportForm.startDate ? reportForm.startDate.format("MM/DD/YYYY") : ""}
                onClick={() => setStartDatePickerOpen(true)}
            />
        </>);

    let EndDatePickerCustomInput = () => (
        <>
            <Form.Label>Report End Week</Form.Label>
            <Form.Control
                type="text"
                value={reportForm.endDate ? reportForm.endDate.format("MM/DD/YYYY") : ""}
                onClick={() => setEndDatePickerOpen(true)}
            />
        </>);

    return (
        <Container fluid>
            <Row className="justify-content-center m-3">
                <h1>{props.pageHeader}</h1>
            </Row>
            <CardAccordion defaultOpen cardHeader={props.searchCardHeader}>
                <Form id="WeeklyReportSearch">
                    <Row>
                        <Col md={3}>
                            <Form.Group controlId="WeeklyReportWeekOfStart">
                                <DatePicker
                                    className="weekly-report-date-picker"
                                    selected={reportForm.startDate ? DateUtilities.momentToDate(reportForm.startDate) : null}
                                    onChange={updateStartDate}
                                    highlightDates={startHighlightDates}
                                    maxDate={reportForm.endDate ? DateUtilities.momentToDate(reportForm.endDate) : null}
                                    customInput={<StartDatePickerCustomInput />}
                                    open={startDatePickerOpen}
                                    onClickOutside={() => setStartDatePickerOpen(false)}
                                    shouldCloseOnSelect={false}
                                />
                                <Button variant="link" onClick={() => updateStartDate(null)}>clear</Button>
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group controlId="WeeklyReportWeekOfEnd">
                                <DatePicker
                                    className="weekly-report-date-picker"
                                    selected={reportForm.endDate ? DateUtilities.momentToDate(reportForm.endDate) : null}
                                    onChange={updateEndDate}
                                    highlightDates={endHighlightDates}
                                    minDate={reportForm.startDate ? DateUtilities.momentToDate(reportForm.startDate) : null}
                                    maxDate={DateUtilities.momentToDate(DateUtilities.getToday())}
                                    customInput={<EndDatePickerCustomInput />}
                                    open={endDatePickerOpen}
                                    onClickOutside={() => setEndDatePickerOpen(false)}
                                    shouldCloseOnSelect={false}
                                />
                                <Button variant="link" onClick={() => updateEndDate(null)}>clear</Button>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4}>
                            <Form.Group controlId="keywordSearch">
                                <Form.Label>Keyword</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Search for a keyword"
                                    value={reportForm.query}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateReportForm("query", e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4}>
                            <Form.Group controlId="orgSearch">
                                <Form.Label>Organization</Form.Label>
                                <Form.Control as="select"
                                    value={reportForm.org}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateReportForm("org", e.target.value)}
                                >
                                    <option value=''>--</option>
                                    {orgs?.map(org => <option key={org}>{org}</option>)}
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
                                    checked={reportForm.includeSubOrgs}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateReportForm("includeSubOrgs", e.target.checked)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="6">
                            <Form.Label>OPR (Last Name, First Name):</Form.Label>
                            <Form.Control
                                as={PeoplePicker}
                                defaultValue={reportForm.opr ? [reportForm.opr] : undefined}
                                updatePeople={(p: SPPersona[]) => {
                                    let persona = p[0];
                                    updateReportForm('opr', persona ? persona : null);
                                }}
                            />
                        </Col>
                    </Row>
                    <Button
                        disabled={props.loadingReport}
                        className="float-right mb-3"
                        variant="primary"
                        onClick={() => props.submitSearch(reportForm.query, reportForm.startDate, reportForm.endDate, reportForm.org, reportForm.includeSubOrgs, reportForm.opr && reportForm.opr.Email ? reportForm.opr.Email : '')}>
                        {props.loadingReport && <Spinner as="span" size="sm" animation="grow" role="status" aria-hidden="true" />}
                        {' '}Generate Report
                </Button>
                </Form>
            </CardAccordion>
            {props.children}
        </Container>
    );
}
