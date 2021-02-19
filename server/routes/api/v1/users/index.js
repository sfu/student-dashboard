const { Router } = require('express');
const bodyParser = require('body-parser');
const db = require('../../../../db');

const debug = require('debug')('snap:server:routes:api/v1/users');

const router = Router();

router.use(bodyParser.json());

router.use('/:username/transitBookmarks', require('./transitBookmarks'));
router.use('/:username/preferences', require('./preferences'));

router.get('/:username', async (req, res) => {
  let { username } = req.params;
  let user = req.username.user || req.session.user;
  if (username === 'self') {
    username = user.username;
  }
  debug('%s - Getting user profile for %s', req.id, username);
  if (username !== req.user.username) {
    res.boom.unauthorized();
    return;
  }
  const fields = [
    'id',
    'username',
    'uid',
    'lastname',
    'firstnames',
    'commonname',
    'barcode',
  ];
  const userRecord = await db('users')
    .where({ username })
    .select(fields)
    .first();
  if (userRecord) {
    res.send(userRecord);
  } else {
    res.boom.notFound();
  }
});

module.exports = router;
