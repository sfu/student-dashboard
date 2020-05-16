import express from 'express';
import session from 'express-session';
import uuid from 'uuid';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
import url from 'url';
import * as routes from './routes';
import webpack from 'webpack';
import WebpackDevMiddleware from 'webpack-dev-middleware';
import WebpackHotMiddleware from 'webpack-hot-middleware';
import devErrorHandler from 'errorhandler';
import ConnectRedis from 'connect-redis';
import boom from 'express-boom';
const HttpsProxyAgent = require('https-proxy-agent');
const { createProxyMiddleware } = require('http-proxy-middleware');
import requestId from 'express-request-id';
import methodOverride from 'method-override';
import cspDirectives from './cspDirectives';

const redis = require('promise-redis')();

const RedisStore = ConnectRedis(session);
const TRANSLINK_CACHE = redis.createClient(
  process.env.TRANSLINK_CACHE_REDIS_URL
);
const PRODUCTION = process.env.NODE_ENV === 'production';

const generateNonce = (req, res, next) => {
  const rhyphen = /-/g;
  res.locals.nonce = uuid.v4().replace(rhyphen, ``);
  next();
};

const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  name: process.env.SESSION_COOKIE_NAME || 'connect.sid',
  cookie: {
    secure: true,
    maxAge: 2592000000,
  },
  resave: false,
  rolling: true,
  saveUninitialized: false,
  store: new RedisStore({
    url: process.env.SESSION_STORE_REDIS_URL,
  }),
  genid(req) {
    if (req.query && req.query.ticket) {
      return `cas_session:::${req.query.ticket}`;
    } else {
      return uuid.v4();
    }
  },
};

export const createDevServer = (app) => {
  const webpackConfig = require('../webpack.config.js')();
  const compiler = webpack(webpackConfig);
  app.use(
    WebpackDevMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath,
      hot: true,
      quiet: false,
      noInfo: true,
      stats: {
        assets: true,
        colors: true,
        version: true,
        hash: true,
        timings: true,
        chunk: false,
      },
    })
  );
  app.set('compiler', compiler);
  app.use(WebpackHotMiddleware(compiler));
  return app;
};

const productionErrorHandler = (err, req, res, next) => {
  if (req.isApiRequest || req.headers.accept === 'application/json') {
    res.boom.badImplementation();
  } else {
    res.status(500).send('<p>Internal Server Error</p>');
  }
  console.error(err.stack); // eslint-disable-line no-console
  next(err);
};

export const createServer = (app) => {
  if (!PRODUCTION) {
    app = createDevServer(app);
  }
  app.set('views', path.resolve(__dirname, 'views'));
  app.set('view engine', 'ejs');
  app.set('TRANSLINK_CACHE', TRANSLINK_CACHE);
  app.set(
    'JWT_SIGNING_CERTIFICATE',
    fs.readFileSync(process.env.JWT_SIGNING_CERTIFICATE)
  );
  app.set('JWT_SIGNING_KEY', fs.readFileSync(process.env.JWT_SIGNING_KEY));
  app.set('JWT_SIGNING_ALG', 'RS512');
  app.use(session(sessionConfig));
  app.use(methodOverride('X-HTTP-Method-Override'));
  app.use(generateNonce);
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: cspDirectives,
        reportOnly: process.env.CSP_REPORT_ONLY === 'true' ? true : false,
        upgradeInsecureRequests: true,
      },
    })
  );
  app.use(requestId());
  app.use(express.static(path.resolve(__dirname, '../public')));
  app.use(boom());

  app.set('htmlDirectory', path.resolve(__dirname, '../public/assets'));

  // mount routes
  app.use('/pgt', routes.pgt);
  app.use('/auth', routes.auth);
  app.use('/api', routes.api);
  app.use('/graphql', routes.graphql);
  app.use(
    '/translink',
    createProxyMiddleware({
      target: 'https://api.translink.ca',
      changeOrigin: true,
      agent: new HttpsProxyAgent(process.env.https_proxy),
      headers: {
        accept: 'application/json',
      },
      pathRewrite: (path) => {
        const { query, pathname } = url.parse(path);
        const qs = query ? query.split('&') : [];
        qs.push(`apikey=${process.env.TRANSLINK_API_KEY}`);
        return `/RTTIAPI/V1${pathname.replace(/^\/translink/, '')}?${qs.join(
          '&'
        )}`;
      },
    })
  );

  app.use('/isup', (req, res) => {
    res.send('ok');
  });
  app.use('*', routes.app);

  // error handler
  app.use(PRODUCTION ? productionErrorHandler : devErrorHandler());
  return app;
};
