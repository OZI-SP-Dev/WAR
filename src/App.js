import React from 'react';
import { Component } from 'react'
import './App.css';

import { HashRouter as Router, Switch, Route } from 'react-router-dom';

import AppHeader from './components/appHeader/AppHeader';
import AppLeftNav from './components/appLeftNav/AppLeftNav';
import TestList from './components/testList/TestList';
import { UserProvider } from './providers/UserProvider';
import Help from './components/Help/Help';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Router>
        <div>
          <UserProvider>
            <AppHeader />
          </UserProvider>
          <div id="top" className="container-fluid">
            <div className="row">
              <AppLeftNav />
              <main className="col-md-9 ml-sm-auto col-lg-10 px-4" role="main">
                <Switch>
                  <Route path="/Help">
                    <Help />
                  </Route>
                  <Route path="/">
                    <TestList />
                  </Route>
                </Switch>
              </main>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;