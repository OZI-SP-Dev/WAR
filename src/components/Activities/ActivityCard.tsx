import React from "react";
import { Card } from "react-bootstrap";
import { IActivity } from "../../api/ActivitiesApi";
import moment from "moment";
import './Activities.css';

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
                    <strong>Week of:</strong> {moment(activity.WeekOf).format("MM/DD/YYYY")}<br />
                    <strong>Action Taken/In Work:</strong> <span style={{ whiteSpace: 'pre-line' }}>{activity.ActionTaken}</span><br />
										<strong>Branch: </strong><span>{activity.Branch}</span><br />
										<strong>OPRs:</strong> {activity.OPRs && activity.OPRs.results && activity.OPRs.results.map((OPR: any, index: number, array: any[]) =>
											(<span key={OPR.Id}> {OPR.Title}{array.length - 1 > index ? ';' : ''} </span>))}<br />
										{activity.IsBigRock ? <span className="big-rock">Big Rock</span> : ''}
										{activity.IsHistoryEntry ? <span className="history">History Item</span> : ''}
                </Card.Text>
            </Card.Body>
        </Card>
    );
}