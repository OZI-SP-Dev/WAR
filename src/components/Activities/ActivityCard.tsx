import { IconButton } from "@fluentui/react";
import React, { useState } from "react";
import { Card } from "react-bootstrap";
import { IActivity } from "../../api/ActivitiesApi";
import DateUtilities from '../../utilities/DateUtilities';
import './Activities.css';
import ConfirmSubmitPopover from "./ConfirmSubmitPopover";

export interface IActivityCardProps {
    activity: IActivity,
    className?: string,
    onClick: (activity: IActivity) => void,
    copyOnClick?: (activity: IActivity) => void
}

export const ActivityCard: React.FunctionComponent<IActivityCardProps> = (props) => {

    const [showCopyPopover, setShowCopyPopover] = useState<boolean>(false);
    const [popoverTarget, setPopoverTarget] = useState<any>(null);

    return (
        <Card className={`activity ${props.className ? props.className : ''}`}
            onClick={(e: any) => {
                if (!showCopyPopover) {
                    props.onClick(props.activity);
                }
            }}>
            <Card.Body>
                <Card.Title>
                    Activity/Purpose: <span>{props.activity.Title}</span>
                    {props.copyOnClick && <>
                        <ConfirmSubmitPopover
                            title="Confirm Copy"
                            text="Are you sure you would like to copy this Activity?"
                            show={showCopyPopover}
                            target={popoverTarget}
                            handleSubmit={(e: any) => {
                                e.stopPropagation(); // don't want the card's onClick to be called
                                setShowCopyPopover(false);
                                if (props.copyOnClick) {
                                    props.copyOnClick(props.activity);
                                }
                            }}
                            handleClosePopoverClick={() => setShowCopyPopover(false)}
                            buttonVariant="primary"
                            submitting={false}
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
                    <strong>Week of:</strong> {DateUtilities.getDate(props.activity.WeekOf).format("MM/DD/YYYY")}<br />
                    <strong>Action Taken/In Work:</strong> <span style={{ whiteSpace: 'pre-line' }}>{props.activity.ActionTaken}</span><br />
                    <strong>Branch: </strong><span>{props.activity.Branch}</span><br />
                    <strong>OPRs:</strong> {props.activity.OPRs && props.activity.OPRs.results && props.activity.OPRs.results.map((OPR: any, index: number, array: any[]) =>
                        (<span key={OPR.Id}> {OPR.Title}{array.length - 1 > index ? ';' : ''} </span>))}<br />
                    {props.activity.IsMarEntry ? <span className="mar">MAR Item</span> : ''}
                    {props.activity.IsHistoryEntry ? <span className="history">History Item</span> : ''}
                </Card.Text>
            </Card.Body>
        </Card>
    );
}