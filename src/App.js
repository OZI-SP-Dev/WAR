import React from 'react';
import { Component } from 'react'
import logo from './logo.svg';
import './App.css';

import AppHeader from './AppHeader';
import AppLeftNav from './AppLeftNav';
import TestList from './TestList';
import { UserProvider } from './UserProvider';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      SiteTitle: null,
      DisplayName: null,
      isLoading: false,
      UserContext: React.createContext('Test User')
    };
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="App">
        <UserProvider>
          <AppHeader />
        </UserProvider>
        <div id="top" className="container-fluid">
          <div className="row">
            <AppLeftNav />
            <main className="col-md-9 ml-sm-auto col-lg-10 px-4" role="main">
              <div className="App-react">
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
