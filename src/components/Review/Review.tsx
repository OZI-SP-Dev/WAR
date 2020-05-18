import moment from "moment";
import React, { useEffect, useState } from "react";
import { Accordion, Container, Row, useAccordionToggle } from "react-bootstrap";
import { useLocation, useHistory } from "react-router-dom";
import { ActivitiesApiConfig, IActivity } from '../../api/ActivitiesApi';
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

    let query = useQuery();
    let urlQuery = query.get("query");
    let urlOrg = query.get("org");
    let urlIncludeSubOrgs = query.get("includeSubOrgs");
    let urlStartDate = query.get("startDate");
    let urlEndDate = query.get("endDate");
    let urlShowUserOnly = query.get("showUserOnly");

    const history = useHistory();

    const [activities, setActivities] = useState<any[]>([]);
    const [modalActivityId, setModalActivityId] = useState<number>(-1);
    const [loading, setLoading] = useState<boolean>(true);
    const [deleting, setDeleting] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const activitiesApi = ActivitiesApiConfig.activitiesApi;

    const fetchActivities = async () => {
        try {
            setLoading(true);
            let submitQuery = urlQuery ? urlQuery : '';
            let submitOrg = urlOrg ? urlOrg.replace('--', '') : undefined;
            let submitIncludeSubOrgs = urlIncludeSubOrgs === "true" ? true : false;
            let submitStartDate = undefined;
            if (urlStartDate) {
                submitStartDate = new Date(urlStartDate);
                submitStartDate.setDate(submitStartDate.getDate() - 1);
            }
            let submitEndDate = urlEndDate ? new Date(urlEndDate) : undefined;
            let submitUserId = urlShowUserOnly === "false" ? undefined : parseInt(user.Id);
            let newActivities = await activitiesApi.fetchActivitiesByQueryString(submitQuery, submitOrg, submitIncludeSubOrgs, submitStartDate, submitEndDate, submitUserId);
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
            if (!activityWeeks.includes(week.toISOString())) {
                activityWeeks.push(week.toISOString());
            }
        });
        return activityWeeks;
    }

    // Start search form functions
    const submitSearch = (keywordQuery: string, org: string, includeSubOrgs: boolean, startDate: Date, endDate: Date, showUserOnly: boolean) => {
        history.push(`/Review?query=${keywordQuery}&org=${org}&includeSubOrgs=${includeSubOrgs}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&showUserOnly=${showUserOnly}`);
    }
    // End search form functions

    useEffect(() => {
        fetchActivities();
        // eslint-disable-next-line
    }, [urlQuery, urlOrg, urlIncludeSubOrgs, urlStartDate, urlEndDate, urlShowUserOnly]);

    return (
        <Container fluid>
            <Row className="justify-content-center"><h1>{urlQuery === null ? "Review Activities" : "Search Results"}</h1></Row>
            <CardAccordion defaultOpen={false} cardHeader="Search and Filter">
                <SearchForm
                    submitSearch={submitSearch}
                    query={urlQuery ? urlQuery : ''}
                    loading={loading}
                />
            </CardAccordion>
            {getActivityWeeks().map(week =>
                <Accordion key={week + "_acc"} defaultActiveKey="0" className="mb-3">
                    <CustomToggle eventKey="0">Week of: {moment(week).format("DD MMM YYYY")}</CustomToggle>
                    <Accordion.Collapse eventKey="0">
                        <div key={week + "_div"}>
                            {activities.filter(activity => moment(activity.WeekOf).startOf("day").toISOString() === week).map(activity =>
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
                                        canEdit={(act: IActivity) => RoleUtilities.isActivityEditable(act, user)}
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