import React from 'react';
import { Accordion, Button, Card, Col, Row } from 'react-bootstrap';

class ItemAccordion extends Component {

    constructor(props) {
        super(props);
        this.endWeek = new Date(props.weekStart);
        this.endWeek.setDate(props.weekStart.getDate() + 6);
    }

    formatDate = (date) => {
        return `${date.getDate()} ${date.toLacaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    }

    render() {
        return (
            <Accordion defaultActiveKey="0" className="mb-3">
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="0">
                        Period of Accomplishments: {`${this.formatDate(this.props.weekStart)} - ${this.formatDate(this.endWeek)}`}
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body>
                            <Row>
                                <ActivityCardsWeek weekStart={this.props.weekStart} actions={this.props.actions} />
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    <Button disabled={this.props.disableNewButton} className="float-right" variant="primary" onClick={this.props.newButtonOnClick}>New</Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        );
    }
}