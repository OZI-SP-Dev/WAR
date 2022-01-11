import React, { ElementType, useEffect, useState } from "react";
import { Accordion, Badge } from "react-bootstrap";


export interface ICustomToggleAccordionProps {
    children: any,
    className: string,
    badge?: string,
    header: string,
    as: ElementType,
    headerClassName?: string,
    defaultOpen?: boolean
}

export const CustomToggleAccordion: React.FunctionComponent<ICustomToggleAccordionProps> = (props) => {

    let [isOpen,setOpen]=useState((props.defaultOpen || props.defaultOpen === undefined) ? "0" : "");

    const accordionClicked = () => {
        setOpen((isOpen
            )=>(isOpen ? "" : "0"));
    }

    // If the defaultOpen value changes, then set the open/close status accordingly
    useEffect(() => {
            setOpen((props.defaultOpen || props.defaultOpen === undefined) ? "0" : "");
    }, [props.defaultOpen]);

    return (
        <Accordion activeKey={isOpen} className={props.className}>
            <Accordion.Toggle
                eventKey="0"
                as={props.as}
                className={props.headerClassName}
                onClick={accordionClicked}
            >
                {props.header}
                {props.badge && <Badge className="ml-2" variant="secondary">{props.badge}</Badge>}
                <div className={isOpen ? 'arrow-down float-right' : 'arrow-right float-right'} />
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
                {props.children}
            </Accordion.Collapse>
        </Accordion>
    );
}