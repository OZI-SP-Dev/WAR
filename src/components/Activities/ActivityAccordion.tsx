import { Moment } from 'moment';
import React, { useEffect, useState } from 'react';
import { Accordion, Badge, Button, Card, Col, Row } from 'react-bootstrap';
import { IActivity } from '../../api/ActivitiesApi';
import DateUtilities from '../../utilities/DateUtilities';
import ActivityCardsWeek from './ActivityCardsWeek';

export interface IActivityAccordionProps {
  weekOf: Moment,
  activities: IActivity[],
  disableNewButton: boolean,
  showNewButton: boolean,
  newButtonOnClick: () => void,
  cardOnClick: (activity: IActivity) => void,
  copyOnClick: (activity: IActivity) => void
}

export const ActivityAccordion: React.FunctionComponent<IActivityAccordionProps> = (props) => {

  const [open, setOpen] = useState<boolean>(false);

  const startWeek = DateUtilities.getDate(props.weekOf);
  const endWeek = DateUtilities.getDate(props.weekOf);
  endWeek.add(6, 'days');
  let currentWeek = DateUtilities.getStartOfWeek();
  const isThisWeek = DateUtilities.datesAreEqual(startWeek, currentWeek);

  const getFilteredActivities = () => {
    return props.activities.filter(activity => DateUtilities.datesAreEqual(DateUtilities.getDate(activity.WeekOf), startWeek));
  }

  const accordionClicked = () => {
    setOpen(!open);
  }

  const formatDate = (date: Moment) => {
    //using 'default' was causing Edge to puke
    return date.format("DD MMM YYYY");
  }

  useEffect(() => {
    if (isThisWeek) {
      setOpen(true);
    }
  }, [isThisWeek]);

  let filteredActivities = getFilteredActivities();
  return (
    <Accordion defaultActiveKey={isThisWeek ? "0" : ""} className="mb-3">
      <Card>
        <Accordion.Toggle as={Card.Header} eventKey="0" style={{ cursor: 'pointer' }} onClick={accordionClicked}>
          Period of Accomplishments: {`${formatDate(startWeek)} - ${formatDate(endWeek)} `}
          <Badge variant="secondary">{filteredActivities.length}</Badge>
          <div className={open ? 'arrow-down float-right' : 'arrow-right float-right'} />
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            <Row>
              <ActivityCardsWeek
                activities={filteredActivities}
                onClick={props.cardOnClick}
                copyOnClick={props.copyOnClick}
              />
            </Row>
            <Row>
              <Col xs={12}>
                {props.showNewButton && <Button disabled={props.disableNewButton} className="float-right" variant="primary" onClick={props.newButtonOnClick}>New</Button>}
              </Col>
            </Row>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}

export default ActivityAccordion;
