import React, { useState, useEffect, createContext, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { findParentPath } from 'utils/path';
import { logVisit, logUniqueVisit } from 'api';
import { IPageVisit } from 'models/apiModels';
import { IAnalytics } from 'analytics/Analytics';
import { AuthenticateContext } from './authProvider';

// provider without sharing a value, the analytic context is only to ensure
// the analytic logic runs on every route
export const AnalyticsContext = createContext({
  setUniqueVisit: (_: boolean) => {},
});

// uses state to avoid sending unnecessary unique visit requests
// refresh resets the state
const AnalyticsProvider: React.FC<IAnalytics> = ({
  paths,
  localhost,
  children,
}) => {
  const { authenticated, isValidating } = useContext(AuthenticateContext);
  const [uniqueVisit, setUniqueVisit] = useState(false);
  const location = useLocation();

  const followUniqueVisit = () => {
    const timeout = 1000 * 60 * 60 * 24;
    // reset unique visit every day to avoid unnecessary requests to stats api
    const timer = setInterval(() => setUniqueVisit(false), timeout);

    return () => {
      clearInterval(timer);
    };
  };

  const validPath = (currentPath: string) => {
    const parentPath = findParentPath(currentPath);
    return parentPath !== undefined ? paths.includes(parentPath) : false;
  };

  const logUserVisit = (currentPath: string) => {
    if (localhost || !validPath(currentPath)) {
      return;
    }

    const payload = { page: currentPath } as IPageVisit;
    try {
      logVisit(payload);
    } catch (error) {
      // ignores logging errors
    }
  };

  useEffect(() => {
    // reset unique visit state after 24 hours
    followUniqueVisit();
  }, []);

  useEffect(() => {
    if (isValidating) {
      // wait until auth state is finished propagating
      return;
    }

    if (!authenticated) {
      // handles reseting state between login/logout
      setUniqueVisit(false);
      return;
    }

    if (!uniqueVisit) {
      try {
        logUniqueVisit();
        setUniqueVisit(true);
      } catch (error) {
        // ignores logging errors
        console.log(error);
      }
    }
  }, [uniqueVisit, authenticated, isValidating]);

  // tracks react router changes and logs the desired pages
  useEffect(() => {
    logUserVisit(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    console.log('unique state: ', uniqueVisit);
  }, [uniqueVisit]);

  return (
    <AnalyticsContext.Provider value={{ setUniqueVisit }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export default AnalyticsProvider;
