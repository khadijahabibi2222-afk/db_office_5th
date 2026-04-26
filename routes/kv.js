const router = require('express').Router();
const KVStore = require('../models/KVStore');
const auth    = require('../middleware/auth');

// GET /api/kv/:key
router.get('/:key', auth, async (req, res) => {
  try {
    const doc = await KVStore.findOne({ key: req.params.key }).lean();
    res.json(doc ? doc.data : []);
  } catch(err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/kv/:key  — replace entire array
router.put('/:key', auth, async (req, res) => {
  try {
    const data = req.body;
    await KVStore.updateOne(
      { key: req.params.key },
      { $set: { key: req.params.key, data } },
      { upsert: true }
    );
    res.json({ ok: true });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
