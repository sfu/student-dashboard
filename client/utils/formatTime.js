import formatDate from 'date-fns/format';
import { TIME_FORMAT_12H_WITH_PERIOD, TIME_FORMAT_24H } from '../const';

export default (timestamp, format = '12h') => {
  const timeFormat =
    format === '12h' ? TIME_FORMAT_12H_WITH_PERIOD : TIME_FORMAT_24H;
  return formatDate(timestamp, timeFormat);
};
