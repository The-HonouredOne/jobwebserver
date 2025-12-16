require('dotenv').config();
const mongoose = require('mongoose');
const Job = require('../models/Job');

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const res = await Job.updateMany(
      { state: { $exists: false } },
      { $set: { state: 'Unknown' } }
    );
    console.log('Migration complete. Modified records:', res.modifiedCount);
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();