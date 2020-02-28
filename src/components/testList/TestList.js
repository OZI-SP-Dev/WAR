import React from 'react';
import TestListModal from '../testListModal/TestListModal';
import { Component } from 'react';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { spWebContext } from '../../providers/SPWebContext';

class TestList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listData: [
        { ID: '1', Title: 'A Title', myColumn: 'My Column' },
        { ID: '2', Title: 'A second title!', myColumn: 'More than one column?!' }
      ],
      isLoading: false,
      showAddModal: false,
      newItemTitle: "",
      newItemDescription: "",
      showDeleteModal: false,
      deleteItemId: -1
    };
    this.web = spWebContext;
  }

  componentDidMount() {
    this.fetchItems();
  }

  fetchItems = () => {
    this.setState({ isLoading: true });
    this.web.lists.getByTitle("testlist").items.get().then(r => {
      console.log(r);
      this.setState({ isLoading: false, listData: r });
    }, e => {
      console.error(e);
      this.setState({ isLoading: false });
    });
  }

  deleteItem = () => {
    this.web.lists.getByTitle("testlist").items.getById(this.state.deleteItemId).delete().then(this.fetchItems);
    this.clearAndCloseModals();
  };

  submitAddItem = () => {
    console.log(`Submitting new item ${this.state.newItemTitle}!`);
    this.web.lists.getByTitle("testlist").items.add({
      Title: this.state.newItemTitle,
      myColumn: this.state.newItemDescription
    }).then(this.fetchItems, e => console.error(e));
    this.clearAndCloseModals();
  }

  clearAndCloseModals = () => {
    this.setState({
      showAddModal: false,
      newItemTitle: "",
      newItemDescription: "",
      showDeleteModal: "",
      deleteItemId: -1
    });
  }

  renderItems = () => {
    const data = this.state.listData;

    const mapRows = data.map((item, index) => (
      <tr key={item.ID}>
        <td>{item.ID}</td>
        <td>{item.Title}</td>
        <td>{item.myColumn}</td>
        <td>
          <Button  
            variant="danger" 
            onClick={() => this.setState({ showDeleteModal: true, deleteItemId: item.ID })}>
            Delete Item
          </Button>
        </td>
      </tr>
    ));
    return mapRows;
  };

  render() {
    return (
      <div className="card">
        <h4 className="card-header">TestList Data</h4>
        <div className="card-body">
          <Row>
            <Col md={{ span: 1, offset: 11 }}>
              <Button
                variant="primary"
                style={{ marginBottom: '10%' }}
                onClick={() => this.setState({ showAddModal: true })}>
                Add Item
              </Button>
            </Col>
          </Row>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>My Column</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {this.renderItems()}
            </tbody>
          </Table>
        </div>
        <TestListModal
          modalDisplayName="Create New Item"
          submitButtonVariant="primary"
          submitButtonText="Create"
          show={this.state.showAddModal}
          handleSubmit={this.submitAddItem}
          handleClose={this.clearAndCloseModals}
        >
          <Form onSubmit={this.submitAddItem}>
            <Form.Group controlId="addItemFormTitle">
              <Form.Label>Item Title</Form.Label>
              <Form.Control
                type="text"
                name="newItemTitle"
                value={this.state.newItemTitle}
                onChange={(e) => this.setState({ newItemTitle: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="addItemFormDescription">
              <Form.Label>Item Description</Form.Label>
              <Form.Control
                type="text"
                name="newItemDescription"
                value={this.state.newItemDescription}
                onChange={(e) => this.setState({ newItemDescription: e.target.value })}
              />
            </Form.Group>
          </Form>
        </TestListModal>
        <TestListModal
          modalDisplayName="Confirm Deletion"
          submitButtonVariant="danger"
          submitButtonText="Delete"
          show={this.state.showDeleteModal}
          handleSubmit={this.deleteItem}
          handleClose={this.clearAndCloseModals}
        >
          <p>Are you sure that you want to delete Item {this.state.deleteItemId}?</p>
        </TestListModal>
      </div>
    );
  }
}

export default TestList;
