import React from 'react';
import { Component } from 'react';
import { Table, Button } from 'react-bootstrap';
import { Web } from '@pnp/sp/webs';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

class TestList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listData: [
        { ID: '1', Title: 'A Title', myColumn: 'My Column' },
        { ID: '2', Title: 'A second title!', myColumn: 'More than one column?!' }
      ],
      isLoading: false
    };
  }

  componentDidMount() {
    //TODO move web to a provider
    const web = new Web('https://usaf.dps.mil/teams/10251').configure({
      headers: { "Accept": "application/json; odata=verbose" }
    });

    this.setState({ isLoading: true });
    web.lists.getByTitle("testlist").items.get().then(r => {
      console.log(r);
      this.setState({ isLoading: false, listData: r });
    }, e => {
      this.setState({ isLoading: false });
    });
  }

  deleteItem = ID => {
    // delete operation to remove item
    let newData = this.state.listData.filter( el => el.ID !== ID ); 
    this.setState({ listData: newData });
  };

  renderItems = () => {
    const data = this.state.listData;

    const mapRows = data.map((item, index) => (
      <tr key={item.ID}>
        <td>{item.ID}</td>
        <td>{item.Title}</td>
        <td>{item.myColumn}</td>
        <td>
          <Button onClick={() => this.deleteItem(item.ID)}>
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
      </div>
    );
  }
}

export default TestList;
