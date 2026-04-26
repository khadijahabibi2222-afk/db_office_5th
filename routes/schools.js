const router = require('express').Router();
const School = require('../models/School');
const auth   = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try { res.json(await School.find({}).lean()); }
  catch(err) { res.status(500).json({ error: err.message }); }
});

router.put('/', auth, async (req, res) => {
  try {
    const list = req.body;
    if (!Array.isArray(list)) return res.status(400).json({ error: 'Array expected' });
    const ops = list.map(s => ({
      updateOne: { filter: { id: s.id }, update: { $set: s }, upsert: true }
    }));
    if (ops.length) await School.bulkWrite(ops);
    const ids = list.map(s => s.id);
    await School.deleteMany({ id: { $nin: ids } });
    res.json({ ok: true });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
