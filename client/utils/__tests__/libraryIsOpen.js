import sinon from 'sinon';
import libraryIsOpen from '../libraryIsOpen';

describe('libraryIsOpen', () => {
  it('false if closed_all_day', () => {
    const location = {
      in_range: true,
      location: 'Fraser Library',
      open_all_day: false,
      close_time: '12:00AM',
      open_time: '12:00AM',
      closed_all_day: true,
    };
    expect(libraryIsOpen(location)).toBe(false);
  });

  it('true if open_all_day', () => {
    const location = {
      in_range: true,
      location: 'Bennett Library',
      open_all_day: true,
      close_time: '12:00AM',
      open_time: '12:00AM',
      closed_all_day: false,
    };
    expect(libraryIsOpen(location)).toBe(true);
  });

  it('true if in_range AND actually in range', () => {
    const clock = sinon.useFakeTimers(
      new Date(2016, 11, 19, 12, 0, 0).getTime()
    );
    const location = {
      in_range: true,
      location: 'Belzberg Library',
      open_all_day: false,
      close_time: ' 5:00PM',
      open_time: '10:00AM',
      closed_all_day: false,
    };
    expect(libraryIsOpen(location)).toBe(true);
    clock.restore();
  });

  it('false if in_range AND NOT actually in range', () => {
    const clock = sinon.useFakeTimers(
      new Date(2016, 11, 19, 9, 0, 0).getTime()
    );
    const location = {
      in_range: true,
      location: 'Belzberg Library',
      open_all_day: false,
      close_time: ' 5:00PM',
      open_time: '10:00AM',
      closed_all_day: false,
    };
    expect(libraryIsOpen(location)).toBe(false);
    clock.restore();
  });
});
