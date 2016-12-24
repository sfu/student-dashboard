// Simple wrapper around ReactGA.event that only fires if
// process.env.GOOGLE_ANALYTICS_CODE is defined

import ReactGA from 'react-ga'

export default obj => {
  if (process.env.GOOGLE_ANALYTICS_CODE) {
    ReactGA.event(obj)
  }
}
