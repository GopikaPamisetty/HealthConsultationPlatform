import express from 'express';
import {
  getAllDoctors,
  getDoctorById,
  getDoctorProfile,
  getDoctorApprovalStatus, 
  updateDoctorProfile,
} from '../controllers/doctorController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();
const protect = authMiddleware();

// 🔓 Public (for patients)
router.get('/', getAllDoctors);

// 🔓 Public: Only approved doctors (for patient browsing)
router.get('/approved', (req, res) => {
  req.query.showAll = 'false'; // Force filter only approved
  getAllDoctors(req, res);
});

// 🔐 Private (for doctors)
router.get('/profile/me', protect, getDoctorProfile);
router.put('/profile/me', protect, upload.single('image'), updateDoctorProfile);
router.get('/approval-status', protect, getDoctorApprovalStatus);


// 🔓 Public (view single doctor by ID)
router.get('/:id', getDoctorById);




router.get(
  '/report/:appointmentId',
  authMiddleware('doctor'),
  async (req, res) => {
    try {
      const { appointmentId } = req.params;
      const appointment = await Appointment.findById(appointmentId);

      if (!appointment || !appointment.reportFile)
        return res.status(404).json({ msg: 'No report available' });

      res.download(appointment.reportFile);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);

export default router;
