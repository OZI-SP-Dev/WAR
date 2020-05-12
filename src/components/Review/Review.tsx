import moment from "moment";
import React, { useEffect, useState } from "react";
import { Container, Form, FormCheck, Row, useAccordionToggle, Accordion } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { ActivitiesApiConfig } from '../../api/ActivitiesApi';
import ActivityUtilities from "../../utilities/ActivityUtilities";
import RoleUtilities, { IUserRole } from "../../utilities/RoleUtilities";
import '../Activities/Activities.css';
import { ActivityCard } from "../Activities/ActivityCard";
import ActivitySpinner from "../Activities/ActivitySpinner";
import EditActivityModal from "../Activities/EditActivityModal";

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
    const [activities, setActivities] = useState<any[]>([]);
    const [modalActivityId, setModalActivityId] = useState<number>(-1);
    const [loading, setLoading] = useState<boolean>(true);
    const [deleting, setDeleting] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [showAllUsers, setShowAllUsers] = useState<boolean>(false);

    const activitiesApi = ActivitiesApiConfig.activitiesApi;

    let query = useQuery().get("query");

    const fetchActivities = async () => {
        try {
            setLoading(true);
            let newActivities = await activitiesApi.fetchActivitiesByQueryString(query ? query : '', showAllUsers ? undefined : parseInt(user.Id));
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

    useEffect(() => {
        fetchActivities();
        // eslint-disable-next-line
    }, [query, showAllUsers]);

    const closeModal = () => {
        setModalActivityId(-1);
    }

    const cardOnClick = (activity: any) => {
        setModalActivityId(activity.Id);
    }

    const switchOnClick = (e: any) => {
        setShowAllUsers(e.target.checked);
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

    return (
        <Container>
            <Row className="justify-content-center"><h1>Review Activities</h1></Row>
            <Form className={"mb-3"}>
                <FormCheck
                    id="userCheck"
                    type="switch"
                    label="Show all Activities for Department"
                    checked={showAllUsers}
                    onChange={switchOnClick}
                />
            </Form>
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