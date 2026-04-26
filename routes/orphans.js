const router = require('express').Router();
const Orphan = require('../models/Orphan');
const auth   = require('../middleware/auth');

// GET all
router.get('/', auth, async (req, res) => {
  try {
    const orphans = await Orphan.find({}).lean();
    res.json(orphans);
  } catch(err) { res.status(500).json({ error: err.message }); }
});

// PUT bulk replace (frontend sends full array after every change)
router.put('/', auth, async (req, res) => {
  try {
    const list = req.body;
    if (!Array.isArray(list)) return res.status(400).json({ error: 'Array expected' });

    // Upsert each orphan by its app-generated id
    const ops = list.map(o => ({
      updateOne: {
        filter: { id: o.id },
        update: { $set: o },
        upsert: true
      }
    }));
    if (ops.length) await Orphan.bulkWrite(ops);

    // Delete records not in the incoming list
    const ids = list.map(o => o.id);
    await Orphan.deleteMany({ id: { $nin: ids } });

    res.json({ ok: true, count: list.length });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

// DELETE single
router.delete('/:id', auth, async (req, res) => {
  try {
    await Orphan.deleteOne({ id: req.params.id });
    res.json({ ok: true });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
