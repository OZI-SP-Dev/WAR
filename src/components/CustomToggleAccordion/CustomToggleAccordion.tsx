import React, { ElementType, useState } from "react";
import { Accordion, Badge, useAccordionToggle } from "react-bootstrap";

interface ICustomToggleProps {
  children: any;
  className?: string;
  eventKey: any;
  as: ElementType;
  defaultOpen?: boolean;
}

function CustomToggle({
  children,
  className,
  eventKey,
  as,
  defaultOpen,
}: ICustomToggleProps) {
  const [open, setOpen] = useState<boolean>(
    defaultOpen === undefined ? true : defaultOpen
  );
  const accordionOnClick = useAccordionToggle(eventKey, () => onClick());

  const onClick = () => {
    setOpen(!open);
  };

  const arrow = (
    <div
      className={open ? "arrow-down float-right" : "arrow-right float-right"}
    />
  );

  return React.createElement(
    as,
    { className, style: { cursor: "pointer" }, onClick: accordionOnClick },
    children,
    arrow
  );
}

export interface ICustomToggleAccordionProps {
  children: any;
  className: string;
  badge?: string;
  header: string;
  as: ElementType;
  headerClassName?: string;
  defaultOpen?: boolean;
}

export const CustomToggleAccordion: React.FunctionComponent<
  ICustomToggleAccordionProps
> = (props) => {
  return (
    <Accordion
      defaultActiveKey={
        props.defaultOpen || props.defaultOpen === undefined ? "0" : ""
      }
      className={props.className}
    >
      <CustomToggle
        eventKey="0"
        as={props.as}
        defaultOpen={props.defaultOpen || props.defaultOpen === undefined}
        className={props.headerClassName}
      >
        {props.header}
        {props.badge && (
          <Badge className="ml-2" variant="secondary">
            {props.badge}
          </Badge>
        )}
      </CustomToggle>
      <Accordion.Collapse eventKey="0">{props.children}</Accordion.Collapse>
    </Accordion>
  );
};
