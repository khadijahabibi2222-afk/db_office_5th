const router = require('express').Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Only admin can manage users
function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  next();
}

router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find({}).select('-password').lean();
    // Map to app format
    const mapped = users.map(u => ({
      id: u._id.toString(),
      username: u.username,
      fullName: u.fullName,
      role: u.role
    }));
    res.json(mapped);
  } catch(err) { res.status(500).json({ error: err.message }); }
});

router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { username, password, fullName, role } = req.body;
    const user = new User({ username, password, fullName, role });
    await user.save();
    res.json({ id: user._id, username, fullName, role });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const { username, password, fullName, role } = req.body;
    const update = { username, fullName, role };
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Not found' });
    if (username) user.username = username;
    if (fullName) user.fullName = fullName;
    if (role) user.role = role;
    if (password) user.password = password; // pre-save hook will hash
    await user.save();
    res.json({ ok: true });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
