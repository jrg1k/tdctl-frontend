import { useContext, useEffect } from "react"
import { AnalyticsContext } from 'contexts/analyticsProvider';
import { logUniqueVisit } from 'api'
import { logVisit } from "../api/stats";

const useAnalytics = () => {
    const { uniqueVisit, setUniqueVisit } = useContext(AnalyticsContext);

    const logUserVisit = () => {
        if (uniqueVisit) {
            // todays visit already logged
            return;
        }
        // stas endpoint runs as background task so it will always return 200
        // i.e no need for handling or waiting for the response
        logUniqueVisit();
        setUniqueVisit(true);
    }

    const logPageVisit = () => {
        if (!uniqueVisit) {
            logUniqueVisit()
        }
        console.log(window.location.pathname)
        //  logVisit(url)
    }

    return { logUniqueVisit, logPageVisit }
}

export default useAnalytics;