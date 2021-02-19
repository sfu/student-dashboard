const { Router } = require('express');
const { RedisStore: PGTStore } = require('../pgt-store');
const redis = require('redis');

const router = Router();
const pgtStore = new PGTStore(
  redis.createClient({
    url: process.env.CAS_PGT_REDIS_URL,
  })
);

router.get('/:pgtcall?', async (req, res) => {
  const { pgtIou, pgtId, pgtiou } = req.query;
  // request is from a CAS client asking for a PGT
  if (req.params.pgtcall === 'getPGT') {
    const pgt = await pgtStore.get(pgtiou);
    if (pgt) {
      res.set('Content-Type', 'text/plain').status(200).send(pgt);
    } else {
      res
        .set('Content-Type', 'text/plain')
        .status(403)
        .send('Invalid PGTIOU supplied');
    }

    // request is from the CAS server providing a PGTIOU/PGT
  } else {
    res.status(200).send('ok');
    if (pgtIou && pgtId) {
      await pgtStore.set(pgtIou, pgtId);
    }
  }
});

module.exports = router;
