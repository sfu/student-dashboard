import axios from 'axios';

export const FETCH_LIBRARY_HOURS_START = 'FETCH_LIBRARY_HOURS_START';
export const FETCH_LIBRARY_HOURS_SUCCESS = 'FETCH_LIBRARY_HOURS_SUCCESS';
export const FETCH_LIBRARY_HOURS_ERROR = 'FETCH_LIBRARY_HOURS_ERROR';
export const FETCH_LIBRARY_HOURS = 'FETCH_LIBRARY_HOURS';

const LIBRARY_HOURS_URL = 'https://www.sfu.ca/bin/library-hours.json';
const LIBRARY_CAMPUS_MAPPING = {
  'Bennett Library': 'Burnaby Campus',
  'Fraser Library': 'Surrey Campus',
  'Belzberg Library': 'Vancouver Campus',
};

export const fetchLibraryHoursStart = () => {
  return {
    type: FETCH_LIBRARY_HOURS_START,
  };
};

export const fetchLibraryHoursSuccess = (data) => {
  return {
    type: FETCH_LIBRARY_HOURS_SUCCESS,
    payload: {
      data,
    },
  };
};

export const fetchLibraryHoursError = (error) => {
  return {
    type: FETCH_LIBRARY_HOURS_ERROR,
    payload: {
      error: error,
    },
  };
};

export const fetchLibraryHours = () => {
  return (dispatch, getState) => {
    const lastUpdated = getState().library.hours.lastUpdated;
    const now = Date.now();
    if (!lastUpdated || now - lastUpdated > 3600000) {
      dispatch(fetchLibraryHoursStart());
      return axios
        .get(LIBRARY_HOURS_URL)
        .then(({ data }) => {
          const hours = data.map((item) => ({
            ...item,
            campus: LIBRARY_CAMPUS_MAPPING[item.location],
          }));
          dispatch(fetchLibraryHoursSuccess(hours));
        })
        .catch((error) => {
          dispatch(fetchLibraryHoursError(error));
        });
    }
  };
};
