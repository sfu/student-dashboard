import db from '../db';

export default async function loadUser(username, fields = '*') {
  try {
    const result = await db('users').select(fields).where({ username });
    return result.length ? result[0] : null;
  } catch (e) {
    throw e;
  }
}
