import React, { useEffect, useState } from 'react';
import './uniqChart.scss';
import ReactEcharts from 'echarts-for-react';
import { getUniqueVisits } from 'api';
import { IVisits } from 'models/apiModels';
import { TooltipComponentFormatterCallbackParams } from 'echarts';
import { DateOptions, manipulateDate } from 'utils/date';
import Select from 'components/atoms/select/Select';

type IntervalOptions = 'day' | 'week' | 'month' | 'year' | 'all-time';

type IntervalDict = {
  [key in IntervalOptions]: DateOptions;
};

const UniqueVisitsCharts = () => {
  const [siteStats, setSiteStats] = useState<IVisits[] | undefined>();
  const [interval, setInterval] = useState<IntervalOptions>('month');

  // dict containing the date manipulation
  let dateInterval: IntervalDict = {
    day: { day: -1 },
    week: { day: -7 },
    month: { month: -1 },
    year: { year: -1 },
    'all-time': {},
  };

  interface StringDict {
    [key: string]: string;
  }

  // dict to convert key to chart display in Norwegian
  let keyToDisplayName: StringDict = {
    date: 'Dato',
    count: 'Besøk',
  };

  const fetchUniqueVisits = async (period: IntervalOptions) => {
    // removes millisecond
    const currentDate = new Date();
    const startDate = manipulateDate(currentDate, dateInterval[period]);
    console.log(currentDate.toISOString(), startDate.toISOString());
    // removes milliseconds from date string
    const start = startDate.toISOString().split('.')[0];
    const end = currentDate.toISOString().split('.')[0];
    console.log(start);
    try {
      const res = await getUniqueVisits(
        start,
        period === 'all-time' ? undefined : end
      );
      setSiteStats(res);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUniqueVisits(interval);
  }, [interval]);

  return (
    <div className="uniqueVisitChart">
      <div className="uniqueDropDownWrapper">
        <div className="uniqueDropDown">
          <Select
            name="interval"
            value={interval}
            label="Interval"
            maxWidth={25}
            items={[
              {
                key: 'day',
                label: 'I dag',
                value: 'day',
              },
              {
                key: 'week',
                label: 'Siste uke',
                value: 'week',
              },
              {
                key: 'month',
                label: 'Siste måned',
                value: 'month',
              },
              {
                key: 'year',
                label: 'Siste år',
                value: 'år',
              },
              {
                key: 'all-time',
                label: 'Hele historikken ',
                value: 'all-time',
              },
            ]}></Select>
        </div>
      </div>
      <div className="chart">
        <ReactEcharts
          option={{
            xAxis: {
              name: 'Dato',
              // type of field in dict
              type: 'time',
              axisLabel: {
                formatter: '{yyyy}-{MM}-{dd}',
                hideOverlap: true,
              },
            },
            yAxis: {
              name: 'Besøk',
              type: 'value',
              // removes vertical lines in background
              splitLine: {
                show: false,
              },
            },
            // allows data display on hover
            tooltip: {
              trigger: 'axis',
              type: 'item',
              formatter: (
                params: TooltipComponentFormatterCallbackParams
              ): string => {
                // formatter can be either single value or array
                const param = Array.isArray(params) ? params[0] : params;
                // closet to a type safe tooltip as dimensionNames is not type as keyof data
                let string = '';
                Object.entries(param.data).forEach(([k, v]) => {
                  // use display name if defined in dict
                  string += `${keyToDisplayName[k] ?? k}: ${
                    keyToDisplayName[v] ?? v
                  } <br />`;
                });
                return string;
              },
            },
            series: [
              {
                type: 'line',
                showSymbol: false,
              },
            ],
            dataset: {
              // sets the name of keys in dict
              dimensions: ['date', 'count'],
              source: siteStats ?? [],
            },
          }}
          style={{ display: 'flex', width: '100%', height: '450px' }}
        />
      </div>
    </div>
  );
};

export default UniqueVisitsCharts;
