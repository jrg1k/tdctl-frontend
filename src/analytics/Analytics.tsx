import { logUniqueVisit, logVisit } from 'api';
import { IPageVisit } from 'models/apiModels';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { findParentPath } from 'utils/path';

export interface IAnalytics {
  // paths the context should track visits
  paths: string[];
  // optional: turn off tracking on localhost
  localhost?: boolean;
}

const Analytics: React.FC<IAnalytics> = ({ paths, localhost }) => {
  const [uniqueVisit, setUniqueVisit] = useState(false);
  const location = useLocation();

  const followUniqueVisit = () => {
    if (!uniqueVisit) {
      return;
    }

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
      // no need to handle error
    }
  };

  // Automatically refresh token when it is expired
  useEffect(() => {
    followUniqueVisit();
  }, []);

  useEffect(() => {
    if (!uniqueVisit) {
      logUniqueVisit();
    }
  }, [uniqueVisit]);

  useEffect(() => {
    logUserVisit(location.pathname);
  }, [location.pathname]);

  return null;
};

export default Analytics;
