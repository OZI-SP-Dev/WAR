import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Activities from './components/Activities/Activities';
import AppHeader from './components/appHeader/AppHeader';
import AppLeftNav from './components/appLeftNav/AppLeftNav';
import { ContactUsProvider } from './components/ContactUs/ContactUsProvider';
import Help from './components/Help/Help';
import WeeklyReport from "./components/WeeklyReport/WeeklyReport";
import { UserContext, UserProvider } from './providers/UserProvider';

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
                      <Route path="/WAR">
                        <WeeklyReport />
                      </Route>
                      <Route exact path="/(Activities)?">
                        <UserContext.Consumer>
                          {user => (
                            user.loading ?
                              <>Loading...</> :
                              <Activities user={user} />
                          )}
                        </UserContext.Consumer>
                      </Route>
                      <Route path="*">
                        <NoMatch />
                      </Route>
                    </Switch>
                  </main>
                </div>
              </div>
            </ContactUsProvider>
          </UserProvider>
        </div>
      </Router >
    );
  }
}

function NoMatch() {
  return (
    <div><h1>Page not found.</h1></div>
  );
}
export default App;