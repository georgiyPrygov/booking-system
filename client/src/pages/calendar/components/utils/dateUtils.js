import moment from './moment';

export const currentTimezone = moment.tz.guess();
/**
 * This will create a 'moment' object that *is* moment.tz(), and automatically use the
 * 'timezone' used when you called 'getMoment()'
 */
export const getMoment = (timezone = currentTimezone) => {
  const m = (...args) => moment.tz(...args, timezone);
  m.localeData = moment.localeData;
  return m;
};

/**
 * 'datetime' is a JS Date object
 * 'tzMoment is the 'moment' object you got from 'getMoment()'
 */
export const convertDateTimeToDate = (datetime, tzMoment) => {
  return new Date(tzMoment(datetime).format()); // sets Date using ISO 8601 format
};

// *not* using this
export const convertDateToDateTime = (date, timezone) => {
  const m = moment.tz(date, timezone);
  return moment.tz(
    {
      year: m.year(),
      month: m.month(),
      date: m.date(),
      hour: m.hour(),
      minute: m.minute()
    },
    timezone
  );
};

/**
 * 'hour' is an integer from 0 - 23 specifying the hour to set on the Date
 * 'tzMoment is the 'moment' object you got from 'getMoment()'
 */
export const getTimeAsDate = (hour, tzMoment) => {
  if (hour < 0 || hour > 23) {
    throw Error(
      `*${hour}* is an invalid 'hour' value, which must be between 0 and 23.`
    );
  }
  const m = tzMoment('1970-01-01');
  return new Date(
    m
      .hour(hour)
      .minute(0)
      .format()
  );
};

/*
 * 'now' is your 'getNow' method
 * 'tzMoment is the 'moment' object you got from 'getMoment()'
 */
export const getNow = (now, tzMoment) => convertDateTimeToDate(now(), tzMoment);

export const dateRangeHeaderFormat = ({ start, end }, culture, localizer) =>
  `${localizer.format(start, 'ddd, MM/DD/YY', culture)} - ${localizer.format(
    end,
    'ddd, MM/DD/YY',
    culture
  )}`;

export const normalizeDates = (
  events,
  startField = 'start',
  endField = 'end'
) =>
  events.map(event => ({
    ...event,
    [startField]: new Date(event[startField]),
    [endField]: new Date(event[endField])
  }));
