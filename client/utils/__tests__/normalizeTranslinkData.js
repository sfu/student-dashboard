import normalizeTranslinkData from '../normalizeTranslinkData';

describe('normalizeTranslinkData', () => {
  const thisIsFine = [
    {
      RouteNo: '004',
      RouteName: 'POWELL/DOWNTOWN/UBC',
      Direction: 'WEST',
      RouteMap: { Href: 'http://nb.translink.ca/geodata/004.kmz' },
      Schedules: [
        {
          Pattern: 'WB1',
          Destination: 'UBC',
          ExpectedLeaveTime: '3:50pm',
          ExpectedCountdown: 4,
          ScheduleStatus: ' ',
          CancelledTrip: false,
          CancelledStop: false,
          AddedTrip: false,
          AddedStop: false,
          LastUpdate: '03:43:42 pm',
        },
        {
          Pattern: 'WB1',
          Destination: 'UBC',
          ExpectedLeaveTime: '4:05pm',
          ExpectedCountdown: 19,
          ScheduleStatus: ' ',
          CancelledTrip: false,
          CancelledStop: false,
          AddedTrip: false,
          AddedStop: false,
          LastUpdate: '03:31:40 pm',
        },
        {
          Pattern: 'WB1',
          Destination: 'UBC',
          ExpectedLeaveTime: '4:20pm',
          ExpectedCountdown: 34,
          ScheduleStatus: ' ',
          CancelledTrip: false,
          CancelledStop: false,
          AddedTrip: false,
          AddedStop: false,
          LastUpdate: '03:45:31 pm',
        },
        {
          Pattern: 'WB1',
          Destination: 'UBC',
          ExpectedLeaveTime: '4:35pm',
          ExpectedCountdown: 49,
          ScheduleStatus: ' ',
          CancelledTrip: false,
          CancelledStop: false,
          AddedTrip: false,
          AddedStop: false,
          LastUpdate: '03:33:07 pm',
        },
        {
          Pattern: 'WB1',
          Destination: 'UBC',
          ExpectedLeaveTime: '4:50pm',
          ExpectedCountdown: 64,
          ScheduleStatus: '*',
          CancelledTrip: false,
          CancelledStop: false,
          AddedTrip: false,
          AddedStop: false,
          LastUpdate: '09:00:05 pm',
        },
        {
          Pattern: 'WB1',
          Destination: 'UBC',
          ExpectedLeaveTime: '5:05pm',
          ExpectedCountdown: 79,
          ScheduleStatus: '*',
          CancelledTrip: false,
          CancelledStop: false,
          AddedTrip: false,
          AddedStop: false,
          LastUpdate: '09:00:05 pm',
        },
      ],
    },
  ];
  const thisIsNotFine = [
    {
      RouteNo: '144',
      RouteName: 'SFU/METROTOWN STN              ',
      Direction: 'SOUTH',
      RouteMap: { Href: 'http://nb.translink.ca/geodata/144.kmz' },
      Schedules: [
        {
          Pattern: 'S1',
          Destination: 'METROTOWN STN',
          ExpectedLeaveTime: '3:45pm',
          ExpectedCountdown: 4,
          ScheduleStatus: '-',
          CancelledTrip: false,
          CancelledStop: false,
          AddedTrip: false,
          AddedStop: false,
          LastUpdate: '03:29:20 pm',
        },
        {
          Pattern: 'N1',
          Destination: 'SFU',
          ExpectedLeaveTime: '4:06pm',
          ExpectedCountdown: 25,
          ScheduleStatus: '-',
          CancelledTrip: false,
          CancelledStop: false,
          AddedTrip: false,
          AddedStop: false,
          LastUpdate: '03:40:25 pm',
        },
        {
          Pattern: 'S1',
          Destination: 'METROTOWN STN',
          ExpectedLeaveTime: '4:15pm',
          ExpectedCountdown: 34,
          ScheduleStatus: '-',
          CancelledTrip: false,
          CancelledStop: false,
          AddedTrip: false,
          AddedStop: false,
          LastUpdate: '02:53:04 pm',
        },
        {
          Pattern: 'N1',
          Destination: 'SFU',
          ExpectedLeaveTime: '4:44pm',
          ExpectedCountdown: 63,
          ScheduleStatus: '-',
          CancelledTrip: false,
          CancelledStop: false,
          AddedTrip: false,
          AddedStop: false,
          LastUpdate: '03:27:59 pm',
        },
        {
          Pattern: 'S1',
          Destination: 'METROTOWN STN',
          ExpectedLeaveTime: '4:47pm',
          ExpectedCountdown: 66,
          ScheduleStatus: '-',
          CancelledTrip: false,
          CancelledStop: false,
          AddedTrip: false,
          AddedStop: false,
          LastUpdate: '03:23:06 pm',
        },
        {
          Pattern: 'N1',
          Destination: 'SFU',
          ExpectedLeaveTime: '4:59pm',
          ExpectedCountdown: 78,
          ScheduleStatus: ' ',
          CancelledTrip: false,
          CancelledStop: false,
          AddedTrip: false,
          AddedStop: false,
          LastUpdate: '03:33:03 pm',
        },
      ],
    },
  ];

  it('When stops are all one destination', () => {
    expect(normalizeTranslinkData(thisIsFine)).toEqual(thisIsFine);
  });

  it('When stops have multiple destinations', () => {
    const result = normalizeTranslinkData(thisIsNotFine);
    expect(result.length).toBe(2);
    expect(result[0].Schedules.length).toBe(3);
    expect(result[1].Schedules.length).toBe(3);
  });
});
