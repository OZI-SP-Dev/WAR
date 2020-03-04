import React from 'react';
import { Component } from 'react';
import { Container, Accordion, Row, Col, Card, Button } from 'react-bootstrap';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

class MyItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listData: [
        {
          ID: '1', Title: 'SP BAC', WeekOf: '3/1/2020', Branch: 'OZI',
          InterestItems: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi euismod lacus ac sagittis mollis. Nulla ut quam sed nisl pulvinar cursus sit amet eget lacus. Suspendisse rutrum pulvinar tortor ut vehicula. Nunc non arcu imperdiet, semper urna at, facilisis lectus. Phasellus risus magna, dignissim vel consequat ac, tincidunt in lacus. Aliquam euismod fringilla mauris, ac bibendum quam pulvinar vitae. Donec iaculis accumsan mi sed tincidunt. Proin accumsan, massa vitae malesuada porta, mauris purus facilisis sem, vel laoreet magna urna eget nulla. Phasellus convallis ipsum a convallis tincidunt.\n\nNam in leo velit. Mauris at ullamcorper leo. In tortor ligula, efficitur et diam sit amet, tincidunt finibus ligula. Aliquam finibus egestas justo ut posuere. Vestibulum pharetra, tellus et finibus pellentesque, dui leo consectetur augue, sit amet pharetra nisl velit sed sapien. Quisque non nunc turpis. Donec eu erat mauris. In et tincidunt enim. Donec luctus eu lectus sed scelerisque. Nulla iaculis ultricies lectus, nec eleifend ipsum auctor a. Quisque sed massa eros.',
          ActionItems: 'Informational.', OPRs: 'Robert Porterfield; Jeremy Clark'
        },
        {
          ID: '2', Title: 'SP Support', WeekOf: '3/1/2020', Branch: 'OZI',
          InterestItems: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi euismod lacus ac sagittis mollis. Nulla ut quam sed nisl pulvinar cursus sit amet eget lacus. Suspendisse rutrum pulvinar tortor ut vehicula. Nunc non arcu imperdiet, semper urna at, facilisis lectus. Phasellus risus magna, dignissim vel consequat ac, tincidunt in lacus. Aliquam euismod fringilla mauris, ac bibendum quam pulvinar vitae. Donec iaculis accumsan mi sed tincidunt. Proin accumsan, massa vitae malesuada porta, mauris purus facilisis sem, vel laoreet magna urna eget nulla. Phasellus convallis ipsum a convallis tincidunt.\n\nNam in leo velit. Mauris at ullamcorper leo. In tortor ligula, efficitur et diam sit amet, tincidunt finibus ligula. Aliquam finibus egestas justo ut posuere. Vestibulum pharetra, tellus et finibus pellentesque, dui leo consectetur augue, sit amet pharetra nisl velit sed sapien. Quisque non nunc turpis. Donec eu erat mauris. In et tincidunt enim. Donec luctus eu lectus sed scelerisque. Nulla iaculis ultricies lectus, nec eleifend ipsum auctor a. Quisque sed massa eros.',
          ActionItems: 'Informational.', OPRs: 'Robert Porterfield'
        }
      ],
      isLoading: false,
      newItem: false,
      newID: 3
    };
  }

  saveItem = ID => {
    // do some saving here
    let listData = this.state.listData;
    let itemIndex = listData.findIndex(item => item.ID === ID);
    let item = listData[itemIndex];
    item.Title = 'New Title';
    item.InterestItems = 'New Interests';
    item.ActionItems = 'New Actions!';
    listData[itemIndex] = item;
    if (ID === 'New') {
      item.ID = this.state.newID;
      // Probably not thread safe - just for easy testing
      this.setState({ listData, newItem: false, newID: item.ID + 1 });
    }
    this.setState({ listData });
  };

  deleteItem = ID => {
    // delete operation to remove item
    let newData = this.state.listData.filter(el => el.ID !== ID);
    this.setState({ listData: newData });
  };

  newItem = () => {
    let item = {
      ID: 'New', Title: 'New Item', WeekOf: '3/1/2020', Branch: 'OZI',
      InterestItems: 'Items of interest...',
      ActionItems: 'Informational.', OPRs: 'Robert Porterfield'
    }
    let newData = this.state.listData;
    newData.push(item);
    this.setState({ listData: newData, newItem: true });
  }

  renderCards = (weekOf) => {
    const data = this.state.listData;

    const mapRows = data.map((item, index) => (
      <Col xl={6} className="mb-3" key={item.ID}>
        <Card>
          <Card.Body>
            <Card.Title>Activity/Purpose: <span ref="Title" contentEditable="true" spellCheck="true">{item.Title}</span></Card.Title>
            <Card.Text>
              <strong>Specific items of interest:</strong> <span ref="InterestItems" contentEditable="true" spellCheck="true">{item.InterestItems}</span><br />
              <strong>Action items for {item.Branch}:</strong> <span ref="ActionItems" contentEditable="true" spellCheck="true">{item.ActionItems}</span><br />
              <strong>OPRs:</strong> <span contentEditable="true">{item.OPRs}</span>
            </Card.Text>
            {//<Button className="float-right" variant="primary" onClick={() => this.saveItem(item.ID)}>Save</Button>
            }
          </Card.Body>
        </Card>
      </Col>
    ));
    return mapRows;
  };

  render() {
    return (
      <Container className="mb-3" >
        <Accordion defaultActiveKey="0">
          <Row className="justify-content-md-center"><h1>My Items</h1></Row>
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="0">
              Period of Accomplishments: 2 - 6 Mar 2020
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
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="1">
              Period of Accomplishments: 9 - 13 Mar 2020
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="1">
              <Card.Body>
                <Row>
                  {this.renderCards('2/23/2020')}
                </Row>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </Container>
    );
  }
}

export default MyItems;
