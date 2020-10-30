import { IconButton } from "@fluentui/react";
import React from "react";
import { Card } from "react-bootstrap";
import { IActivity } from "../../api/ActivitiesApi";
import DateUtilities from '../../utilities/DateUtilities';
import './Activities.css';

export interface IActivityCardProps {
    activity: IActivity,
    className: string,
    onClick: Function,
    copyOnClick?: (activity: IActivity) => void
}

export const ActivityCard: React.FunctionComponent<IActivityCardProps> = ({ activity, className, onClick, copyOnClick }) => {

    return (
        <Card className={`activity ${className}`}
            onClick={() => onClick(activity)}>
            <Card.Body>
                <Card.Title>
                    Activity/Purpose: <span>{activity.Title}</span>
                    {copyOnClick && <IconButton onClick={(e) => {
                        e.stopPropagation(); // don't want the card's onClick to be called
                        copyOnClick(activity);
                    }}
                        iconProps={{ iconName: 'Copy' }}
                        title="Copy"
                        ariaLabel="Copy"
                        className="float-right activity-copy" />}
                </Card.Title>
                <Card.Text as="div">
                    <strong>Week of:</strong> {DateUtilities.getDate(activity.WeekOf).format("MM/DD/YYYY")}<br />
                    <strong>Action Taken/In Work:</strong> <span style={{ whiteSpace: 'pre-line' }}>{activity.ActionTaken}</span><br />
                    <strong>Branch: </strong><span>{activity.Branch}</span><br />
                    <strong>OPRs:</strong> {activity.OPRs && activity.OPRs.results && activity.OPRs.results.map((OPR: any, index: number, array: any[]) =>
                        (<span key={OPR.Id}> {OPR.Title}{array.length - 1 > index ? ';' : ''} </span>))}<br />
                    {activity.IsMarEntry ? <span className="mar">MAR Item</span> : ''}
                    {activity.IsHistoryEntry ? <span className="history">History Item</span> : ''}
                </Card.Text>
            </Card.Body>
        </Card>
    );
}