import React from 'react';
import { Spinner } from 'react-bootstrap';

export interface IActivitySpinnerProps {
    show: boolean,
    displayText: string
}

export const ActivitySpinner: React.FunctionComponent<IActivitySpinnerProps> = (props) => {

    return (
        <>
            {props.show &&
                <div className="spinner">
                    <Spinner animation="border" role="status">
                        <span className="sr-only">{props.displayText}</span>
                    </Spinner>
                </div>}
        </>
    );
}

export default ActivitySpinner;