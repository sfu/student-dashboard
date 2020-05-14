import { Router } from 'express';
import bodyParser from 'body-parser';
import db from '../../../../db';

const debug = require('debug')('snap:server:routes:api/v1/users/preferences');

const router = Router({ mergeParams: true });

router.use(bodyParser.json());

router.get('/', async (req, res) => {
  let { username } = req.params;
  let user = req.username.user || req.session.user;
  if (username === 'self') {
    username = user.username;
  }

  debug('%s - Getting preferences for %s', req.id, username);
  try {
    const preferencesText = (
      await db('users').where({ username }).select('preferences_text')
    )[0];
    const preferencesJson = JSON.parse(preferencesText.preferences_text);
    res.send(preferencesJson);
  } catch (e) {
    debug(
      '%s - Error getting preferences for %s: %s',
      req.id,
      username,
      e.message
    );
    res.boom.badImplementation();
  }
});

router.post('/', async (req, res) => {
  let { username } = req.params;
  let user = req.username.user || req.session.user;
  if (username === 'self') {
    username = user.username;
  }

  debug(
    '%s - Update preference %s for user %s',
    req.id,
    JSON.stringify(req.body),
    username
  );
  try {
    const { key, value } = req.body;

    // get existing bookmarks from db
    const preferencesText = (
      await db('users').where({ username }).select('preferences_text')
    )[0];
    const preferencesJson = JSON.parse(preferencesText.preferences_text);
    const nextPreferences = {
      ...preferencesJson,
      [key]: value,
    };

    debug(
      '%s - Updating preferences: %s',
      req.id,
      JSON.stringify(nextPreferences)
    );
    const result = await db('users')
      .where({ username })
      .update({ preferences_text: JSON.stringify(nextPreferences) });
    debug('%s - DB update result: %s', req.id, result);
    res.send(nextPreferences);
  } catch (e) {
    debug('%s - Error updating preferences: %s', req.id, e.message);
    res.boom.badImplementation();
  }
});

router.delete('/:preference', async (req, res) => {
  let { username } = req.params;
  let user = req.username.user || req.session.user;
  if (username === 'self') {
    username = user.username;
  }

  const { preference } = req.params;

  debug('%s - Delete preference %s for user %s', req.id, preference, username);
  try {
    // get existing bookmarks from db
    const preferencesText = (
      await db('users').where({ username }).select('preferences_text')
    )[0];
    const preferencesJson = JSON.parse(preferencesText.preferences_text);
    const nextPreferences = {
      ...preferencesJson,
    };
    if (nextPreferences.hasOwnProperty(preference)) {
      delete nextPreferences[preference];
    }

    debug(
      '%s - Updating preferences: %s',
      req.id,
      JSON.stringify(nextPreferences)
    );
    const result = await db('users')
      .where({ username })
      .update({ preferences_text: JSON.stringify(nextPreferences) });
    debug('%s - DB update result: %s', req.id, result);
    res.send(nextPreferences);
  } catch (e) {
    debug('%s - Error deleting preference: %s', req.id, e.message);
    res.boom.badImplementation();
  }
});

export default router;
