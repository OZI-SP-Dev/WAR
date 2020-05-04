import React, { useState, useEffect } from "react";
import { Container, Card, Row } from "react-bootstrap";
import { IActivity, ActivitiesApiConfig } from '../../api/ActivitiesApi'
import { IUserRole } from "../../utilities/RoleUtilities";
import ReportActivity from "../WeeklyReport/ReportActivity";
import ActivitySpinner from "../Activities/ActivitySpinner";

export interface IReviewProps {
    user: IUserRole
}

export const Review: React.FunctionComponent<any> = (props) => {
    const [activities, setActivities] = useState<IActivity[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const activitiesApi = ActivitiesApiConfig.activitiesApi;

    useEffect(() => {
        activitiesApi.fetchActivitiesByDates(undefined, undefined, props.user.Id).then(data => {
            setActivities(data);
            setLoading(false);
        });
    })

    return (
        <Container>
            <ActivitySpinner show={loading} displayText="Fetching Activities" />
            <Row className="justify-content-center"><h1>Review Activities</h1></Row>
            {activities.map(activity =>
                <Card>
                    <Card.Body>
                        <ReportActivity activity={activity} />
                    </Card.Body>
                </Card>
            )}
        </Container>
    )
}