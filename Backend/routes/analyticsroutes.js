// server/routes/analytics.js

import express from 'express';
import mongoose from 'mongoose'; // ✅ import mongoose
import Appointment from '../models/appointment.js'; // ✅ path as per your project

const router = express.Router(); // ✅ fix here

// Route 1: Summary Data
router.get('/summary/:doctorId', async (req, res) => {
  try {
    const { doctorId } = req.params;

    const total = await Appointment.countDocuments({ doctorId });
    const pending = await Appointment.countDocuments({ doctorId, status: 'Pending' });
    const approved = await Appointment.countDocuments({ doctorId, status: 'Approved' });
    const inProgress = await Appointment.countDocuments({ doctorId, status: 'In Progress' });
    const completed = await Appointment.countDocuments({ doctorId, status: 'Completed' });

    res.json({ total, pending, approved, inProgress, completed });
  } catch (err) {
    console.error('Analytics fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Route 2: Chart Data (bar chart)
router.get('/doctor/:doctorId', async (req, res) => {
  try {
    const { doctorId } = req.params;

    const data = await Appointment.aggregate([
      { $match: { doctorId: new mongoose.Types.ObjectId(doctorId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(data);
  } catch (error) {
    console.error('Analytics fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
});

export default router;
