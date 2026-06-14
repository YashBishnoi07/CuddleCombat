import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const migrate = async () => {
  try {
    await connectDB();
    console.log('Connected to DB');

    const result = await User.updateMany(
      { avatar: '🦊' },
      { $set: { avatar: '👤' } }
    );

    console.log(`Updated ${result.modifiedCount} users from 🦊 to 👤`);
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
};

migrate();
