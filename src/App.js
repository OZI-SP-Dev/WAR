import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Activities from './components/Activities/Activities';
import AppHeader from './components/appHeader/AppHeader';
import AppLeftNav from './components/appLeftNav/AppLeftNav';
import Help from './components/Help/Help';
import TestList from './components/testList/TestList';
import { UserProvider, UserContext } from './providers/UserProvider';
import { ContactUsProvider } from './components/ContactUs/ContactUsProvider';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <UserProvider>
            <ContactUsProvider>
              <AppHeader />
              <div id="top" className="container-fluid">
                <div className="row">
                  <AppLeftNav />
                  <main className="col-md-9 ml-sm-auto col-lg-10 px-4" role="main">
                    <Switch>
                      <Route path="/Help">
                        <Help />
                      </Route>
                      <Route path="/">
                        <UserContext.Consumer>
                          {user => (
                            user.loading ?
                              <>Loading...</> :
                              <Activities user={user} />
                          )}
                        </UserContext.Consumer>
                      </Route>
                      <Router path="/TestLIst">
                        <TestList />
                      </Router>
                    </Switch>
                  </main>
                </div>
              </div>
            </ContactUsProvider>
          </UserProvider>
        </div>
      </Router>
    );
  }
}

export default App;