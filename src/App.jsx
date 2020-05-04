import React, { Component } from 'react';
import { HashRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import Activities from './components/Activities/Activities';
import AppHeader from './components/appHeader/AppHeader';
import AppLeftNav from './components/appLeftNav/AppLeftNav';
import Help from './components/Help/Help';
import { Roles } from './components/Roles/Roles';
import { RolesProvider } from "./components/Roles/RolesContext";
import { UserProvider, UserContext } from './providers/UserProvider';
import { ContactUsProvider } from './components/ContactUs/ContactUsProvider';
import WeeklyReport from "./components/WeeklyReport/WeeklyReport";
import BigRocksReport from './components/WeeklyReport/BigRocksReport';
import HistoryReport from './components/WeeklyReport/HistoryReport';
import RoleUtilities from './utilities/RoleUtilities';
import { Review } from './components/Review/Review';

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
                      <Route path="/BigRocks">
                        <BigRocksReport />
                      </Route>
                      <Route path="/HistoryReport">
                        <HistoryReport />
                      </Route>
                      <Route path="/WAR">
                        <WeeklyReport />
                      </Route>
                      <Route path="/RoleManagement">
                        <UserContext.Consumer>
                          {user => (
                            user.loading ?
                              <>Loading...</> :
                              RoleUtilities.userCanAccessAdminPage(user) ?
                                <RolesProvider><Roles user={user} /></RolesProvider> :
                                <Redirect to={{ pathname: "/" }} />
                          )}
                        </UserContext.Consumer>
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
                      <Route path="/Review">
                        {user => (
                          user.loading ?
                            <>Loading...</> :
                            <Review user={user} />)}
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