import React from "react";
import { Card } from "react-bootstrap";
import { IActivity } from "../../api/ActivitiesApi";
import moment from "moment";

export interface IActivityCardProps {
    activity: IActivity,
    className: string,
    onClick: Function
}

export const ActivityCard: React.FunctionComponent<IActivityCardProps> = ({ activity, className, onClick }) => {

    return (
        <Card className={`activity ${className}`}
            onClick={() => onClick(activity)}>
            <Card.Body>
                <Card.Title>Activity/Purpose: <span>{activity.Title}</span></Card.Title>
                <Card.Text as="div">
                    <strong>Week of:</strong> {moment(activity.WeekOf).format("DD/MM/YYYY")}<br />
                    <strong>Action Taken/In Work</strong> <span style={{ whiteSpace: 'pre-line' }}>{activity.ActionTaken}</span><br />
                    <strong>Branch: </strong><span>{activity.Branch}</span><br />
                    <strong>OPRs:</strong> <span >{activity.TextOPRs}</span>
                    {//TODO Change to people picker
                    }
                </Card.Text>
            </Card.Body>
        </Card>
    );
}