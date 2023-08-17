import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { __RouterContext } from 'react-router';
import React from 'react';

import {
  RegistrerPage,
  HomePage,
  LoginPage,
  ProfilePage,
  CreateEvent,
  EventPage,
  EventAdmin,
  EventOverview,
  EventRegisterPage,
  AdminPage,
  ConfirmationPage,
  RestorePasswordPage,
  ResetPasswordPage,
  Jobs,
  Job,
  AboutTD,
  StatsPage,
} from 'components/pages';
import { PrivateRoute, AuthorizationRoute, AdminRoute } from 'routes';
import Navbar from 'components/molecules/navbar/Navbar';
import ToastProvider from 'contexts/toastProvider';
import AnalyticsProvider from 'contexts/analyticsProvider';

const App: React.FC = () => {
  // parent path to track visits
  const monitorPaths = ['job', 'event'];
  return (
    <Router>
      <ToastProvider>
        <AnalyticsProvider paths={monitorPaths}>
          <Navbar />
          <Switch>
            <AuthorizationRoute path="/registrer" component={RegistrerPage} />
            <AuthorizationRoute path="/login" component={LoginPage} />
            <PrivateRoute path="/profile" component={ProfilePage} />
            <PrivateRoute path="/eventoverview" component={EventOverview} />
            <AdminRoute path="/create-event" component={CreateEvent} />
            <AdminRoute path="/admin" component={AdminPage} />
            <AdminRoute path="/event/:id/admin" component={EventAdmin} />
            <AdminRoute path="/stats" component={StatsPage} />
            <Route path="/event/:rid/register" component={EventRegisterPage} />
            <Route path="/event/:id" children={<EventPage />} />
            <Route
              path="/confirmation/:confirmationCode"
              children={<ConfirmationPage />}
            />
            <Route path="/restore-password" component={RestorePasswordPage} />
            <Route
              path="/reset-password/:resetPasswordCode"
              component={ResetPasswordPage}
            />
            <Route path="/job/:id" component={Job} />
            <Route path="/jobs" component={Jobs} />
            <Route
              path="/confirmation/:confirmationCode"
              children={<ConfirmationPage />}
            />
            <Route path="/about-us" component={AboutTD} />
            <Route path="/" component={HomePage} />
          </Switch>
        </AnalyticsProvider>
      </ToastProvider>
    </Router>
  );
};

export default App;
