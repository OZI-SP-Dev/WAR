import React, { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { ActivitiesApiConfig } from '../../api/ActivitiesApi';
import ActivityUtilities from "../../utilities/ActivityUtilities";
import RoleUtilities, { IUserRole } from "../../utilities/RoleUtilities";
import '../Activities/Activities.css';
import { ActivityCard } from "../Activities/ActivityCard";
import ActivitySpinner from "../Activities/ActivitySpinner";
import EditActivityModal from "../Activities/EditActivityModal";

export interface IReviewProps {
    user: IUserRole
}

export const Review: React.FunctionComponent<IReviewProps> = ({ user }) => {
    const [activities, setActivities] = useState<any[]>([]);
    const [modalActivity, setModalActivity] = useState<any>(ActivityUtilities.getEmptyActivity(new Date(), user));
    const [loading, setLoading] = useState<boolean>(true);
    const [deleting, setDeleting] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const activitiesApi = ActivitiesApiConfig.activitiesApi;

    const fetchActivities = async () => {
        try {
            setActivities(await activitiesApi.fetchActivitiesByDates(undefined, undefined, parseInt(user.Id)));
            setLoading(false);
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    }

    const submitActivity = async (activity: any) => {
        try {
            setLoading(true);
            let submittedActivity = (await activitiesApi.submitActivity(ActivityUtilities.buildActivity(activity))).data;
            setActivities(ActivityUtilities.replaceActivity(activities, submittedActivity));
            setLoading(false);
            setModalActivity(ActivityUtilities.getEmptyActivity(new Date(), user));
        } catch (e) {
            console.error(e);
            setError(true);
            setLoading(false);
            setModalActivity(ActivityUtilities.getEmptyActivity(new Date(), user));
        }
    }

    const deleteActivity = async (activity: any) => {
        try {
            setDeleting(true);
            let deletedActivity = (await activitiesApi.deleteActivity(ActivityUtilities.buildActivity(activity))).data;
            setActivities(ActivityUtilities.filterActivity(activities, deletedActivity));
            setDeleting(false);
            setModalActivity(ActivityUtilities.getEmptyActivity(new Date(), user));
        } catch (e) {
            console.error(e);
            setError(true);
            setDeleting(false);
            setModalActivity(ActivityUtilities.getEmptyActivity(new Date(), user));
        }
    }

    useEffect(() => {
        fetchActivities();
    });

    const closeModal = () => {
        setModalActivity(ActivityUtilities.getEmptyActivity(new Date(), user));
    }

    const cardOnClick = (activity: any) => {
        setModalActivity(activity);
    }

    return (
        <Container>
            <ActivitySpinner show={loading} displayText="Fetching Activities" />
            <Row className="justify-content-center"><h1>Review Activities</h1></Row>
            {activities.map(activity =>
                <>
                    <ActivityCard key={activity.ID} activity={activity} onClick={cardOnClick} />
                    <EditActivityModal
                        showEditModal={modalActivity.ID === activity.ID}
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
                </>
            )}
        </Container>
    )
}