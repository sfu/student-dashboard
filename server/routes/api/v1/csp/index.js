import { Router } from 'express';
import bodyParser from 'body-parser';
import db from '../../../../db';
const debug = require('debug')('snap:server:routes:api/v1/csp');

const router = Router();
router.use(
  bodyParser.json({
    type: ['json', 'application/csp-report'],
  })
);

router.post('/report', async (req, res) => {
  const report = req.body['csp-report'];
  const reportId = await db('csp_reports').returning('id').insert({
    request_id: req.id,
    report,
  });

  debug(
    '%s - CSP Violation - Report ID: %s \n%s',
    req.id,
    reportId,
    JSON.stringify(report)
  );
  res.status(204).end();
});

export default router;
