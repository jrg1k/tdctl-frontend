import { IPageVisit, IVisits } from 'models/apiModels';
import { useLocation } from 'react-router-dom';
import { get, post } from './requests';

export const logUniqueVisit = (): Promise<{}> =>
  post<{}>('stats/unique-visit', {});

export const getUniqueVisits = (
  start: string,
  end?: string
): Promise<IVisits[]> => {
  return get<IVisits[]>('stats/unique-visit', {
    start: start,
    // endpoint uses datenow if end is not specified
    ...(end && { end: end }),
  });
};

export const logVisit = (payload: IPageVisit) =>
  post<{}>('stats/page-visit', payload);
