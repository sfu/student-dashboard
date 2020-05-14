const addItem = (add, item) => (add ? item : undefined);
const ifDev = (item) => addItem(process.env.NODE_ENV !== 'production', item);
const removeEmpty = (array) => array.filter((i) => !!i);

const SELF = `'self'`;
const UNSAFE_INLINE = `'unsafe-inline'`;
const UNSAFE_EVAL = `'unsafe-eval'`;
const connect = ['https://www.sfu.ca/'];
const frames = [
  'https://its-arcgis-web.its.sfu.ca/',
  'https://roomfinder.sfu.ca/',
];
const images = ['https:', 'data:'];
const scripts = ['https://www.google-analytics.com/'];

function getNonce(req, res) {
  return `'nonce-${res.locals.nonce}'`;
}

export default {
  reportUri: '/api/v1/csp/report',
  defaultSrc: [SELF],
  connectSrc: [SELF, ...connect],
  frameSrc: [SELF, ...frames],
  imgSrc: [SELF, ...images],
  scriptSrc: removeEmpty([SELF, ifDev(UNSAFE_EVAL), getNonce, ...scripts]),
  styleSrc: [SELF, UNSAFE_INLINE],
  upgradeInsecureRequests: true,
};
