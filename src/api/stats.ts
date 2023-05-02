import { post } from "./requests";

export const logUniqueVisit = (): Promise<{}> =>
    post<{}>('stats/unique-visit', {});

export const logVisit = (url: string): Promise<{}> =>
    post<{}>('stats/page-visit', { page: url });