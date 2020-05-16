const generateSchedulesForRoute = (s) => {
  const destinations = [...new Set(s.Schedules.map((s) => s.Destination))];
  return destinations.map((d) => {
    return {
      ...s,
      Schedules: s.Schedules.filter((x) => x.Destination === d),
    };
  });
};

export default (data) => {
  return data.map(generateSchedulesForRoute).reduce((a, b) => a.concat(b), []);
};
