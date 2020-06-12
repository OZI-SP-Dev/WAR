import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { Card, Container, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { ActivitiesApiConfig, IActivity } from '../../api/ActivitiesApi';
import { OrgsContext } from "../../providers/OrgsContext";
import ActivityUtilities from "../../utilities/ActivityUtilities";
import DateUtilities from "../../utilities/DateUtilities";
import RoleUtilities, { IUserRole } from "../../utilities/RoleUtilities";
import '../Activities/Activities.css';
import { ActivityCard } from "../Activities/ActivityCard";
import ActivitySpinner from "../Activities/ActivitySpinner";
import EditActivityModal from "../Activities/EditActivityModal";
import CardAccordion from "../CardAccordion/CardAccordion";
import { CustomToggleAccordion } from "../CustomToggleAccordion/CustomToggleAccordion";
import { SearchForm } from "./SearchForm";

export function useQuery(): URLSearchParams {
    return new URLSearchParams(useLocation().search);
}

export interface IReviewProps {
    user: IUserRole
}

interface GroupedActivities {
    week: string,
    activitiesByOrg: {
        org: string,
        activities: any[]
    }[]
}

export const Review: React.FunctionComponent<IReviewProps> = ({ user }) => {

    let query = useQuery();
    let urlQuery = query.get("query");
    let urlOrg = query.get("org");
    let urlIncludeSubOrgs = query.get("includeSubOrgs");
    let urlStartDate = query.get("startDate");
    let urlEndDate = query.get("endDate");
    let urlShowUserOnly = query.get("showUserOnly");

    const [activities, setActivities] = useState<GroupedActivities[]>([]);
    const [modalActivityId, setModalActivityId] = useState<number>(-1);
    const [loading, setLoading] = useState<boolean>(true);
    const [deleting, setDeleting] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const activitiesApi = ActivitiesApiConfig.activitiesApi;

    const { orgs } = useContext(OrgsContext);

    const fetchActivities = async () => {
        try {
            setLoading(true);
            let submitQuery = urlQuery ? urlQuery : '';
            let submitOrg = urlOrg ? urlOrg.replace('--', '') : undefined;
            let submitIncludeSubOrgs = urlIncludeSubOrgs === "true" ? true : false;
            let submitStartDate = undefined;
            if (urlStartDate) {
                submitStartDate = DateUtilities.getDate(urlStartDate).subtract(1, 'day');
            }
            let submitEndDate = urlEndDate ? DateUtilities.getStartOfWeek(urlEndDate) : undefined;
            let submitUserId = urlShowUserOnly === "false" || (!urlShowUserOnly && RoleUtilities.userHasAnyRole(user)) ?
                undefined : parseInt(user.Id);
            let newActivities: any[] = await activitiesApi.fetchActivitiesByQueryString(submitQuery, submitOrg, submitIncludeSubOrgs, submitStartDate, submitEndDate, submitUserId);
            setActivities(groupActivities(newActivities));
            setLoading(false);
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    }

    const groupActivities = (newActivities: any[]): GroupedActivities[] => {
        let newGroupedActivites: GroupedActivities[] = [];
        newActivities.forEach((activity: any) => {
            let week = DateUtilities.getDate(activity.WeekOf).toISOString();
            let activitiesWeek: GroupedActivities | undefined = newGroupedActivites.find(act => act.week === week);
            if (activitiesWeek) {
                let activitiesByOrg = activitiesWeek.activitiesByOrg.find(actByOrg => actByOrg.org === activity.Branch);
                activitiesByOrg?.activities.push(activity);
            } else {
                activitiesWeek = {
                    week,
                    activitiesByOrg: (orgs ? orgs : []).map(org => {
                        return {
                            org,
                            activities: activity.Branch === org ? [activity] : []
                        }
                    })
                }
                newGroupedActivites.push(activitiesWeek);
            }
        });
        newGroupedActivites.sort((ga1, ga2) => {
            let date1 = moment(ga1.week);
            let date2 = moment(ga2.week);
            return date1.isBefore(date2) ? 1 : date1.isAfter(date2) ? -1 : 0;
        })
        return newGroupedActivites;
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

    const isOrgDisplayed = (org: string) => {
        return !urlOrg || urlOrg === org || (urlIncludeSubOrgs === "true" && org.includes(urlOrg));
    }

    useEffect(() => {
        fetchActivities();
        // eslint-disable-next-line
    }, [urlQuery, urlOrg, urlIncludeSubOrgs, urlStartDate, urlEndDate, urlShowUserOnly]);

    return (
        <Container fluid>
            <Row className="justify-content-center m-3"><h1>{urlQuery === null ? "Review Activities" : "Search Results"}</h1></Row>
            <CardAccordion defaultOpen={false} cardHeader="Search and Filter">
                <SearchForm
                    defaultQuery={urlQuery ? urlQuery : ''}
                    defaultOrg={urlOrg ? urlOrg : ''}
                    defaultIncludeSubOrgs={urlIncludeSubOrgs === "true" ? true : false}
                    defaultStartDate={urlStartDate ? DateUtilities.getDate(urlStartDate) : null}
                    defaultEndDate={urlEndDate ? DateUtilities.getDate(urlEndDate) : null}
                    defaultShowUserOnly={!RoleUtilities.userHasAnyRole(user) && (urlShowUserOnly === "true" || urlShowUserOnly === null) ?
                        true : false}
                    loading={loading}
                    orgs={orgs ? orgs : []}
                />
            </CardAccordion>
            {activities.map(activitiesForWeek =>
                <CustomToggleAccordion
                    key={activitiesForWeek.week + "_acc"}
                    className="mb-3"
                    header={`Week of: ${DateUtilities.getDate(activitiesForWeek.week).format("DD MMM YYYY")}`}
                    headerSize={4}
                >
                    <div key={activitiesForWeek.week + "_div"}>
                        {activitiesForWeek.activitiesByOrg.filter(actByOrg => isOrgDisplayed(actByOrg.org)).map(activitiesForOrg =>
                            <CustomToggleAccordion
                                key={activitiesForWeek.week + activitiesForOrg.org + "_acc"}
                                defaultOpen={activitiesForOrg.activities.length > 0}
                                className="mb-3"
                                header={`Organization: ${activitiesForOrg.org}`}
                                headerSize={6}
                            >
                                <div key={activitiesForWeek.week + activitiesForOrg.org + "_div"}>
                                    {activitiesForOrg.activities.length > 0 ? activitiesForOrg.activities.map(activity =>
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
                                                showMarCheck={(org: string) => RoleUtilities.userCanSetMar(user, org)}
                                                showHistoryCheck={(org: string) => RoleUtilities.userCanSetHistory(user, org)}
                                            />
                                        </div>) :
                                        <Card className="text-center">
                                            <span>
                                                {`There were no activities found for ${activitiesForOrg.org} in the week of ${DateUtilities.getDate(activitiesForWeek.week).format("DD MMM YYYY")}`}
                                            </span>
                                        </Card>}
                                </div>
                            </CustomToggleAccordion>)}
                    </div>
                </CustomToggleAccordion>)}
            <ActivitySpinner show={loading} displayText="Fetching Activities" />
        </Container>
    )
}