import React, { useRef } from 'react';
import { Button, Overlay, Popover, Spinner } from 'react-bootstrap';
import { useOutsideClickDetect } from '../../hooks/useOutsideClickDetect';

export interface IConfirmSubmitPopoverProps {
    show: boolean,
    target: any,
    title: string,
    text: string,
    submitting: boolean,
    buttonVariant: "primary" | "danger",
    handleClosePopoverClick: () => void,
    handleSubmit: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export const ConfirmSubmitPopover: React.FunctionComponent<IConfirmSubmitPopoverProps> = (props) => {

    const wrapperRef = useRef(null);
    useOutsideClickDetect(wrapperRef, props.handleClosePopoverClick);

    return (
        <Overlay
            show={props.show}
            placement="top"
            target={props.target}
        >
            <Popover id={"delete-popover"}>
                <div ref={wrapperRef}>
                    <Popover.Title as="h3">{props.title}</Popover.Title>
                    <Popover.Content>
                        <p>{props.text}</p>
                        <Button
                            className="float-left mb-2"
                            variant="secondary"
                            onClick={() => props.handleClosePopoverClick()}
                        >
                            Close
                        </Button>
                        <Button
                            className="float-right mb-2"
                            disabled={props.submitting}
                            variant={props.buttonVariant}
                            onClick={(e) => props.handleSubmit(e)}
                        >
                            {props.submitting && <Spinner as="span" size="sm" animation="grow" role="status" aria-hidden="true" />}
                            {' '}Confirm
                        </Button>
                    </Popover.Content>
                </div>
            </Popover>
        </Overlay>
    );
}

export default ConfirmSubmitPopover;