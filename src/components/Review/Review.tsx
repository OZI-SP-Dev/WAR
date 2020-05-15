import React, { useEffect, useState } from "react";
import { Container, Form, FormCheck, Row } from "react-bootstrap";
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
            let response = (
                await activitiesApi.submitActivity(await ActivityUtilities.buildActivity(activity)));

            activity = ActivityUtilities.updateActivityEtagFromResponse(response, activity);

            setActivities(ActivityUtilities.replaceActivity(activities, response.data, activity));
            setLoading(false);
            setModalActivityId(-1);
        } catch (e) {
            console.error(e);
            setError(true);
            setLoading(false);
            setModalActivityId(-1);
        }
    }

    const deleteActivity = async (activity: any) => {
        try {
            setDeleting(true);
            let deletedActivity = (await activitiesApi.deleteActivity(await ActivityUtilities.buildActivity(activity))).data;
            setActivities(ActivityUtilities.filterActivity(activities, deletedActivity));
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

    return (
        <Container fluid>
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
            {activities.map(activity =>
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
            <ActivitySpinner show={loading} displayText="Fetching Activities" />
        </Container>
    )
}