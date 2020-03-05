import React from 'react';

class ItemAccordion extends Component {

    constructor(props) {
        super(props);
        this.month = props.weekStart.toLacaleString('default', { month: 'short' });
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
                        Period of Accomplishments: {`${this.formatDate(this.props.weekStart)} - ${this.endWeek}`}
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body>
                            <Row>
                                {this.renderCards('3/1/2020')}
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    <Button disabled={this.state.newItem} className="float-right" variant="primary" onClick={() => this.newItem()}>New</Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        );
    }
}