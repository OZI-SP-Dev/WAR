import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Activities from './components/Activities/Activities';
import AppHeader from './components/appHeader/AppHeader';
import AppLeftNav from './components/appLeftNav/AppLeftNav';
import Help from './components/Help/Help';
import TestList from './components/testList/TestList';
import { UserProvider, UserContext } from './providers/UserProvider';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <UserProvider>
            <AppHeader />
            <div id="top" className="container-fluid">
              <div className="row">
                <AppLeftNav />
                <main className="col-md-9 ml-sm-auto col-lg-10 px-4" role="main">
                  <Switch>
                    <Route path="/Help">
                      <Help />
                    </Route>
                    <Route path="/Activities">
                      <UserContext.Consumer>
                        {user => (
                          user.loading ? 
                          <>Loading...</> :
                          <Activities user={user} />
                        )}
                      </UserContext.Consumer>
                    </Route>
                    <Route path="/">
                      <TestList />
                    </Route>
                  </Switch>
                </main>
              </div>
            </div>
          </UserProvider>
        </div>
      </Router>
    );
  }
}

export default App;