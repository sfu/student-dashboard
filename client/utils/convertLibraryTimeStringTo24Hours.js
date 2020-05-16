import leftPad from './leftPad';

export default (str) => {
  if (str === '12:00AM') {
    return '00:00';
  }

  const time = str.trim().split(':');
  let hour = time[0];
  const minute = time[1].substr(0, 2);
  const meridiem = time[1].substr(2, 2).toLowerCase();

  if (meridiem === 'pm') {
    hour = (parseInt(hour) + 12).toString();
  }

  return `${leftPad(hour, 2, '0')}:${minute}`;
};
