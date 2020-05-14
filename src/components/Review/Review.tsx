import moment from "moment";
import React, { useEffect, useState } from "react";
import { Accordion, Container, Row, useAccordionToggle } from "react-bootstrap";
import { useLocation, useHistory } from "react-router-dom";
import { ActivitiesApiConfig } from '../../api/ActivitiesApi';
import ActivityUtilities from "../../utilities/ActivityUtilities";
import DateUtilities from "../../utilities/DateUtilities";
import RoleUtilities, { IUserRole } from "../../utilities/RoleUtilities";
import '../Activities/Activities.css';
import { ActivityCard } from "../Activities/ActivityCard";
import ActivitySpinner from "../Activities/ActivitySpinner";
import EditActivityModal from "../Activities/EditActivityModal";
import CardAccordion from "../CardAccordion/CardAccordion";
import { SearchForm } from "./SearchForm";

export function useQuery(): URLSearchParams {
    return new URLSearchParams(useLocation().search);
}

function CustomToggle({ children, eventKey }: { children: any, eventKey: any }) {
    const [open, setOpen] = useState<boolean>(true);
    const accordionOnClick = useAccordionToggle(eventKey, () =>
        onClick()
    );

    const onClick = () => {
        setOpen(!open)
    }

    return (
        <h4 style={{ cursor: 'pointer' }} onClick={accordionOnClick}>
            {children}
            <div className={open ? 'arrow-down float-right' : 'arrow-right float-right'} />
        </h4>
    );
}

export interface IReviewProps {
    user: IUserRole
}

export const Review: React.FunctionComponent<IReviewProps> = ({ user }) => {

    let query = useQuery().get("query");
    const history = useHistory();

    const [activities, setActivities] = useState<any[]>([]);
    const [modalActivityId, setModalActivityId] = useState<number>(-1);
    const [loading, setLoading] = useState<boolean>(true);
    const [deleting, setDeleting] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    // start state vars for search form
    const initialStartWeek: Date = DateUtilities.getStartOfWeek(new Date());
    initialStartWeek.setDate(initialStartWeek.getDate() - 7);
    const initialEndWeek: Date = DateUtilities.getStartOfWeek(new Date());
    const [showUserOnly, setShowUserOnly] = useState<boolean>(true);
    const [startDate, setStartDate] = useState<Date>(initialStartWeek);
    const [endDate, setEndDate] = useState<Date>(initialEndWeek);
    const [startHighlightDates, setStartHighlightDates] =
        useState<Date[]>(DateUtilities.getWeek(initialStartWeek));
    const [endHighlightDates, setEndHighlightDates] =
        useState<Date[]>(DateUtilities.getWeek(initialEndWeek));
    const [org, setOrg] = useState<string>("--");
    const [keywordQuery, setKeywordQuery] = useState<string>(query === null ? "" : query);
    const [includeSubOrgs, setIncludeSubOrgs] = useState<boolean>(false);
    // end state vars for search form

    const activitiesApi = ActivitiesApiConfig.activitiesApi;

    const fetchActivities = async () => {
        try {
            setLoading(true);
            let submitStartDate = new Date(startDate);
            submitStartDate.setDate(startDate.getDate() - 1);
            let newActivities = await activitiesApi.fetchActivitiesByQueryString(query ? query : '', org.replace('--', ''), includeSubOrgs, submitStartDate, endDate, showUserOnly ? parseInt(user.Id) : undefined);
            setActivities(newActivities);
            setLoading(false);
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    }

    const submitActivity = async (activity: any) => {
        try {
            setLoading(true);
            let builtActivity = await ActivityUtilities.buildActivity(activity)

            let response = (await activitiesApi.submitActivity(builtActivity));

            builtActivity = ActivityUtilities.updateActivityEtagFromResponse(response, activity, builtActivity);

            setActivities(ActivityUtilities.replaceActivity(activities, builtActivity));
            setLoading(false);
            setModalActivityId(-1);
        } catch (e) {
            console.error(e);
            setError(true);
            setLoading(false);
        }
    }

    const deleteActivity = async (activity: any) => {
        try {
            setDeleting(true);
            await activitiesApi.deleteActivity(await ActivityUtilities.buildActivity(activity));
            setActivities(ActivityUtilities.filterActivity(activities, activity));
            setDeleting(false);
            setModalActivityId(-1);
        } catch (e) {
            console.error(e);
            setError(true);
            setDeleting(false);
            setModalActivityId(-1);
        }
    }

    const closeModal = () => {
        setModalActivityId(-1);
    }

    const cardOnClick = (activity: any) => {
        setModalActivityId(activity.Id);
    }

    const getActivityWeeks = (): string[] => {
        let activityWeeks: string[] = [];
        activities.forEach(activity => {
            let week = moment(activity.WeekOf).startOf("day");
            if (!activityWeeks.includes(week.toString())) {
                activityWeeks.push(week.toString());
            }
        });
        return activityWeeks;
    }

    // Start search form functions
    const submitSearch = () => {
        if (keywordQuery !== query) {
            history.push(`/Review?query=${keywordQuery}`);
        } else {
            fetchActivities();
        }
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
    // End search form functions

    useEffect(() => {
        fetchActivities();
        // eslint-disable-next-line
    }, [query]);

    return (
        <Container>
            <Row className="justify-content-center"><h1>Review Activities</h1></Row>
            <CardAccordion defaultOpen={false} cardHeader="Search and Filter">
                <SearchForm
                    submitSearch={submitSearch}
                    showUserOnly={showUserOnly}
                    startDate={startDate}
                    endDate={endDate}
                    startHighlightDates={startHighlightDates}
                    endHighlightDates={endHighlightDates}
                    org={org}
                    query={keywordQuery}
                    loading={loading}
                    includeSubOrgs={includeSubOrgs}
                    userSwitchOnClick={userSwitchOnClick}
                    includeSubOrgSwitchOnClick={includeSubOrgSwitchOnClick}
                    onChangeStartDate={onChangeStartDate}
                    onChangeEndDate={onChangeEndDate}
                    orgOnChange={orgOnChange}
                    queryOnChange={keywordQueryOnChange}
                />
            </CardAccordion>
            {getActivityWeeks().map(week =>
                <Accordion key={week + "_acc"} defaultActiveKey="0" className="mb-3">
                    <CustomToggle eventKey="0">Week of: {moment(week).format("DD MMM YYYY")}</CustomToggle>
                    <Accordion.Collapse eventKey="0">
                        <div key={week + "_div"}>
                            {activities.filter(activity => moment(activity.WeekOf).startOf("day").toString() === week).map(activity =>
                                <div key={`${activity.Id}_div`}>
                                    <ActivityCard className={"mb-3"} key={`${activity.Id}_card`} activity={activity} onClick={cardOnClick} />
                                    <EditActivityModal
                                        key={`${activity.Id}_modal`}
                                        showEditModal={modalActivityId === activity.Id}
                                        submitEditActivity={submitActivity}
                                        handleDelete={deleteActivity}
                                        closeEditActivity={closeModal}
                                        activity={activity}
                                        deleting={deleting}
                                        saving={loading}
                                        error={error}
                                        minCreateDate={RoleUtilities.getMinActivityCreateDate(user)}
                                        showBigRockCheck={(org: string) => RoleUtilities.userCanSetBigRock(user, org)}
                                        showHistoryCheck={(org: string) => RoleUtilities.userCanSetHistory(user, org)}
                                    />
                                </div>
                            )}
                        </div>
                    </Accordion.Collapse>
                </Accordion>)}
            <ActivitySpinner show={loading} displayText="Fetching Activities" />
        </Container>
    )
}