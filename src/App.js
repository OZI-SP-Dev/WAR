import React from 'react';
import { Component } from 'react'
import logo from './logo.svg';
import './App.css';
import { Button } from 'react-bootstrap';
import { Web } from '@pnp/sp/webs';
import '@pnp/sp/site-users';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      SiteTitle: null,
      DisplayName: null,
      isLoading: false
    };
  }

  componentDidMount() {
    const web = new Web('https://cs2.eis.af.mil/sites/10251').configure({
      headers: { "Accept": "application/json; odata=verbose" }
    });

    this.setState({isLoading: true});
    web.select("Title")().then(w => {
      let title = w.Title;
      this.setState({ SiteTitle: title, isLoading: false });
    }, e => {
      this.setState({ SiteTitle: 'Error Title', isLoading: false });
    });

    web.currentUser.get().then(r => {
      this.setState({DisplayName: r['Title']}); 
    }, e => {
      this.setState({DisplayName: 'Unknown User'});
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Welcome <h1>{this.state.DisplayName}</h1>
          </a>
        </header>
        <Button variant="link" className="mr-2">Link</Button>
      </div>
    );
  }
}

export default App;
