import { IconButton } from "@fluentui/react";
import React, { useState } from "react";
import { Card } from "react-bootstrap";
import { IActivity } from "../../api/ActivitiesApi";
import DateUtilities from '../../utilities/DateUtilities';
import './Activities.css';
import ConfirmSubmitPopover from "./ConfirmSubmitPopover";

export interface IActivityCardProps {
    activity: IActivity,
    className: string,
    onClick: Function,
    copyOnClick?: (activity: IActivity) => void
}

export const ActivityCard: React.FunctionComponent<IActivityCardProps> = ({ activity, className, onClick, copyOnClick }) => {

    const [showCopyPopover, setShowCopyPopover] = useState<boolean>(false);
    const [popoverTarget, setPopoverTarget] = useState<any>(null);

    return (
        <Card className={`activity ${className}`}
            onClick={(e: any) => {
                if (!showCopyPopover) {
                    onClick(activity);
                }
            }}>
            <Card.Body>
                <Card.Title>
                    Activity/Purpose: <span>{activity.Title}</span>
                    {copyOnClick && <>
                        <ConfirmSubmitPopover
                            title="Confirm Copy"
                            text="Are you sure you would like to copy this Activity?"
                            show={showCopyPopover}
                            target={popoverTarget}
                            handleSubmit={(e: any) => {
                                e.stopPropagation(); // don't want the card's onClick to be called
                                setShowCopyPopover(false);
                                copyOnClick(activity);
                            }}
                            handleClosePopoverClick={() => setShowCopyPopover(false)}
                            handleClickOutside={() => setShowCopyPopover(false)}
                            buttonVariant="primary"
                        />
                        <IconButton onClick={(e) => {
                            e.stopPropagation(); // don't want the card's onClick to be called
                            setShowCopyPopover(true);
                            setPopoverTarget(e.target);
                        }}
                            iconProps={{ iconName: 'Copy' }}
                            title="Copy"
                            ariaLabel="Copy"
                            className="float-right activity-copy" />
                    </>}
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