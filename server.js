require('dotenv').config();
const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');
const path      = require('path');

const app = express();

// ── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '50mb' }));      // large photos
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ── API Routes ──────────────────────────────────────────────
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/orphans',  require('./routes/orphans'));
app.use('/api/schools',  require('./routes/schools'));
app.use('/api/sponsors', require('./routes/sponsors'));
app.use('/api/users',    require('./routes/users'));
app.use('/api/kv',       require('./routes/kv'));

// ── Serve Frontend ──────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Database & Start ────────────────────────────────────────
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');

    // Seed default admin if no users exist
    const User = require('./models/User');
    const count = await User.countDocuments();
    if (count === 0) {
      await User.create([
        { username: 'admin',  password: 'admin123',  fullName: 'System Administrator', role: 'admin'  },
        { username: 'editor', password: 'edit123',   fullName: 'Data Editor',          role: 'editor' },
        { username: 'viewer', password: 'view123',   fullName: 'Read-Only Viewer',     role: 'viewer' },
      ]);
      console.log('✅ Default users seeded (admin/admin123)');
    }

    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
