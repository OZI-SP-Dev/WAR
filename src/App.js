import React from 'react';
import { Component } from 'react'
import logo from './logo.svg';
import './App.css';

import AppHeader from './AppHeader';
import AppLeftNav from './AppLeftNav';
import TestList from './TestList';

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

    this.setState({ isLoading: true });

    web.currentUser.get().then(r => {
      this.setState({ DisplayName: r['Title'], isLoading: false });
    }, e => {
      this.setState({ DisplayName: 'Unknown User', isLoading: false });
    });
  }

  render() {
    return (
      <div className="App">
        <AppHeader />
        <div id="top" className="container-fluid">
          <div class="row">
            <AppLeftNav />
            <main class="col-md-9 ml-sm-auto col-lg-10 px-4" role="main">
              <div class="App-react">
              <img src={logo} className="App-logo" alt="logo" />
              <p>
                Edit <code>src/App.js</code> and save to reload.
              </p>
                Welcome <h1>{this.state.DisplayName}</h1>
              </div>
              <TestList />
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
