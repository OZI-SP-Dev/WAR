import { useState } from "react";
import { useAccordionToggle, Accordion, Badge } from "react-bootstrap";
import React from "react";

interface ICustomToggleProps {
    children: any,
    className?: string,
    eventKey: any,
    headerSize: 1 | 2 | 3 | 4 | 5 | 6,
    defaultOpen?: boolean
}

function CustomToggle({ children, className, eventKey, headerSize, defaultOpen }: ICustomToggleProps) {
    const [open, setOpen] = useState<boolean>(defaultOpen === undefined ? true : defaultOpen);
    const accordionOnClick = useAccordionToggle(eventKey, () =>
        onClick()
    );

    const onClick = () => {
        setOpen(!open)
    }

    const arrow = <div className={open ? 'arrow-down float-right' : 'arrow-right float-right'} />

    const headers = [
        <h1 className={className} style={{ cursor: 'pointer' }} onClick={accordionOnClick}>
            {children}
            {arrow}
        </h1>,
        <h2 className={className} style={{ cursor: 'pointer' }} onClick={accordionOnClick}>
            {children}
            {arrow}
        </h2>,
        <h3 className={className} style={{ cursor: 'pointer' }} onClick={accordionOnClick}>
            {children}
            {arrow}
        </h3>,
        <h4 className={className} style={{ cursor: 'pointer' }} onClick={accordionOnClick}>
            {children}
            {arrow}
        </h4>,
        <h5 className={className} style={{ cursor: 'pointer' }} onClick={accordionOnClick}>
            {children}
            {arrow}
        </h5>,
        <h6 className={className} style={{ cursor: 'pointer' }} onClick={accordionOnClick}>
            {children}
            {arrow}
        </h6>
    ]

    return headers[headerSize - 1]
}

export interface ICustomToggleAccordionProps {
    children: any,
    className: string,
    badge?: string,
    header: string,
    headerSize: 1 | 2 | 3 | 4 | 5 | 6,
    headerClassName?: string,
    defaultOpen?: boolean
}

export const CustomToggleAccordion: React.FunctionComponent<ICustomToggleAccordionProps> = (props) => {

    return (
        <Accordion defaultActiveKey={props.defaultOpen || props.defaultOpen === undefined ? "0" : ""} className={props.className}>
            <CustomToggle
                eventKey="0"
                headerSize={props.headerSize}
                defaultOpen={props.defaultOpen || props.defaultOpen === undefined}
                className={props.headerClassName}
            >
                {props.header}
                {props.badge && <Badge className="ml-2" variant="secondary">{props.badge}</Badge>}
            </CustomToggle>
            <Accordion.Collapse eventKey="0">
                {props.children}
            </Accordion.Collapse>
        </Accordion>
    );
}