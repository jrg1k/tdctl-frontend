import React, { useState, useEffect, createContext } from 'react';
import { getTokenInfo, renewToken } from 'api';

export const AnalyticsContext = createContext({
    uniqueVisit: false,
    setUniqueVisit: (_: boolean) => { }
});

const AnalyticsProvider: React.FC = ({ children }) => {
    const [uniqueVisit, setUniqueVisit] = useState(false);

    // Automatically refresh token when it is expired
    useEffect(() => {
        if (!uniqueVisit) {
            return;
        }

        const timeout = 1000 * 60 * 60 * 24;
        // reset uniqvisit every day to avoid unnecessary requests to stats api
        const timer = setInterval(() => setUniqueVisit(false), timeout);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <AnalyticsContext.Provider
            value={{
                uniqueVisit,
                setUniqueVisit
            }}>
            {children}
        </AnalyticsContext.Provider>
    );
};

export default AnalyticsProvider;