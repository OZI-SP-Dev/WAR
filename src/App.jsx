import React, { Component } from 'react';
import { HashRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import Activities from './components/Activities/Activities';
import AppHeader from './components/appHeader/AppHeader';
import AppLeftNav from './components/appLeftNav/AppLeftNav';
import { ContactUsProvider } from './components/ContactUs/ContactUsProvider';
import Help from './components/Help/Help';
import { Review } from './components/Review/Review';
import { Roles } from './components/Roles/Roles';
import { RolesProvider } from "./components/Roles/RolesContext";
import { HistoryReport } from './components/WeeklyReport/HistoryReport';
import { MonthlyActivityReport } from './components/WeeklyReport/MonthlyActivityReport';
import { WeeklyReport } from "./components/WeeklyReport/WeeklyReport";
import { OrgsProvider } from "./providers/OrgsContext";
import { UserContext, UserProvider } from './providers/UserProvider';
import RoleUtilities from './utilities/RoleUtilities';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <UserProvider>
            <ContactUsProvider>
              <OrgsProvider>
                <AppHeader />
                <div id="top" className="container-fluid">
                  <div className="row">
                    <AppLeftNav />
                    <main className="col-md-9 ml-sm-auto col-lg-10 px-4" role="main">
                      <Switch>
                        <Route path="/Help">
                          <Help />
                        </Route>
                        <Route path="/MAR">
                          <UserContext.Consumer>
                            {user => (
                              user.loading ?
                                <>Loading...</> :
                                <MonthlyActivityReport user={user} />)}
                          </UserContext.Consumer>
                        </Route>
                        <Route path="/HistoryReport">
                          <UserContext.Consumer>
                            {user => (
                              user.loading ?
                                <>Loading...</> :
                                <HistoryReport user={user} />)}
                          </UserContext.Consumer>
                        </Route>
                        <Route path="/WAR">
                          <UserContext.Consumer>
                            {user => (
                              user.loading ?
                                <>Loading...</> :
                                <WeeklyReport user={user} />)}
                          </UserContext.Consumer>
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
                          <UserContext.Consumer>
                            {user => (
                              user.loading ?
                                <>Loading...</> :
                                <Review user={user} />)}
                          </UserContext.Consumer>
                        </Route>
                        <Route path="*">
                          <NoMatch />
                        </Route>
                      </Switch>
                    </main>
                  </div>
                </div>
              </OrgsProvider>
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